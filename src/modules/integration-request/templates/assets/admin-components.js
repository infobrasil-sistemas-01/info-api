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
                    <span class="status ${req.status.toLowerCase()}">${translateStatus(req.status)}</span>
                    <small style="color: var(--text-muted)">${new Date(req.createdAt).toLocaleDateString()}</small>
                </div>
                <h3 style="margin-bottom: 4px;">${req.clientName}</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">${req.cnpj || 'Sem CNPJ'}</p>
                
                <div style="margin-bottom: 16px;">
                    <small style="font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">CONTATO TÉCNICO</small>
                    <p style="font-size: 0.9rem; font-weight: 600;">${contact.name || 'N/A'}</p>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">${contact.email || ''}</p>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">${contact.phone || ''}</p>
                </div>

                <button class="accordion-btn" onclick="UI.toggleDetails('${req.id}')">
                    Ver Detalhes <span>+</span>
                </button>

                <div id="details-${req.id}" class="accordion-content hidden">
                    <div style="margin-bottom: 12px;">
                        <small style="font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">OBJETIVO</small>
                        <p style="font-size: 0.85rem; background: #fffbeb; padding: 8px; border-radius: 6px; border: 1px solid #fef3c7;">${req.objective}</p>
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
                        <small style="font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">MÓDULOS E ESCOPO</small>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
                            ${req.modules.map(m => `<span style="background: #e2e8f0; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">${m}</span>`).join('')}
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
                        onclick="Data.updateRequestStatus('${req.id}', 'REJECTED')">Recusar</button>
                    <button 
                        ${req.status === 'AWAITING_CONFIRMATION' || req.status === 'APPROVED' ? 'disabled' : ''}
                        class="btn btn-danger btn-sm" onclick="Data.deleteRequest('${req.id}')">&times;</button>
                </div>
            </div>
        `;
    },
    UserRow: (u) => `
        <tr>
            <td style="font-weight: 600;">${u.user}</td>
            <td>${u.role ? u.role.name : '<span style="color: red">Nenhuma</span>'}</td>
            <td>Loja ${u.storeId}</td>
            <td><span style="color: ${u.status ? 'var(--success)' : 'var(--danger)'}">${u.status ? 'Ativo' : 'Inativo'}</span></td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline btn-sm" onclick="UI.openUserModal('${u.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="Data.deleteUser('${u.id}')">Excluir</button>
                </div>
            </td>
        </tr>
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
    `
};
