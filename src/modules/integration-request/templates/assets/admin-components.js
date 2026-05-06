// --- Helpers & Translations ---
const translateAction = (a) => ({
    'read': 'Leitura',
    'create': 'Escrita',
    'update': 'Edição',
    'delete': 'Exclusão'
}[a] || a);

const translateStatus = (s) => ({
    'AWAITING_CONFIRMATION': 'AGUARDANDO CONFIRMAÇÃO',
    'PENDING': 'PENDENTE',
    'APPROVED': 'APROVADO',
    'REJECTED': 'RECUSADO'
}[s] || s);

// --- Components ---
const Components = {
    RequestCard: (req) => {
        const db = req.database || {};
        const contact = req.technicalContact || {};
        return `
            <div class="card">
                <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                    <div>
                        <span class="status ${req.status.toLowerCase()}">${translateStatus(req.status)}</span>
                        ${req.status === 'REJECTED' && req.rejectionReason ? `
                            <div style="margin-top: 8px; font-size: 0.75rem; color: var(--danger); background: #fef2f2; padding: 4px 8px; border-radius: 4px; border: 1px solid #fee2e2;">
                                <strong>Motivo:</strong> ${req.rejectionReason}
                            </div>
                        ` : ''}
                    </div>
                    <small style="color: var(--text-muted)">${new Date(req.createdAt).toLocaleDateString()}</small>
                </div>
                <h3 style="margin-bottom: 4px;">${req.clientName}</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">${req.cnpj || 'Sem CNPJ'}</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                    <div>
                        <small style="font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">RESPONSÁVEL</small>
                        <p style="font-size: 0.9rem; font-weight: 600;">${req.responsiblePerson?.name || 'N/A'}</p>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">${req.responsiblePerson?.email || ''}</p>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">${req.responsiblePerson?.phone || ''}</p>
                    </div>
                    <div>
                        <small style="font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">CONTATO TÉCNICO</small>
                        <p style="font-size: 0.9rem; font-weight: 600;">${contact.name || 'N/A'}</p>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">${contact.email || ''}</p>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">${contact.phone || ''}</p>
                    </div>
                </div>

                <button class="accordion-btn" onclick="UI.toggleDetails('${req.id}')">
                    Ver Detalhes <span>+</span>
                </button>

                <div id="details-${req.id}" class="accordion-content hidden">
                <div style="margin-bottom: 12px;">
                    <small style="font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">OBJETIVO</small>
                    <p class="objective-box">${req.objective}</p>
                </div>
                    <div class="details-grid">
                        <div class="detail-box"><label>Razão Social</label><p>${req.legalName}</p></div>
                        <div class="detail-box"><label>Hospedagem</label><p>${req.hostingType === 'DATACENTER' ? 'DataCenter' : 'Servidor Cliente'}</p></div>
                        <div class="detail-box"><label>IP Fixo</label><p>${req.fixedIp || 'N/A'}</p></div>
                        <div class="detail-box"><label>Lojas (IDs)</label><p>${req.stores.join(', ')}</p></div>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <small style="font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">BANCO DE DADOS</small>
                        <p style="font-size: 0.8rem; font-family: monospace;">${db.host}:${db.port} / ${db.database}</p>
                    </div>
                    <div>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
                            ${req.modules.map(m => `<span class="tag-pill">${m}</span>`).join('')}
                        </div>
                        <div style="font-size: 0.75rem;">
                            ${req.scopes.map(s => `<strong>${s.resource}:</strong> ${s.actions.map(translateAction).join(', ')}`).join(' | ')}
                        </div>
                    </div>
                </div>

                <div style="display: flex; gap: 8px; margin-top: 20px;">
                    <button class="btn btn-primary btn-sm" style="flex: 1" 
                        ${req.status === 'AWAITING_CONFIRMATION' || req.status === 'APPROVED' || req.status === 'REJECTED' ? 'disabled title="Aguardando confirmação de e-mail"' : ''}
                        onclick="Data.updateRequestStatus('${req.id}', 'APPROVED')">Aprovar</button>
                    <button class="btn btn-outline btn-sm" style="flex: 1" 
                        ${req.status === 'AWAITING_CONFIRMATION' || req.status === 'APPROVED' || req.status === 'REJECTED' ? 'disabled title="Aguardando confirmação de e-mail"' : ''}
                        onclick="UI.promptRejection('${req.id}')">Recusar</button>
                    <button 
                        ${req.status === 'AWAITING_CONFIRMATION' || req.status === 'APPROVED' ? 'disabled' : ''}
                        class="btn btn-danger btn-sm" onclick="Data.deleteRequest('${req.id}')">&times;</button>
                </div>
            </div>
        `;
    },
    UserRow: (u) => {
        const inv = u.invitation;
        const hasInvite = !!inv;
        const isExpired = hasInvite && new Date(inv.expiresAt) < new Date() && !inv.acceptedAt;

        console.log('UserRow data:', u);

        return `
        <tr class="user-main-row">
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    ${hasInvite ? `
                        <button class="btn-icon" onclick="UI.toggleInvite('${u.id}')" id="btn-exp-${u.id}">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s;" id="svg-exp-${u.id}">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    ` : '<div style="width: 24px;"></div>'}
                    <span style="font-weight: 600;">${u.user}</span>
                </div>
            </td>
            <td style="color: var(--text-muted); font-size: 0.9rem;">${u.email || '-'}</td>
            <td>${u.role ? u.role.name : '<span style="color: var(--text-muted)">Nenhuma</span>'}</td>
            <td>
                <span class="plan-badge ${u.plan?.name?.toLowerCase() || 'free'}">
                    ${u.plan ? u.plan.name : 'Free'}
                </span>
            </td>
            <td>Loja ${u.storeId}</td>
            <td><span style="color: ${u.status ? 'var(--success)' : 'var(--danger)'}">${u.status ? 'Ativo' : 'Inativo'}</span></td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline btn-sm" onclick="UI.openUserModal('${u.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="Data.deleteUser('${u.id}')">Excluir</button>
                </div>
            </td>
        </tr>
        ${hasInvite ? `
        <tr id="inv-row-${u.id}" class="invite-details-row hidden">
            <td colspan="7" class="invite-details-box">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Detalhes do Convite</div>
                        <div style="display: grid; grid-template-columns: auto auto; gap: 16px 32px;">
                            <div>
                                <span class="label">Token:</span>
                                <code class="code-snippet">${inv.token}</code>
                            </div>
                            <div>
                                <span class="label">Expiração:</span>
                                <span style="font-size: 0.85rem;">${new Date(inv.expiresAt).toLocaleString()}</span>
                            </div>
                            <div>
                                <span class="label">Criado em:</span>
                                <span style="font-size: 0.85rem;">${new Date(inv.createdAt).toLocaleString()}</span>
                            </div>
                            <div>
                                <span class="label">Aceito em:</span>
                                <span style="font-size: 0.85rem;">${inv.acceptedAt ? new Date(inv.acceptedAt).toLocaleString() : 'Pendente'}</span>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        ${!inv.acceptedAt ? `<button class="btn btn-outline btn-sm" onclick="Data.resendInvite('${inv.id}')">Reenviar E-mail</button>` : ''}
                        ${!inv.acceptedAt ? `<button class="btn btn-danger btn-sm" onclick="Data.deleteInvite('${inv.id}')">Revogar Convite</button>` : ''}
                    </div>
                </div>
            </td>
        </tr>
        ` : ''}
    `;
    },
    UserTable: (users) => `
        <div class="card">
            <div class="card-header">
                <h2>Gestão de Usuários</h2>
                <button class="btn btn-primary" onclick="UI.openUserModal()">+ Novo Usuário</button>
            </div>
            <div class="table-container">
                <table>
                    <thead><tr><th>Usuário</th><th>E-mail</th><th>Role</th><th>Plano</th><th>Loja</th><th>Status</th><th>Ações</th></tr></thead>
                    <tbody id="users-table-body">${users.map(Components.UserRow).join('')}</tbody>
                </table>
            </div>
        </div>
    `,
    RoleRow: (r) => `
        <tr>
            <td style="font-weight: 600;">${r.name}</td>
            <td>${r.description || '-'}</td>
            <td>${r._count.users} usuários</td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline btn-sm" onclick="UI.openRoleModal('${r.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="Data.deleteRole('${r.id}')">Excluir</button>
                </div>
            </td>
        </tr>
    `,
    RoleTable: (roles) => `
        <div class="card">
            <div class="card-header">
                <h2>Gestão de Roles</h2>
                <button class="btn btn-primary" onclick="UI.openRoleModal()">+ Nova Role</button>
            </div>
            <div class="table-container">
                <table>
                    <thead><tr><th>Nome</th><th>Descrição</th><th>Usuários</th><th>Ações</th></tr></thead>
                    <tbody id="roles-table-body">${roles.map(Components.RoleRow).join('')}</tbody>
                </table>
            </div>
        </div>
    `,
    CredRow: (c) => `
        <tr>
            <td style="font-weight: 600;">${c.host}</td>
            <td>${c.database}</td>
            <td>${c.port}</td>
            <td>${c.user}</td>
            <td>${c.dbId}</td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline btn-sm" onclick="UI.openCredModal('${c.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="Data.deleteCred('${c.id}')">Excluir</button>
                </div>
            </td>
        </tr>
    `,
    CredTable: (creds) => `
        <div class="card">
            <div class="card-header">
                <h2>Credenciais de Banco</h2>
                <button class="btn btn-primary" onclick="UI.openCredModal()">+ Nova Credencial</button>
            </div>
            <div class="table-container">
                <table>
                    <thead><tr><th>Host</th><th>Database</th><th>Porta</th><th>Usuário</th><th>DB ID</th><th>Ações</th></tr></thead>
                    <tbody id="creds-table-body">${creds.map(Components.CredRow).join('')}</tbody>
                </table>
            </div>
        </div>
    `
};
