const API_URL = '/api/v1';

const Translations = {
    modules: {
        'user': 'Usuários',
        'role': 'Cargos (Roles)',
        'permission': 'Permissões',
        'products': 'Produtos',
        'stores': 'Lojas',
        'brands': 'Marcas',
        'groups': 'Grupos',
        'orders': 'Pedidos',
        'integration-request': 'Solicitações de Integração',
        'db-credentials': 'Credenciais de Banco',
        'payment-methods': 'Formas de Pagamento',
        'payment-plans': 'Planos de Pagamento',
        'account-receivable': 'Contas a Receber',
        'account-payable': 'Contas a Pagar',
        'clients': 'Clientes',
        'employees': 'Funcionários',
        'suppliers': 'Fornecedores',
        'service-providers': 'Prestadores',
        'deliveries': 'Entregas',
        'announcement': 'Avisos do Sistema',
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
        this.loadAnnouncements();
        this.loadUptimeStatus();

        // Inicializa aba pela URL ou padrão 'guide'
        const hash = window.location.hash.replace('#', '');
        this.switchTab(hash || 'guide', false);
    },

    announcements: [],
    unreadAnnouncements: [],
    readAnnouncements: [],
    activeDrawerTab: 'unread',
    currentAnnIndex: 0,

    async loadAnnouncements() {
        try {
            const token = Auth.getToken();
            const [resUnread, resRead] = await Promise.all([
                fetch(`${API_URL}/announcements`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_URL}/announcements/read`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (resUnread.ok) {
                this.unreadAnnouncements = await resUnread.json();
                this.announcements = this.unreadAnnouncements;
                this.renderAnnouncements();
                this.updateNotificationsBadge();
            }

            if (resRead.ok) {
                this.readAnnouncements = await resRead.json();
            }

            this.renderNotificationsDrawer();
        } catch (e) {
            console.error('Erro ao carregar avisos', e);
        }
    },

    updateNotificationsBadge() {
        const badge = document.getElementById('notifications-badge');
        const count = this.unreadAnnouncements.length;
        if (badge) {
            if (count > 0) {
                badge.textContent = count;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    },

    toggleNotificationsMenu(open) {
        const drawer = document.getElementById('notifications-drawer');
        const overlay = document.getElementById('drawer-overlay');
        if (open) {
            drawer.classList.add('open');
            overlay.classList.add('open');
            this.loadAnnouncements();
        } else {
            drawer.classList.remove('open');
            overlay.classList.remove('open');
        }
    },

    switchDrawerTab(tabId) {
        this.activeDrawerTab = tabId;
        const tabUnread = document.getElementById('drawer-tab-unread');
        const tabRead = document.getElementById('drawer-tab-read');

        if (tabId === 'unread') {
            tabUnread.classList.add('active');
            tabRead.classList.remove('active');
        } else {
            tabRead.classList.add('active');
            tabUnread.classList.remove('active');
        }

        this.renderNotificationsDrawer();
    },

    renderNotificationsDrawer() {
        const listEl = document.getElementById('notifications-list');
        if (!listEl) return;

        const list = this.activeDrawerTab === 'unread' ? this.unreadAnnouncements : this.readAnnouncements;

        if (!list || list.length === 0) {
            listEl.innerHTML = `
                <div class="empty-notifications">
                    <i class='bx bx-bell-off'></i>
                    <p>Nenhum aviso por aqui.</p>
                </div>
            `;
            return;
        }

        listEl.innerHTML = list.map(ann => {
            const iconMap = {
                'DOC': 'bx-book-open',
                'INFO': 'bx-info-circle',
                'WARNING': 'bx-error-alt',
                'ALERT': 'bx-alarm-exclamation'
            };
            const icon = iconMap[ann.type] || 'bx-bell';
            
            const date = new Date(ann.createdAt);
            const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

            const isUnread = this.activeDrawerTab === 'unread';

            return `
                <div class="notification-item ${ann.type.toLowerCase()} ${isUnread ? 'unread' : ''}">
                    <div class="notification-icon">
                        <i class='bx ${icon}'></i>
                    </div>
                    <div class="notification-body">
                        <div class="notification-text">${ann.text}</div>
                        ${ann.ctaText ? `<a href="${ann.ctaLink || '#'}" target="_blank" class="notification-link">${ann.ctaText}</a>` : ''}
                        <div class="notification-time">${dateStr}</div>
                    </div>
                    ${isUnread ? `
                        <div class="notification-actions">
                            <button class="btn-mark-read" onclick="UI.dismissAnnouncementById('${ann.id}')" title="Marcar como lida">
                                <i class='bx bx-check'></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    },

    async dismissAnnouncementById(id) {
        try {
            // Chamada otimista
            const indexUnread = this.unreadAnnouncements.findIndex(ann => ann.id === id);
            if (indexUnread !== -1) {
                const [ann] = this.unreadAnnouncements.splice(indexUnread, 1);
                this.readAnnouncements.unshift(ann);
                this.announcements = this.unreadAnnouncements;
                
                this.renderAnnouncements();
                this.updateNotificationsBadge();
                this.renderNotificationsDrawer();
            }

            await fetch(`${API_URL}/announcements/${id}/view`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${Auth.getToken()}` }
            });
        } catch (e) {
            console.error('Erro ao dispensar aviso no drawer', e);
            this.loadAnnouncements();
        }
    },

    renderAnnouncements() {
        const bar = document.getElementById('announcement-bar');
        const slider = document.getElementById('announcement-slider');

        if (!this.announcements || this.announcements.length === 0) {
            bar.classList.add('hidden');
            return;
        }

        bar.classList.remove('hidden');

        slider.innerHTML = this.announcements.map(ann => {
            const iconMap = {
                'DOC': 'bx-book-open',
                'INFO': 'bx-info-circle',
                'WARNING': 'bx-error-alt',
                'ALERT': 'bx-alarm-exclamation'
            };
            const icon = iconMap[ann.type] || 'bx-bell';

            return `
                <div class="announcement-slide ${ann.type.toLowerCase()}">
                    <i class='bx ${icon}'></i>
                    <span>${ann.text}</span>
                    ${ann.ctaText ? `<a href="${ann.ctaLink || '#'}" target="_blank" class="announcement-link">${ann.ctaText}</a>` : ''}
                </div>
            `;
        }).join('');

        // Controls
        const prev = document.getElementById('announcement-prev');
        const next = document.getElementById('announcement-next');

        if (this.announcements.length > 1) {
            prev.classList.remove('hidden');
            next.classList.remove('hidden');
        } else {
            prev.classList.add('hidden');
            next.classList.add('hidden');
        }

        this.currentAnnIndex = 0;
        this.updateSliderPos();
    },

    nextAnnouncement() {
        this.currentAnnIndex = (this.currentAnnIndex + 1) % this.announcements.length;
        this.updateSliderPos();
    },

    prevAnnouncement() {
        this.currentAnnIndex = (this.currentAnnIndex - 1 + this.announcements.length) % this.announcements.length;
        this.updateSliderPos();
    },

    updateSliderPos() {
        const slider = document.getElementById('announcement-slider');
        slider.style.transform = `translateX(-${this.currentAnnIndex * 100}%)`;
    },

    async dismissAnnouncement() {
        const ann = this.announcements[this.currentAnnIndex];
        if (!ann) return;
        await this.dismissAnnouncementById(ann.id);
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
    switchTab(tabId, updateHash = true) {
        // Se não houver tabId (ex: hash vazio), usa 'guide'
        if (!tabId) tabId = 'guide';

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

        // Update URL Hash
        if (updateHash) {
            window.location.hash = tabId;
        }
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
    copyText(text, message) {
        navigator.clipboard.writeText(text).then(() => {
            // Feedback visual simples
            const feedback = document.createElement('div');
            feedback.style.position = 'fixed';
            feedback.style.bottom = '20px';
            feedback.style.right = '20px';
            feedback.style.background = 'var(--primary)';
            feedback.style.color = '#000';
            feedback.style.padding = '12px 24px';
            feedback.style.borderRadius = '8px';
            feedback.style.fontWeight = 'bold';
            feedback.style.zIndex = '9999';
            feedback.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
            feedback.textContent = message || 'Copiado com sucesso!';
            document.body.appendChild(feedback);
            setTimeout(() => feedback.remove(), 2000);
        });
    },
    copyNewPassword() {
        const pass = document.getElementById('new-password-value').textContent;
        this.copyText(pass, 'Senha copiada com sucesso!');
    },
    async loadUptimeStatus() {
        try {
            // Usando o novo endpoint interno (sem prefixo api/v1)
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
            console.error('Erro ao carregar status do sistema', e);
        }
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

// Handle Hash Change
window.onhashchange = () => {
    const hash = window.location.hash.replace('#', '');
    UI.switchTab(hash, false);
};
