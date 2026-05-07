const API_URL = '/api/v1';

const Translations = {
    modules: {
        'user': 'Usuários',
        'role': 'Cargos (Roles)',
        'permission': 'Permissões',
        'products': 'Produtos',
        'brands': 'Marcas',
        'groups': 'Grupos',
        'orders': 'Pedidos',
        'integration-request': 'Solicitações de Integração',
        'db-credentials': 'Credenciais de Banco',
        'payment-methods': 'Formas de Pagamento',
        'account-receivable': 'Contas a Receber',
        'clients': 'Clientes',
    },
    actions: {
        'view': 'Visualizar',
        'create': 'Criar',
        'update': 'Editar',
        'delete': 'Excluir',
        'manage': 'Gerenciar',
        'setup': 'Configurar'
    },
    translate(perm) {
        let clean = perm.replace(/^(core|tenant)\./, '');
        const parts = clean.split('.');
        if (parts.length >= 2) {
            const mod = this.modules[parts[0]] || parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
            const act = this.actions[parts[1]] || parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
            return `${mod}: ${act}`;
        }
        return clean.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    },
    translateAction(perm) {
        let clean = perm.replace(/^(core|tenant)\./, '');
        const parts = clean.split('.');
        if (parts.length >= 2) {
            return this.actions[parts[1]] || parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
        }
        return this.translate(perm);
    }
};

const Auth = {
    getToken: () => localStorage.getItem('token'),
    setToken: (t) => localStorage.setItem('token', t),
    logout: () => {
        localStorage.removeItem('token');
        location.reload();
    },
    async check() {
        const token = this.getToken();
        if (!token) {
            UI.showLogin();
            return;
        }

        try {
            const res = await fetch(`${API_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const user = await res.json();
                UI.initApp(user);
            } else {
                this.logout();
            }
        } catch (e) {
            this.logout();
        }
    }
};

const UI = {
    showLogin() {
        document.getElementById('login-container').classList.remove('hidden');
        document.getElementById('app-container').classList.add('hidden');
    },
    async initApp(user) {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');

        document.getElementById('user-display-name').textContent = user.username || 'Usuário';
        document.getElementById('user-avatar').textContent = (user.username || 'U').charAt(0).toUpperCase();
        document.getElementById('user-role-name').textContent = user.roles && user.roles.length > 0 ? user.roles[0].name : 'Sem Cargo';

        // Agrupamento de Permissões
        const grouped = {};
        user.permissions.forEach(p => {
            const clean = p.replace(/^(core|tenant)\./, '');
            const resource = clean.split('.')[0];
            if (!grouped[resource]) grouped[resource] = [];
            grouped[resource].push(p);
        });

        const list = document.getElementById('permissions-list');
        list.innerHTML = Object.entries(grouped).map(([resource, perms]) => {
            const title = Translations.modules[resource] || resource.charAt(0).toUpperCase() + resource.slice(1);
            return `
                <div class="perm-group">
                    <h4>${title}</h4>
                    <div class="perm-items">
                        ${perms.map(p => `<span class="perm-tag">${Translations.translateAction(p)}</span>`).join('')}
                    </div>
                </div>
            `;
        }).join('');

        await this.loadStats();
        this.loadPlans();
    },
    async loadStats() {
        try {
            const res = await fetch(`${API_URL}/plans/stats`, {
                headers: { 'Authorization': `Bearer ${Auth.getToken()}` }
            });
            const data = await res.json();

            const { limits, usage } = data;
            this.currentPlanName = limits.name || 'Free';

            // Badge do Plano
            const badge = document.getElementById('user-plan-badge');
            badge.textContent = this.currentPlanName;
            badge.className = `plan-badge ${this.currentPlanName.toLowerCase()}`;

            // Update Stats
            this.animateProgress('req-month', usage.reqsMonth, limits.reqMonth, usage.monthPercentage);
            this.animateProgress('req-min', usage.reqsMinute, limits.reqMin, usage.minutePercentage);

            document.getElementById('max-page-size').textContent = `${limits.maxPageSize} registros`;
            document.getElementById('max-date-range').textContent = `${limits.maxDateRangeDays} dias`;

        } catch (e) {
            console.error('Erro ao carregar stats', e);
        }
    },
    async loadPlans() {
        try {
            const res = await fetch(`${API_URL}/plans`, {
                headers: { 'Authorization': `Bearer ${Auth.getToken()}` }
            });
            const plans = await res.json();
            const grid = document.querySelector('.upgrade-grid');

            grid.innerHTML = plans.map(p => {
                const isCurrent = p.name === this.currentPlanName;
                return `
                    <div class="card upgrade-card ${p.name === 'Advanced' ? 'featured' : ''} ${isCurrent ? 'current' : ''}">
                        ${isCurrent ? '<div class="current-plan-banner">SEU PLANO ATUAL</div>' : ''}
                        <div class="plan-header">
                            <h2 class="plan-title">${p.name}</h2>
                            <div class="plan-price">
                                <span class="currency">R$</span>
                                <span class="amount">${p.name === 'Free' ? '0,00' : 'Sob Consulta'}</span>
                            </div>
                        </div>
                        <p class="plan-description">${p.description || 'Plano ideal para suas necessidades de integração.'}</p>
                        <ul class="plan-features">
                            <li><strong>${p.reqMonth.toLocaleString()}</strong> req/mês</li>
                            <li>Limite de <strong>${p.maxPageSize}</strong> registros</li>
                            <li>Range de <strong>${p.maxDateRangeDays}</strong> dias</li>
                        </ul>
                    </div>
                `;
            }).join('');
        } catch (e) {
            console.error('Erro ao carregar planos', e);
        }
    },
    animateProgress(id, current, limit, percentage) {
        const currentEl = document.getElementById(`${id}-current`);
        const limitEl = document.getElementById(`${id}-limit`);
        const barEl = document.getElementById(`${id}-bar`);

        if (currentEl) currentEl.textContent = current.toLocaleString();
        if (limitEl) limitEl.textContent = limit.toLocaleString();

        if (barEl) {
            barEl.style.width = '0%';
            setTimeout(() => {
                barEl.style.width = `${Math.min(100, percentage)}%`;
                if (percentage > 90) barEl.style.background = 'var(--danger)';
            }, 100);
        }
    },
    switchTab(tabId) {
        // Update Buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`.tab-btn[onclick*="${tabId}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        // Update Content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeContent = document.getElementById(`tab-${tabId}`);
        if (activeContent) activeContent.classList.add('active');
    },
    toggleAccordion(header) {
        const item = header.parentElement;
        const isActive = item.classList.contains('active');

        // Fecha outros itens (estilo Sanfona)
        document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

        if (!isActive) {
            item.classList.add('active');
        }
    },
    async confirmRotation() {
        const confirmed = confirm("TEM CERTEZA? Sua senha atual deixará de funcionar imediatamente em todos os sistemas integrados.");
        if (!confirmed) return;

        const btn = document.querySelector('.btn-rotate');
        const originalHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Processando...";

        try {
            const res = await fetch(`${API_URL}/users/me/rotate-password`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${Auth.getToken()}` }
            });

            if (res.ok) {
                const data = await res.json();
                document.getElementById('rotation-action-box').classList.add('hidden');
                document.getElementById('new-password-box').classList.remove('hidden');
                document.getElementById('new-password-value').textContent = data.password;
            } else {
                alert('Erro ao rotacionar senha. Tente novamente mais tarde.');
                btn.disabled = false;
                btn.innerHTML = originalHtml;
            }
        } catch (e) {
            alert('Erro de conexão.');
            btn.disabled = false;
            btn.innerHTML = originalHtml;
        }
    },
    copyNewPassword() {
        const pass = document.getElementById('new-password-value').textContent;
        navigator.clipboard.writeText(pass).then(() => {
            alert('Senha copiada com sucesso! Guarde-a em local seguro.');
        });
    }
};

// Events
document.getElementById('login-form').onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(username + ':' + password)
            }
        });

        if (res.ok) {
            const data = await res.json();
            Auth.setToken(data.access_token);
            Auth.check();
        } else {
            document.getElementById('login-error').classList.remove('hidden');
        }
    } catch (err) {
        alert('Erro ao conectar com o servidor');
    }
};

// Start
Auth.check();
