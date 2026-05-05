// --- Core State & Data ---
const State = {
    currentUser: null,
    allRoles: [],
    allPermissions: [],
    allCreds: []
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
        if (res.status === 401) Auth.logout();
        return res;
    },
    async fetchAll() {
        const canViewUsers = State.currentUser.permissions.includes('core.user.view');
        const canViewRequests = State.currentUser.permissions.includes('integration-request.view');

        if (canViewRequests) this.fetchRequests();
        if (canViewUsers) {
            this.fetchUsers();
            this.fetchRoles();
            this.fetchPermissions();
            this.fetchCreds();
        }
    },
    async fetchRequests() {
        const res = await this.fetch('/integration');
        if (res.ok) {
            const data = await res.json();
            document.getElementById('section-requests').innerHTML = `
                <div class="requests-grid">${data.map(Components.RequestCard).join('')}</div>
            `;
        }
    },
    async fetchUsers() {
        const res = await this.fetch(`${API_URL}/users`);
        const users = await res.json();
        document.getElementById('section-users').innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2>Gestão de Usuários</h2>
                <button class="btn btn-primary" onclick="UI.openUserModal()">+ Novo Usuário</button>
            </div>
            <div class="table-container">
                <table>
                    <thead><tr><th>Usuário</th><th>Role</th><th>Loja</th><th>Status</th><th>Ações</th></tr></thead>
                    <tbody id="users-table-body">${users.map(Components.UserRow).join('')}</tbody>
                </table>
            </div>
        `;
    },
    async fetchRoles() {
        const res = await this.fetch(`${API_URL}/roles`);
        State.allRoles = await res.json();
        document.getElementById('section-roles').innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2>Gestão de Roles</h2>
                <button class="btn btn-primary" onclick="UI.openRoleModal()">+ Nova Role</button>
            </div>
            <div class="table-container">
                <table>
                    <thead><tr><th>Nome</th><th>Descrição</th><th>Usuários</th><th>Ações</th></tr></thead>
                    <tbody id="roles-table-body">${State.allRoles.map(Components.RoleRow).join('')}</tbody>
                </table>
            </div>
        `;
    },
    async fetchCreds() {
        const res = await this.fetch(`${API_URL}/db-credentials`);
        State.allCreds = await res.json();
        document.getElementById('section-creds').innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2>Credenciais de Banco</h2>
                <button class="btn btn-primary" onclick="UI.openCredModal()">+ Nova Credencial</button>
            </div>
            <div class="table-container">
                <table>
                    <thead><tr><th>Host</th><th>Database</th><th>Porta</th><th>Usuário</th><th>DB ID</th><th>Ações</th></tr></thead>
                    <tbody id="creds-table-body">${State.allCreds.map(Components.CredRow).join('')}</tbody>
                </table>
            </div>
        `;
    },
    async fetchPermissions() {
        const res = await this.fetch(`${API_URL}/permissions`);
        State.allPermissions = await res.json();
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
    }
};

// --- Auth & Initial Load ---
const Auth = {
    async login() {
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        const auth = btoa(user + ':' + pass);
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Authorization': 'Basic ' + auth }
        });
        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.access_token);
            this.check();
        } else alert('Credenciais inválidas');
    },
    logout() {
        localStorage.removeItem('token');
        window.location.reload();
    },
    async check() {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch(`${API_URL}/auth/me`, { headers: { 'Authorization': 'Bearer ' + token } });
        if (res.ok) {
            State.currentUser = await res.json();
            UI.setup();
        } else this.logout();
    }
};

// --- UI Interactions & Modals ---
const UI = {
    setup() {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('admin-content').classList.remove('hidden');
        document.getElementById('user-display').innerText = State.currentUser.username;

        const canViewRequests = State.currentUser.permissions.includes('integration-request.view');
        const canViewUsers = State.currentUser.permissions.includes('core.user.view');

        if (canViewRequests) {
            document.getElementById('tab-requests').classList.remove('hidden');
            switchTab('requests');
        }
        if (canViewUsers) {
            ['tab-users', 'tab-roles', 'tab-creds'].forEach(id => document.getElementById(id).classList.remove('hidden'));
            if (!canViewRequests) switchTab('users');
        }
        Data.fetchAll();
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
    openUserModal(id = null) {
        const modal = document.getElementById('user-modal');
        modal.innerHTML = `
            <div class="modal-header">
                <h3>${id ? 'Editar Usuário' : 'Novo Usuário'}</h3>
                <button onclick="UI.closeModal()" style="background: none; border: none; cursor: pointer; font-size: 1.5rem;">&times;</button>
            </div>
            <form onsubmit="UI.saveUser(event, '${id || ''}')">
                <div class="form-group"><label>Usuário</label><input type="text" id="u-name" required></div>
                <div class="form-group">
                    <label>Senha ${id ? '<small>(deixe em branco para manter)</small>' : ''}</label>
                    <input type="password" id="u-pass" ${id ? '' : 'required'}>
                </div>
                <div class="form-group"><label>Role</label><select id="u-role" required></select></div>
                <div class="form-group"><label>Credenciais DB</label><select id="u-db" required></select></div>
                <div class="form-group"><label>Loja (ID)</label><input type="number" id="u-store" value="1" required></div>
                <div class="form-group" style="display:flex; align-items:center; gap:8px;">
                    <input type="checkbox" id="u-status" checked style="width:auto;"><label style="margin:0">Ativo</label>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline" onclick="UI.closeModal()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Salvar</button>
                </div>
            </form>
        `;
        
        // Populate selects
        document.getElementById('u-role').innerHTML = '<option value="">Sem Role</option>' + State.allRoles.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
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
        document.getElementById('u-role').value = u.roleId || '';
        document.getElementById('u-db').value = u.dbCredentialsId;
        document.getElementById('u-store').value = u.storeId;
        document.getElementById('u-status').checked = u.status;
    },
    async saveUser(e, id) {
        e.preventDefault();
        const data = {
            user: document.getElementById('u-name').value,
            roleId: document.getElementById('u-role').value || null,
            dbCredentialsId: document.getElementById('u-db').value,
            storeId: parseInt(document.getElementById('u-store').value),
            status: document.getElementById('u-status').checked
        };
        const pass = document.getElementById('u-pass').value;
        if (pass) data.password = pass;

        const res = await Data.fetch(id ? `${API_URL}/users/${id}` : `${API_URL}/users`, {
            method: id ? 'PATCH' : 'POST',
            body: JSON.stringify(data)
        });
        if (res.ok) { this.closeModal(); Data.fetchUsers(); }
    },
    openRoleModal(id = null) {
        const modal = document.getElementById('role-modal');
        modal.innerHTML = `
            <div class="modal-header">
                <h3>${id ? 'Editar Role' : 'Nova Role'}</h3>
                <button onclick="UI.closeModal()" style="background: none; border: none; cursor: pointer; font-size: 1.5rem;">&times;</button>
            </div>
            <form onsubmit="UI.saveRole(event, '${id || ''}')">
                <div class="form-group"><label>Nome</label><input type="text" id="r-name" required></div>
                <div class="form-group"><label>Descrição</label><textarea id="r-desc" rows="2"></textarea></div>
                <div class="form-group"><label>Permissões</label>
                    <div class="permissions-grid">
                        ${State.allPermissions.map(p => `
                            <label class="perm-item"><input type="checkbox" name="perms" value="${p.id}"><span><strong>${p.key}</strong> - ${p.descricao}</span></label>
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
                <button onclick="UI.closeModal()" style="background: none; border: none; cursor: pointer; font-size: 1.5rem;">&times;</button>
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
    }
};

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    const btn = document.querySelector(`.tab-btn[onclick*="${tab}"]`);
    if (btn) btn.classList.add('active');
    const section = document.getElementById(`section-${tab}`);
    if (section) section.classList.remove('hidden');
}
