// Interceptor global de requisições para silent token refresh
const originalFetch = window.fetch;
window.fetch = async function (url, options = {}) {
    let res = await originalFetch(url, options);

    const isApiRequest = typeof url === 'string' && url.includes('/api/v1');
    const isAuthRequest = typeof url === 'string' && (url.includes('/auth/login') || url.includes('/auth/refresh'));

    if (res.status === 401 && isApiRequest && !isAuthRequest) {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
            try {
                const refreshRes = await originalFetch('/api/v1/auth/refresh', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh_token: refreshToken })
                });

                if (refreshRes.ok) {
                    const data = await refreshRes.json();
                    localStorage.setItem('token', data.access_token);

                    // Atualiza o header Authorization nas opções
                    const newOptions = { ...options };
                    if (!newOptions.headers) {
                        newOptions.headers = {};
                    }

                    if (newOptions.headers instanceof Headers) {
                        newOptions.headers.set('Authorization', 'Bearer ' + data.access_token);
                    } else if (Array.isArray(newOptions.headers)) {
                        newOptions.headers = newOptions.headers.map(h =>
                            h[0].toLowerCase() === 'authorization' ? [h[0], 'Bearer ' + data.access_token] : h
                        );
                    } else {
                        newOptions.headers = { ...newOptions.headers };
                        newOptions.headers['Authorization'] = 'Bearer ' + data.access_token;
                    }

                    // Refaz a requisição original com o novo token
                    res = await originalFetch(url, newOptions);
                }
            } catch (err) {
                console.error('Erro silencioso na tentativa de refresh:', err);
            }
        }
    }
    return res;
};

// --- Core State & Data ---
const State = {
    currentUser: null,
    allRoles: [],
    allPermissions: [],
    allCreds: [],
    allUsers: [],
    allPlans: [],
    allRequests: [],
    allAnnouncements: [],
    currentRequestFilter: 'ALL',
    dashboardIntervalId: null,
    currentZoomRange: null,
    isUpdatingChart: false,
    previewTimeoutId: null,
    logsCurrentPage: 1
};

const Data = {
    async fetch(url, options = {}) {
        const token = localStorage.getItem('token');
        const res = await fetch(url, {
            ...options,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        if (res.status === 401) {
            Auth.logout();
            return res;
        }

        if (res.status >= 400 && res.status < 500) {
            try {
                const clone = res.clone();
                const data = await clone.json();
                const msg = data.message || 'Erro inesperado';
                alert(`Erro ${res.status}: ${Array.isArray(msg) ? msg.join(', ') : msg}`);
            } catch (e) {
                console.error('Erro ao ler corpo da resposta de erro', e);
            }
        }

        return res;
    },
    async fetchAll() {
        const canViewUsers = State.currentUser.permissions.includes('core.user.view');
        const canViewRequests = State.currentUser.permissions.includes('integration-request.view');
        const canViewAnns = State.currentUser.permissions.includes('core.announcement.view');

        if (canViewRequests) this.fetchRequests();
        if (canViewAnns) this.fetchAnnouncements();
        if (canViewUsers) {
            this.fetchUsers();
            this.fetchRoles();
            this.fetchPermissions();
            this.fetchCreds();
            this.fetchPlans();
        }
    },
    async fetchAnnouncements() {
        const res = await this.fetch(`${API_URL}/announcements/admin/all`);
        if (res.ok) {
            State.allAnnouncements = await res.json();
            const section = document.getElementById('section-announcements');
            if (section) section.innerHTML = Components.AnnouncementTable(State.allAnnouncements);
        }
    },
    async deleteAnnouncement(id) {
        if (confirm('Excluir este aviso?')) {
            const res = await this.fetch(`${API_URL}/announcements/${id}`, { method: 'DELETE' });
            if (res.ok) this.fetchAnnouncements();
        }
    },
    async fetchRequests() {
        try {
            const res = await this.fetch('/integration/list');
            if (res.ok) {
                State.allRequests = await res.json();
                UI.renderRequests();
            }
        } catch (error) {
            console.error('Erro ao buscar solicitações:', error);
            document.getElementById('section-requests').innerHTML = `
                <div class="card" style="text-align: center; padding: 2rem; color: var(--danger);">
                    <i class='bx bx-error-circle' style="font-size: 2rem;"></i>
                    <p>Erro ao carregar solicitações. Verifique o console.</p>
                </div>
            `;
        }
    },
    async fetchUsers() {
        const res = await this.fetch(`${API_URL}/users`);
        State.allUsers = await res.json();
        document.getElementById('section-users').innerHTML = Components.UserTable(State.allUsers);
    },
    async deleteInvite(id) {
        if (!confirm('Deseja realmente revogar este convite?')) return;
        const res = await this.fetch(`${API_URL}/user-invitations/${id}`, { method: 'DELETE' });
        if (res.ok) this.fetchUsers(); // Refresh both since user is deleted too
    },
    async resendInvite(id) {
        const res = await this.fetch(`${API_URL}/user-invitations/${id}/resend`, { method: 'POST' });
        if (res.ok) {
            alert('Convite reenviado com sucesso!');
            this.fetchUsers();
        }
    },
    async fetchRoles() {
        const res = await this.fetch(`${API_URL}/roles`);
        State.allRoles = await res.json();
        document.getElementById('section-roles').innerHTML = Components.RoleTable(State.allRoles);
    },
    async fetchCreds() {
        const res = await this.fetch(`${API_URL}/db-credentials`);
        State.allCreds = await res.json();
        document.getElementById('section-creds').innerHTML = Components.CredTable(State.allCreds);
    },
    async fetchPermissions() {
        const res = await this.fetch(`${API_URL}/permissions`);
        State.allPermissions = await res.json();
    },
    async fetchPlans() {
        const res = await this.fetch(`${API_URL}/plans`);
        State.allPlans = await res.json();
    },
    async updateRequestStatus(id, status, rejectionReason = null) {
        const res = await this.fetch(`/integration/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status, rejectionReason })
        });
        if (res.ok) this.fetchRequests();
    },
    async deleteRequest(id) {
        if (confirm('Excluir solicitação?')) {
            await this.fetch(`/integration/${id}`, { method: 'DELETE' });
            this.fetchRequests();
        }
    },
    async deleteUser(id) {
        if (confirm('Excluir usuário?')) {
            await this.fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
            this.fetchUsers();
        }
    },
    async deleteRole(id) {
        if (confirm('Excluir role?')) {
            const res = await this.fetch(`${API_URL}/roles/${id}`, { method: 'DELETE' });
            if (res.ok) this.fetchRoles();
            else alert('Erro ao excluir (possui usuários?)');
        }
    },
    async deleteCred(id) {
        if (confirm('Excluir credencial?')) {
            await this.fetch(`${API_URL}/db-credentials/${id}`, { method: 'DELETE' });
            this.fetchCreds();
        }
    },
    async testCred(id) {
        try {
            const btn = document.getElementById(`btn-test-${id}`);
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = 'Testando...';
            }

            const res = await this.fetch(`${API_URL}/db-credentials/${id}/test`);
            if (res.ok) {
                const data = await res.json();
                if (data.status === 'up') {
                    alert(`✅ Conexão bem-sucedida!\nTempo de resposta: ${data.responseTimeMs}ms`);
                } else {
                    alert(`❌ Falha na conexão:\n${data.error || 'Erro desconhecido'}`);
                }
            }
        } catch (error) {
            console.error('Erro ao testar conexão:', error);
            alert('Erro inesperado ao testar conexão.');
        } finally {
            const btn = document.getElementById(`btn-test-${id}`);
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = 'Testar conexão';
            }
        }
    },
    async fetchUptimeStatus() {
        try {
            // Usando o novo endpoint público sem prefixo api/v1
            const res = await fetch('/status/data');
            if (res.ok) {
                const data = await res.json();
                const statusEl = document.getElementById('uptime-status');
                if (statusEl && data.current) {
                    const isUp = data.current.apiStatus === 'UP';
                    statusEl.innerHTML = isUp
                        ? '<span style="color: #10b981; font-weight: 700;">● Online</span>'
                        : '<span style="color: #ef4444; font-weight: 700;">● Offline</span>';
                }
            }
        } catch (e) {
            console.error('Erro ao buscar status do sistema', e);
        }
    },
    changeLogsPage(page) {
        State.logsCurrentPage = page;
        this.fetchDashboard(true);
    },
    async fetchDashboard(isPagination = false) {
        if (!isPagination) {
            State.logsCurrentPage = 1;
        }
        State.currentZoomRange = null;
        const dateFilter = document.getElementById('dashboard-date-filter')?.value || '30days';
        let startDate, endDate;
        const now = new Date();
        if (dateFilter === '1h') {
            startDate = new Date(now.getTime() - 1 * 60 * 60 * 1000);
        } else if (dateFilter === '6h') {
            startDate = new Date(now.getTime() - 6 * 60 * 60 * 1000);
        } else if (dateFilter === '24h') {
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        } else if (dateFilter === '7days') {
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else {
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
        endDate = now;

        const startStr = startDate.toISOString();
        const endStr = endDate.toISOString();

        try {
            const [resSummary, resUsers, resEndpoints, resStatus, resTimeSeries, resAlerts, resDBLoad, resPlanDist, resHeartbeat, resRequestLogs] = await Promise.all([
                this.fetch(`${API_URL}/dashboard/summary?startDate=${startStr}&endDate=${endStr}`),
                this.fetch(`${API_URL}/dashboard/top-users?startDate=${startStr}&endDate=${endStr}&limit=10`),
                this.fetch(`${API_URL}/dashboard/top-endpoints?startDate=${startStr}&endDate=${endStr}&limit=10`),
                this.fetch(`${API_URL}/dashboard/status-distribution?startDate=${startStr}&endDate=${endStr}`),
                this.fetch(`${API_URL}/dashboard/time-series?startDate=${startStr}&endDate=${endStr}`),
                this.fetch(`${API_URL}/dashboard/proactive-alerts`),
                this.fetch(`${API_URL}/dashboard/database-load?startDate=${startStr}&endDate=${endStr}&limit=10`),
                this.fetch(`${API_URL}/dashboard/plan-distribution?startDate=${startStr}&endDate=${endStr}`),
                this.fetch(`${API_URL}/dashboard/heartbeat`),
                this.fetch(`${API_URL}/dashboard/request-logs?startDate=${startStr}&endDate=${endStr}&page=${State.logsCurrentPage}&limit=50`)
            ]);

            if (!resSummary.ok || !resUsers.ok || !resEndpoints.ok || !resStatus.ok || !resTimeSeries.ok || !resAlerts.ok || !resDBLoad.ok || !resPlanDist.ok || !resHeartbeat.ok || !resRequestLogs.ok) {
                throw new Error("Erro ao carregar os dados do dashboard.");
            }

            const summary = await resSummary.json();
            const topUsers = await resUsers.json();
            const topEndpoints = await resEndpoints.json();
            const statusDist = await resStatus.json();
            const timeSeries = await resTimeSeries.json();
            const proactiveAlerts = await resAlerts.json();
            const databaseLoad = await resDBLoad.json();
            const planDist = await resPlanDist.json();
            const heartbeat = await resHeartbeat.json();
            const requestLogs = await resRequestLogs.json();

            const section = document.getElementById('section-dashboard');
            if (section) {
                const prevFilter = dateFilter;
                section.innerHTML = Components.DashboardContent(summary, topUsers, topEndpoints, proactiveAlerts, databaseLoad, planDist, heartbeat, requestLogs);
                document.getElementById('dashboard-date-filter').value = prevFilter;

                this.renderDashboardCharts(statusDist, timeSeries);
                this.startDashboardRefresh();
            }
        } catch (error) {
            console.error('Erro ao buscar dados do dashboard:', error);
            const section = document.getElementById('section-dashboard');
            if (section) {
                section.innerHTML = `
                    <div class="card" style="text-align: center; padding: 2rem; color: var(--danger);">
                        <i class='bx bx-error-circle' style="font-size: 2rem;"></i>
                        <p>Erro ao carregar o dashboard. Verifique a conexão com o servidor.</p>
                    </div>
                `;
            }
        }
    },

    stopDashboardRefresh() {
        if (State.dashboardIntervalId) {
            clearInterval(State.dashboardIntervalId);
            State.dashboardIntervalId = null;
        }
        const countdownEl = document.getElementById('dashboard-refresh-countdown');
        if (countdownEl) {
            countdownEl.style.display = 'none';
        }
    },

    startDashboardRefresh() {
        this.stopDashboardRefresh();
        if (localStorage.getItem('dashboard-auto-refresh') !== 'true') return;

        let timeLeft = 30 * 60; // 30 minutos em segundos
        const countdownEl = document.getElementById('dashboard-refresh-countdown');
        if (countdownEl) {
            countdownEl.style.display = 'inline';
            const formatTime = (s) => {
                const m = Math.floor(s / 60);
                const sec = s % 60;
                return `(${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')})`;
            };
            countdownEl.innerText = formatTime(timeLeft);

            State.dashboardIntervalId = setInterval(() => {
                timeLeft--;
                if (timeLeft <= 0) {
                    timeLeft = 30 * 60;
                    this.fetchDashboard();
                } else {
                    countdownEl.innerText = formatTime(timeLeft);
                }
            }, 1000);
        }
    },

    toggleDashboardRefresh(checkbox) {
        localStorage.setItem('dashboard-auto-refresh', checkbox.checked ? 'true' : 'false');
        if (checkbox.checked) {
            this.startDashboardRefresh();
        } else {
            this.stopDashboardRefresh();
        }
    },

    async fetchZoomedTimeSeries(startStr, endStr) {
        try {
            const res = await this.fetch(`${API_URL}/dashboard/time-series?startDate=${startStr}&endDate=${endStr}`);
            if (res.ok) {
                const timeSeries = await res.json();
                this.renderDashboardCharts(null, timeSeries);
            }
        } catch (error) {
            console.error('Erro ao buscar dados de zoom:', error);
        }
    },

    getDateRange() {
        const dateFilter = document.getElementById('dashboard-date-filter')?.value || '30days';
        let startDate, endDate;
        const now = new Date();
        if (dateFilter === '1h') {
            startDate = new Date(now.getTime() - 1 * 60 * 60 * 1000);
        } else if (dateFilter === '6h') {
            startDate = new Date(now.getTime() - 6 * 60 * 60 * 1000);
        } else if (dateFilter === '24h') {
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        } else if (dateFilter === '7days') {
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else {
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
        endDate = now;
        return { startStr: startDate.toISOString(), endStr: endDate.toISOString() };
    },

    async downloadInternalDossier() {
        const btn = document.getElementById('btn-export-dossier');
        let originalHtml = '';
        if (btn) {
            originalHtml = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = `<i class='bx bx-loader-alt bx-spin' style="font-size: 1.2rem;"></i> Gerando...`;
        }

        try {
            const { startStr, endStr } = this.getDateRange();
            const res = await this.fetch(`${API_URL}/dashboard/dossier?type=internal&startDate=${startStr}&endDate=${endStr}`);
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dossie-interno-de-${startStr.slice(0, 9)}-a-${endStr.slice(0, 9)}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Erro ao baixar dossiê:', error);
            alert('Erro ao gerar e baixar o dossiê interno.');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = originalHtml;
            }
        }
    },

    async downloadClientDossier(userId, username) {
        const btnTop = document.getElementById(`btn-export-client-${userId}`);
        const btnUser = document.getElementById(`btn-export-user-${userId}`);
        const btns = [btnTop, btnUser].filter(b => b !== null);
        const originalHtmls = btns.map(b => b.innerHTML);

        btns.forEach(b => {
            b.disabled = true;
            b.innerHTML = `<i class='bx bx-loader-alt bx-spin' style="font-size: 1.1rem;"></i>`;
        });

        try {
            const { startStr, endStr } = this.getDateRange();
            const res = await this.fetch(`${API_URL}/dashboard/dossier?type=client&userId=${userId}&startDate=${startStr}&endDate=${endStr}`);
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dossie-cliente-${username.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Erro ao baixar dossiê do cliente:', error);
            alert(`Erro ao gerar e baixar o dossiê para ${username}.`);
        } finally {
            btns.forEach((b, index) => {
                b.disabled = false;
                b.innerHTML = originalHtmls[index];
            });
        }
    },

    renderDashboardCharts(statusDist, timeSeries) {
        if (statusDist) {
            const statusLabels = statusDist.map(s => s.statusClass);
            const statusSeries = statusDist.map(s => s.count);
            const statusColors = statusLabels.map(label => {
                if (label === '2xx') return '#10B981';
                if (label === '3xx') return '#6B7280';
                if (label === '429') return '#F59E0B';
                if (label === '4xx') return '#EF4444';
                if (label === '5xx') return '#8B5CF6';
                return '#9CA3AF';
            });

            const statusOptions = {
                series: statusSeries,
                labels: statusLabels,
                chart: {
                    type: 'donut',
                    height: 300,
                    foreColor: '#9CA3AF',
                    background: 'transparent'
                },
                colors: statusColors,
                dataLabels: {
                    enabled: false
                },
                legend: {
                    position: 'bottom',
                    horizontalAlign: 'center',
                    labels: {
                        colors: '#9CA3AF'
                    }
                },
                theme: {
                    mode: 'dark'
                },
                stroke: {
                    colors: ['var(--card-bg)']
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '70%',
                            background: 'transparent',
                            labels: {
                                show: true,
                                name: {
                                    show: true,
                                    color: '#9CA3AF'
                                },
                                value: {
                                    show: true,
                                    color: 'white',
                                    formatter: (val) => Number(val).toLocaleString()
                                },
                                total: {
                                    show: true,
                                    label: 'Total',
                                    color: '#9CA3AF',
                                    formatter: (w) => {
                                        return w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString();
                                    }
                                }
                            }
                        }
                    }
                }
            };

            const chartStatusEl = document.querySelector("#chart-status-dist");
            if (chartStatusEl) {
                chartStatusEl.innerHTML = '';
                const chartStatus = new ApexCharts(chartStatusEl, statusOptions);
                chartStatus.render();
            }
        }

        const tsCountSeries = timeSeries.map(t => ({
            x: new Date(t.timestamp).getTime(),
            y: t.count
        }));
        const tsSuccessSeries = timeSeries.map(t => ({
            x: new Date(t.timestamp).getTime(),
            y: t.success
        }));
        const tsErrorSeries = timeSeries.map(t => ({
            x: new Date(t.timestamp).getTime(),
            y: t.error
        }));

        const tsOptions = {
            series: [
                {
                    name: 'Total de Requisições',
                    data: tsCountSeries
                },
                {
                    name: 'Sucesso (2xx)',
                    data: tsSuccessSeries
                },
                {
                    name: 'Falhas (4xx/5xx)',
                    data: tsErrorSeries
                }
            ],
            chart: {
                type: 'area',
                height: 300,
                toolbar: {
                    show: true,
                    tools: {
                        download: false,
                        selection: true,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset: true
                    },
                    autoSelected: 'zoom'
                },
                foreColor: '#9CA3AF',
                background: 'transparent',
                events: {
                    zoomed: async (chartContext, { xaxis }) => {
                        if (State.isUpdatingChart) return;
                        if (xaxis.min && xaxis.max) {
                            const startStr = new Date(xaxis.min).toISOString();
                            const endStr = new Date(xaxis.max).toISOString();

                            if (State.currentZoomRange &&
                                Math.abs(State.currentZoomRange.min - xaxis.min) < 10000 &&
                                Math.abs(State.currentZoomRange.max - xaxis.max) < 10000) {
                                return;
                            }
                            State.currentZoomRange = { min: xaxis.min, max: xaxis.max };

                            State.isUpdatingChart = true;
                            try {
                                await Data.fetchZoomedTimeSeries(startStr, endStr);
                            } finally {
                                setTimeout(() => {
                                    State.isUpdatingChart = false;
                                }, 300);
                            }
                        }
                    }
                }
            },
            colors: ['#3B82F6', '#10B981', '#EF4444'],
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 2
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.2,
                    opacityTo: 0.02,
                    stops: [0, 90, 100]
                }
            },
            grid: {
                borderColor: 'rgba(255,255,255,0.05)'
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    style: {
                        colors: '#9CA3AF'
                    },
                    datetimeUTC: false
                },
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: '#9CA3AF'
                    },
                    formatter: (val) => Math.round(val).toLocaleString()
                }
            },
            tooltip: {
                theme: 'dark'
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                labels: {
                    colors: '#9CA3AF'
                }
            },
            theme: {
                mode: 'dark'
            }
        };

        const chartTimeSeriesEl = document.querySelector("#chart-time-series");
        if (chartTimeSeriesEl) {
            chartTimeSeriesEl.innerHTML = '';
            const chartTimeSeries = new ApexCharts(chartTimeSeriesEl, tsOptions);
            chartTimeSeries.render();
        }
    }
};

// --- Auth & Initial Load ---
const Auth = {
    async login(e) {
        if (e) e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me')?.checked;
        const auth = btoa(user + ':' + pass);
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Authorization': 'Basic ' + auth }
        });
        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.access_token);
            if (rememberMe) {
                localStorage.setItem('refresh_token', data.refresh_token);
            } else {
                localStorage.removeItem('refresh_token');
            }
            this.check();
        } else {
            const err = document.getElementById('login-error');
            if (err) err.classList.remove('hidden');
            else alert('Credenciais inválidas');
        }
    },
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.reload();
    },
    async check() {
        const token = localStorage.getItem('token');
        if (!token) {
            const loginContainer = document.getElementById('login-container');
            if (loginContainer) loginContainer.classList.remove('hidden');
            return;
        }
        const res = await Data.fetch(`${API_URL}/auth/me`);
        if (res.ok) {
            State.currentUser = await res.json();
            UI.setup();
        } else {
            this.logout();
        }
    }
};

// Listeners
document.addEventListener('DOMContentLoaded', () => {
    Auth.check();
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => Auth.login(e));
    }
});

// --- Constants & Helpers ---
const LABEL_MAP = {
    // Módulos
    'core': 'Sistema (Core)',
    'tenant': 'Dados ERP (Tenant)',
    'integration-request': 'Solicitações (Painel)',

    // Entidades
    'user': 'Usuários & Roles',
    'products': 'Produtos',
    'stores': 'Lojas',
    'payment-methods': 'Meios de Pagamento',
    'orders': 'Pedidos / Vendas',
    'brands': 'Marcas',
    'groups': 'Grupos',
    'clients': 'Clientes',
    'account-receivable': 'Contas a Receber',
    'employees': 'Funcionários',
    'suppliers': 'Fornecedores',
    'service-providers': 'Prestadores de Serviço',
    'deliveries': 'Entregas',
    'announcement': 'Avisos & Notificações',
    'dbcredential': 'Credenciais DB',
    'payment-plans': 'Planos de Pagamento',
    'account-payable': 'Contas a Pagar',

    // Ações do painel de solicitação
    'approve': 'Aprovar',
    'create': 'Criar',
    'reject': 'Recusar',
    'delete': 'Deletar',
    'update': 'Atualizar',
    'view': 'Visualizar',
    'edit': 'Editar'
};

// --- UI Interactions & Modals ---
const UI = {
    setup() {
        const canViewRequests = State.currentUser.permissions.includes('integration-request.view');
        const canViewUsers = State.currentUser.permissions.includes('core.user.view');
        const canViewDashboard = State.currentUser.permissions.includes('core.dashboard.view');

        // Security check: If user has no business here, send them to the Client Portal
        if (!canViewRequests && !canViewUsers && !canViewDashboard) {
            window.location.href = '/integration/client';
            return;
        }

        const loginContainer = document.getElementById('login-container');
        if (loginContainer) loginContainer.classList.add('hidden');

        const adminWrapper = document.getElementById('admin-wrapper');
        if (adminWrapper) adminWrapper.classList.remove('hidden');

        document.getElementById('user-display').innerText = State.currentUser.username;
        const avatarEl = document.getElementById('user-avatar');
        if (avatarEl) {
            avatarEl.innerText = (State.currentUser.username || 'A').charAt(0).toUpperCase();
        }

        // Default tab logic based on permissions and URL hash
        const hash = window.location.hash.replace('#', '');
        let defaultTab = 'links';

        if (canViewDashboard) {
            document.getElementById('tab-dashboard').classList.remove('hidden');
            defaultTab = 'dashboard';
        }
        if (canViewRequests) {
            document.getElementById('tab-requests').classList.remove('hidden');
            if (defaultTab === 'links') defaultTab = 'requests';
        }
        if (canViewUsers) {
            ['tab-users', 'tab-roles', 'tab-creds'].forEach(id => document.getElementById(id).classList.remove('hidden'));
            if (defaultTab === 'links') defaultTab = 'users';
        }

        const canViewAnns = State.currentUser.permissions.includes('core.announcement.view');
        if (canViewAnns) {
            document.getElementById('tab-announcements').classList.remove('hidden');
        }

        // Switch to the tab from hash or the prioritized default
        switchTab(hash || defaultTab, false);

        Data.fetchAll();
        Data.fetchUptimeStatus();
    },
    renderRequests() {
        const section = document.getElementById('section-requests');
        const filtered = State.currentRequestFilter === 'ALL'
            ? State.allRequests
            : State.allRequests.filter(r => r.status === State.currentRequestFilter);

        let content = Components.RequestFilterTabs(State.currentRequestFilter);

        if (filtered.length === 0) {
            content += `
                <div class="card" style="text-align: center; padding: 4rem; background: rgba(16, 185, 129, 0.05); border: 1px dashed var(--primary);">
                    <div style="font-size: 4rem; color: var(--primary); margin-bottom: 1.5rem;"><i class='bx bx-check-circle'></i></div>
                    <h2 style="color: #fff; margin-bottom: 1rem;">Tudo limpo por aqui!</h2>
                    <p style="color: var(--text-muted);">Nenhuma solicitação encontrada com este filtro.</p>
                </div>
            `;
        } else {
            content += `<div class="requests-grid">${filtered.map(Components.RequestCard).join('')}</div>`;
        }

        section.innerHTML = content;
    },
    toggleDetails(id) {
        const el = document.getElementById(`details-${id}`);
        const btn = el.previousElementSibling;
        el.classList.toggle('hidden');
        btn.querySelector('span').innerText = el.classList.contains('hidden') ? '+' : '-';
    },
    promptRejection(id) {
        const reason = prompt('Por favor, informe o motivo da recusa:');
        if (reason !== null) {
            Data.updateRequestStatus(id, 'REJECTED', reason);
        }
    },
    closeModal() {
        document.getElementById('modal-container').classList.add('hidden');
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    },
    openDossierRangeModal(userId, username) {
        document.getElementById('modal-container').classList.remove('hidden');
        const modal = document.getElementById('dossier-modal');
        modal.classList.remove('hidden');
        modal.innerHTML = `
            <div class="modal-header">
                <h3>Exportar Dossiê do Cliente</h3>
                <button onclick="UI.closeModal()" style="background: none; border: none; cursor: pointer; font-size: 1.5rem; color: white;">&times;</button>
            </div>
            <form onsubmit="UI.submitClientDossierExport(event)">
                <input type="hidden" id="export-dossier-userId" value="${userId}">
                <input type="hidden" id="export-dossier-username" value="${username}">
                <div class="form-group">
                    <label>Cliente / Empresa</label>
                    <div style="font-weight: 600; color: white; padding: 8px 0;">${username}</div>
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>Período do Dossiê</label>
                    <select id="export-dossier-range" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border); background: var(--card-bg); color: white; font-weight: 500; outline: none; margin-top: 6px;">
                        <option value="1h">Última 1 hora</option>
                        <option value="6h">Últimas 6 horas</option>
                        <option value="24h">Últimas 24 horas</option>
                        <option value="7days">Últimos 7 dias</option>
                        <option value="30days" selected>Últimos 30 dias</option>
                    </select>
                </div>
                <div style="display: flex; gap: 8px; margin-top: 24px;">
                    <button type="button" class="btn btn-outline" onclick="UI.closeModal()" style="flex: 1; padding: 10px; font-weight: 600;">Cancelar</button>
                    <button type="submit" id="btn-export-dossier-submit" class="btn" style="background: #f59e0b; color: white; flex: 1; font-weight: 600; padding: 10px; justify-content: center; align-items: center; gap: 8px; width: auto; display: inline-flex;">
                        <i class='bx bxs-file-pdf' style="font-size: 1.2rem;"></i> Exportar PDF
                    </button>
                </div>
            </form>
        `;
    },
    async submitClientDossierExport(event) {
        event.preventDefault();
        const userId = document.getElementById('export-dossier-userId').value;
        const username = document.getElementById('export-dossier-username').value;
        const range = document.getElementById('export-dossier-range').value;

        const btn = document.getElementById('btn-export-dossier-submit');
        let originalHtml = '';
        if (btn) {
            originalHtml = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = `<i class='bx bx-loader-alt bx-spin' style="font-size: 1.2rem;"></i> Gerando...`;
        }

        try {
            let startDate, endDate;
            const now = new Date();
            if (range === '1h') {
                startDate = new Date(now.getTime() - 1 * 60 * 60 * 1000);
            } else if (range === '6h') {
                startDate = new Date(now.getTime() - 6 * 60 * 60 * 1000);
            } else if (range === '24h') {
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            } else if (range === '7days') {
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            } else {
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            }
            endDate = now;

            const startStr = startDate.toISOString();
            const endStr = endDate.toISOString();

            const res = await Data.fetch(`${API_URL}/dashboard/dossier?type=client&userId=${userId}&startDate=${startStr}&endDate=${endStr}`);
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dossie-cliente-${username.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                UI.closeModal();
            }
        } catch (error) {
            console.error('Erro ao baixar dossiê do cliente:', error);
            alert(`Erro ao gerar e baixar o dossiê para ${username}.`);
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = originalHtml;
            }
        }
    },
    copyInvitationLink(event, token) {
        event.stopPropagation();
        const url = `${window.location.origin}/integration/setup-password/${token}`;
        navigator.clipboard.writeText(url).then(() => {
            alert('Link de convite copiado para a área de transferência!');
        });
    },
    openUserModal(id = null) {
        const modal = document.getElementById('user-modal');
        modal.innerHTML = `
            <div class="modal-header">
                <h3>${id ? 'Editar Usuário' : 'Novo Usuário'}</h3>
                <button onclick="UI.closeModal()" style="background: none; border: none; cursor: pointer; font-size: 1.5rem; color: white;">&times;</button>
            </div>
            <form onsubmit="UI.saveUser(event, '${id || ''}')">
                <div class="form-group"><label>Usuário</label><input type="text" id="u-name" required></div>
                <div class="form-group"><label>E-mail</label><input type="email" id="u-email" required placeholder="Ex: email@empresa.com"></div>
                <div class="form-group"><label>Role</label><select id="u-role"></select></div>
                <div class="form-group"><label>Plano</label><select id="u-plan"></select></div>
                <div class="form-group"><label>Credenciais DB</label><select id="u-db" required></select></div>
                <div class="form-group"><label>Loja (ID)</label><input type="number" id="u-store" value="1" required></div>
                <div class="form-group" style="display:flex; align-items:center; gap:8px;">
                    <input type="checkbox" id="u-status" ${id ? 'checked' : ''} style="width:auto;"><label style="margin:0">Ativo</label>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">${id ? 'Salvar' : 'Criar e Enviar Convite'}</button>
                </div>
            </form>
        `;

        // Populate selects
        document.getElementById('u-role').innerHTML = '<option value="">Sem Role</option>' + State.allRoles.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
        document.getElementById('u-plan').innerHTML = '<option value="">Plano Gratuito (Free)</option>' + State.allPlans.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
        document.getElementById('u-db').innerHTML = State.allCreds.map(c => `<option value="${c.id}">${c.database} (${c.host})</option>`).join('');

        if (id) {
            this.loadUserData(id);
        }

        modal.classList.remove('hidden');
        document.getElementById('modal-container').classList.remove('hidden');
    },
    async loadUserData(id) {
        const res = await Data.fetch(`${API_URL}/users/${id}`);
        const u = await res.json();
        document.getElementById('u-name').value = u.user;
        const emailEl = document.getElementById('u-email');
        if (emailEl) emailEl.value = u.email || '';
        document.getElementById('u-role').value = u.roleId || '';
        document.getElementById('u-db').value = u.dbCredentialsId;
        document.getElementById('u-store').value = u.storeId;
        document.getElementById('u-plan').value = u.planId || '';
        document.getElementById('u-status').checked = u.status;
    },
    toggleInvite(userId) {
        const row = document.getElementById(`inv-row-${userId}`);
        const svg = document.getElementById(`svg-exp-${userId}`);
        if (row.classList.contains('hidden')) {
            row.classList.remove('hidden');
            if (svg) svg.style.transform = 'rotate(90deg)';
        } else {
            row.classList.add('hidden');
            if (svg) svg.style.transform = 'rotate(0deg)';
        }
    },
    async saveUser(e, id) {
        e.preventDefault();
        const data = {
            user: document.getElementById('u-name').value,
            roleId: document.getElementById('u-role').value || null,
            planId: document.getElementById('u-plan').value || null,
            dbCredentialsId: document.getElementById('u-db').value,
            storeId: parseInt(document.getElementById('u-store').value),
            status: document.getElementById('u-status').checked
        };
        const emailEl = document.getElementById('u-email');
        if (emailEl) data.email = emailEl.value;

        const res = await Data.fetch(id ? `${API_URL}/users/${id}` : `${API_URL}/users`, {
            method: id ? 'PATCH' : 'POST',
            body: JSON.stringify(data)
        });
        if (res.ok) { this.closeModal(); Data.fetchUsers(); }
    },
    openRoleModal(id = null) {
        const modal = document.getElementById('role-modal');

        // Advanced Grouping: Module > Entity > Actions
        const structure = {};
        State.allPermissions.forEach(p => {
            const [mod, ent] = p.key.split('.');
            const moduleLabel = LABEL_MAP[mod] || mod;
            const entityLabel = LABEL_MAP[ent] || ent || 'Geral';

            if (!structure[moduleLabel]) structure[moduleLabel] = {};
            if (!structure[moduleLabel][entityLabel]) structure[moduleLabel][entityLabel] = [];
            structure[moduleLabel][entityLabel].push(p);
        });

        modal.innerHTML = `
            <div class="modal-header">
                <h3>${id ? 'Editar Role' : 'Nova Role'}</h3>
                <button onclick="UI.closeModal()" style="background: none; border: none; cursor: pointer; font-size: 1.5rem; color: white;">&times;</button>
            </div>
            <form onsubmit="UI.saveRole(event, '${id || ''}')">
                <div class="form-group"><label>Nome</label><input type="text" id="r-name" required></div>
                <div class="form-group"><label>Descrição</label><textarea id="r-desc" rows="2"></textarea></div>
                <div class="form-group"><label>Permissões</label>
                    <div class="permissions-accordion">
                        ${Object.entries(structure).map(([module, entities]) => `
                            <div class="perm-module-group">
                                <button type="button" class="perm-module-header" onclick="this.nextElementSibling.classList.toggle('hidden')">
                                    <span>${module}</span>
                                    <i class='bx bx-chevron-down'></i>
                                </button>
                                <div class="perm-module-content hidden">
                                    ${Object.entries(entities).map(([entity, perms]) => `
                                        <div class="perm-entity-row">
                                            <span class="entity-name">${entity}</span>
                                            <div class="actions-inline">
                                                ${perms.map(p => `
                                                    <label class="perm-inline-item" title="${p.description || ''}">
                                                        <input type="checkbox" name="perms" value="${p.id}">
                                                        <span>${translateAction(p.key)}</span>
                                                    </label>
                                                `).join('')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar</button>
                </div>
            </form>
        `;
        if (id) this.loadRoleData(id);
        modal.classList.remove('hidden');
        document.getElementById('modal-container').classList.remove('hidden');
    },
    async loadRoleData(id) {
        const res = await Data.fetch(`${API_URL}/roles/${id}`);
        const r = await res.json();
        document.getElementById('r-name').value = r.name;
        document.getElementById('r-desc').value = r.description || '';
        const permIds = r.rolePermissions.map(rp => rp.permissionId);
        document.querySelectorAll('input[name="perms"]').forEach(cb => cb.checked = permIds.includes(cb.value));
    },
    async saveRole(e, id) {
        e.preventDefault();
        const data = {
            name: document.getElementById('r-name').value,
            description: document.getElementById('r-desc').value,
            permissions: Array.from(document.querySelectorAll('input[name="perms"]:checked')).map(cb => cb.value)
        };
        const res = await Data.fetch(id ? `${API_URL}/roles/${id}` : `${API_URL}/roles`, {
            method: id ? 'PATCH' : 'POST',
            body: JSON.stringify(data)
        });
        if (res.ok) { this.closeModal(); Data.fetchRoles(); }
    },
    openCredModal(id = null) {
        const modal = document.getElementById('cred-modal');
        modal.innerHTML = `
            <div class="modal-header">
                <h3>${id ? 'Editar Credencial' : 'Nova Credencial'}</h3>
                <button onclick="UI.closeModal()" style="background: none; border: none; cursor: pointer; font-size: 1.5rem; color: white;">&times;</button>
            </div>
            <form onsubmit="UI.saveCred(event, '${id || ''}')">
                <div class="form-group"><label>Host</label><input type="text" id="c-host" required></div>
                <div class="form-group"><label>Porta</label><input type="number" id="c-port" value="5432" required></div>
                <div class="form-group"><label>Banco de Dados</label><input type="text" id="c-db" required></div>
                <div class="form-group"><label>Usuário</label><input type="text" id="c-user" required></div>
                <div class="form-group"><label>DB ID (Configuração)</label><input type="number" id="c-dbid" required></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar</button>
                </div>
            </form>
        `;
        if (id) this.loadCredData(id);
        modal.classList.remove('hidden');
        document.getElementById('modal-container').classList.remove('hidden');
    },
    async loadCredData(id) {
        const res = await Data.fetch(`${API_URL}/db-credentials/${id}`);
        const c = await res.json();
        document.getElementById('c-host').value = c.host;
        document.getElementById('c-port').value = c.port;
        document.getElementById('c-db').value = c.database;
        document.getElementById('c-user').value = c.user;
        document.getElementById('c-dbid').value = c.dbId;
    },
    async saveCred(e, id) {
        e.preventDefault();
        const data = {
            host: document.getElementById('c-host').value,
            port: parseInt(document.getElementById('c-port').value),
            database: document.getElementById('c-db').value,
            user: document.getElementById('c-user').value,
            dbId: parseInt(document.getElementById('c-dbid').value)
        };
        const res = await Data.fetch(id ? `${API_URL}/db-credentials/${id}` : `${API_URL}/db-credentials`, {
            method: id ? 'PATCH' : 'POST',
            body: JSON.stringify(data)
        });
        if (res.ok) { this.closeModal(); Data.fetchCreds(); }
    },
    openAnnouncementModal(id = null) {
        const modal = document.getElementById('announcement-modal');
        modal.innerHTML = `
            <div class="modal-header">
                <h3>${id ? 'Editar Aviso' : 'Novo Aviso'}</h3>
                <button onclick="UI.closeModal()" style="background: none; border: none; cursor: pointer; font-size: 1.5rem; color: white;">&times;</button>
            </div>
            <form onsubmit="UI.saveAnnouncement(event, '${id || ''}')">
                <div class="form-group">
                    <label>Tipo de Aviso</label>
                    <select id="a-type" required>
                        <option value="INFO">Informativo (Verde)</option>
                        <option value="WARNING">Aviso (Amarelo)</option>
                        <option value="ALERT">Alerta (Vermelho)</option>
                        <option value="DOC">Documentação (Indigo)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Texto do Aviso</label>
                    <textarea id="a-text" rows="3" required placeholder="Mensagem que aparecerá na faixa superior"></textarea>
                </div>
                <div class="details-grid">
                    <div class="form-group"><label>Texto do CTA (Opcional)</label><input type="text" id="a-ctaText" placeholder="Ex: Saber Mais"></div>
                    <div class="form-group"><label>Link do CTA (Opcional)</label><input type="text" id="a-ctaLink" placeholder="https://..."></div>
                </div>
                <div class="details-grid">
                    <div class="form-group"><label>Data Início (Opcional)</label><input type="date" id="a-start"></div>
                    <div class="form-group"><label>Data Fim (Opcional)</label><input type="date" id="a-end"></div>
                </div>
                <div class="form-group" style="display:flex; align-items:center; gap:8px;">
                    <input type="checkbox" id="a-active" checked style="width:auto;"><label style="margin:0">Ativo</label>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar Aviso</button>
                </div>
            </form>
        `;

        if (id) {
            const ann = State.allAnnouncements.find(a => a.id === id);
            if (ann) {
                document.getElementById('a-type').value = ann.type;
                document.getElementById('a-text').value = ann.text;
                document.getElementById('a-ctaText').value = ann.ctaText || '';
                document.getElementById('a-ctaLink').value = ann.ctaLink || '';
                if (ann.startDate) document.getElementById('a-start').value = ann.startDate.split('T')[0];
                if (ann.endDate) document.getElementById('a-end').value = ann.endDate.split('T')[0];
                document.getElementById('a-active').checked = ann.active;
            }
        }

        modal.classList.remove('hidden');
        document.getElementById('modal-container').classList.remove('hidden');
    },
    async saveAnnouncement(e, id) {
        e.preventDefault();
        const data = {
            type: document.getElementById('a-type').value,
            text: document.getElementById('a-text').value,
            ctaText: document.getElementById('a-ctaText').value || null,
            ctaLink: document.getElementById('a-ctaLink').value || null,
            startDate: document.getElementById('a-start').value || null,
            endDate: document.getElementById('a-end').value || null,
            active: document.getElementById('a-active').checked
        };

        const res = await Data.fetch(id ? `${API_URL}/announcements/${id}` : `${API_URL}/announcements`, {
            method: id ? 'PATCH' : 'POST',
            body: JSON.stringify(data)
        });
        if (res.ok) { this.closeModal(); Data.fetchAnnouncements(); }
    },
    selectAllAnnouncements(el) {
        const checkboxes = document.querySelectorAll('.ann-checkbox');
        checkboxes.forEach(cb => cb.checked = el.checked);
        this.updateNewsletterButtonState();
    },
    updateNewsletterButtonState() {
        const checkedCount = document.querySelectorAll('.ann-checkbox:checked').length;
        const btn = document.getElementById('btn-prep-newsletter');
        if (btn) {
            btn.style.display = checkedCount > 0 ? 'inline-block' : 'none';
        }
    },
    async openNewsletterModal() {
        const selectedCheckboxes = document.querySelectorAll('.ann-checkbox:checked');
        const announcementIds = Array.from(selectedCheckboxes).map(cb => cb.value);

        if (announcementIds.length === 0) {
            alert('Por favor, selecione ao menos um aviso para enviar.');
            return;
        }

        // Fetch Next ID
        const resId = await Data.fetch(`${API_URL}/newsletter/next-id`);
        const { nextId } = await resId.json();

        const modal = document.getElementById('newsletter-modal');
        modal.innerHTML = `
            <div class="modal-header">
                <h3>Preparar InfoAPI News #${nextId}</h3>
                <button onclick="UI.closeModal()" style="background: none; border: none; cursor: pointer; font-size: 1.5rem; color: white;">&times;</button>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 20px; height: 500px; overflow: hidden; background: var(--bg-card); color: var(--text-main);">
                <!-- Config Formulário -->
                <form onsubmit="UI.sendNewsletter(event)" style="display: flex; flex-direction: column; gap: 12px; overflow-y: auto; padding-right: 10px;">
                    <input type="hidden" id="n-annIds" value='${JSON.stringify(announcementIds)}'>
                    <div class="form-group">
                        <label>Assunto do E-mail</label>
                        <input type="text" id="n-subject" required value="InfoAPI News #${nextId} - Novidades e Atualizações" oninput="UI.updateNewsletterPreview()" style="width: 100%;">
                    </div>
                    <div class="form-group">
                        <label>Mensagem Inicial (Padrão)</label>
                        <textarea id="n-initial" rows="3" oninput="UI.updateNewsletterPreview()" style="width: 100%; resize: vertical;">Olá! Temos o prazer de compartilhar com você as últimas atualizações de recursos, novidades e alertas importantes do ecossistema InfoAPI.</textarea>
                    </div>
                    <div class="form-group">
                        <label>Mensagem Final (Padrão)</label>
                        <textarea id="n-final" rows="3" oninput="UI.updateNewsletterPreview()" style="width: 100%; resize: vertical;">Para dúvidas ou suporte com essas novidades, nossa equipe técnica está sempre disponível através do e-mail suporte@infobrasilsistemas.com.br ou pelo nosso suporte oficial.</textarea>
                    </div>
                    <div style="margin-top: auto; display: flex; gap: 10px;">
                        <button type="button" class="btn btn-outline" onclick="UI.closeModal()" style="flex: 1;">Cancelar</button>
                        <button type="submit" class="btn btn-primary" style="flex: 1; background: #10b981; border-color: #10b981;">Disparar News</button>
                    </div>
                </form>

                <!-- Live Preview (Iframe) -->
                <div style="display: flex; flex-direction: column; border-left: 1px solid var(--border); padding-left: 20px; height: 100%;">
                    <div style="font-weight: bold; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <span>Pré-visualização do E-mail</span>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">Auto-atualizável</span>
                    </div>
                    <iframe id="newsletter-preview-frame" style="flex: 1; width: 100%; border: 1px solid var(--border); border-radius: 8px; background: white;"></iframe>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        document.getElementById('modal-container').classList.remove('hidden');

        // Initial preview generation
        this.updateNewsletterPreview();
    },
    async updateNewsletterPreview() {
        if (State.previewTimeoutId) {
            clearTimeout(State.previewTimeoutId);
        }
        State.previewTimeoutId = setTimeout(async () => {
            const announcementIds = JSON.parse(document.getElementById('n-annIds').value);
            const subject = document.getElementById('n-subject').value;
            const initialMessage = document.getElementById('n-initial').value;
            const finalMessage = document.getElementById('n-final').value;

            const frame = document.getElementById('newsletter-preview-frame');
            if (!frame) return;

            try {
                const res = await Data.fetch(`${API_URL}/newsletter/preview`, {
                    method: 'POST',
                    body: JSON.stringify({ announcementIds, subject, initialMessage, finalMessage })
                });

                if (res.ok) {
                    const { html } = await res.json();
                    const doc = frame.contentDocument || frame.contentWindow.document;
                    doc.open();
                    doc.write(html);
                    doc.close();
                } else {
                    const err = await res.json();
                    console.error(err);
                }
            } catch (e) {
                console.error('Erro ao gerar preview da newsletter:', e);
            }
        }, 500);
    },
    async sendNewsletter(e) {
        e.preventDefault();

        if (!confirm('Deseja disparar esta newsletter agora para TODOS os usuários ativos cadastrados? Essa ação não pode ser desfeita.')) {
            return;
        }

        const announcementIds = JSON.parse(document.getElementById('n-annIds').value);
        const subject = document.getElementById('n-subject').value;
        const initialMessage = document.getElementById('n-initial').value;
        const finalMessage = document.getElementById('n-final').value;

        try {
            const res = await Data.fetch(`${API_URL}/newsletter/send`, {
                method: 'POST',
                body: JSON.stringify({ announcementIds, subject, initialMessage, finalMessage })
            });

            if (res.ok) {
                alert('Newsletter enviada e disparada com sucesso para todos os usuários ativos!');
                this.closeModal();
                Data.fetchAnnouncements();
            } else {
                const err = await res.json();
                alert(`Erro ao enviar: ${err.message}`);
            }
        } catch (e) {
            console.error(e);
            alert('Falha ao processar o envio da newsletter.');
        }
    }
};

function switchTab(tab, updateHash = true) {
    if (!tab) return;

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));

    // Find button by its onclick attribute containing the tab name
    const btn = Array.from(document.querySelectorAll('.tab-btn')).find(b =>
        b.getAttribute('onclick')?.includes(`'${tab}'`)
    );
    if (btn) btn.classList.add('active');

    const section = document.getElementById(`section-${tab}`);
    if (section) {
        section.classList.remove('hidden');
        if (tab === 'links') {
            section.innerHTML = Components.LinksGrid();
        }
        if (tab === 'announcements') {
            Data.fetchAnnouncements();
        }
        if (tab === 'dashboard') {
            Data.fetchDashboard();
        } else {
            Data.stopDashboardRefresh();
        }
    }

    if (updateHash) {
        window.location.hash = tab;
    }
}

// Handle Browser Navigation (Back/Forward)
window.onhashchange = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) switchTab(hash, false);
};

function switchRequestFilter(status) {
    State.currentRequestFilter = status;
    UI.renderRequests();
}
