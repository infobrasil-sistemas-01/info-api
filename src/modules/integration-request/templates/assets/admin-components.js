const translateAction = (key) => {
    const action = key.split('.').pop();
    return {
        'view': 'Ver',
        'create': 'Criar',
        'update': 'Edit',
        'delete': 'Del',
        'manage': 'Tudo',
        'approve': 'Aprovar',
        'reject': 'Recusar',
        'read': 'Leitura'
    }[action] || action;
};

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
                            <div class="rejection-box">
                                <strong class="rejection-box-title">Motivo da Recusa</strong> 
                                ${req.rejectionReason}
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
                        <button class="btn btn-outline btn-sm" title="Copiar link de convite" onclick="UI.copyInvitationLink(event, '${inv.token}')">
                            <i class='bx bx-copy-alt'></i> Copiar Link
                        </button>
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
                    <thead><tr><th>Usuário</th><th>E-mail</th><th>Perfil de acesso</th><th>Plano</th><th>Loja</th><th>Status</th><th>Ações</th></tr></thead>
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
                <h2>Gestão de Perfis de Acesso</h2>
                <button class="btn btn-primary" onclick="UI.openRoleModal()">+ Novo Perfil</button>
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
        </div>
    `,
    AnnouncementRow: (ann) => {
        const typeLabels = {
            'INFO': { label: 'Informativo', class: 'info', icon: 'bx-info-circle' },
            'WARNING': { label: 'Aviso', class: 'warning', icon: 'bx-error' },
            'ALERT': { label: 'Alerta', class: 'alert', icon: 'bx-alarm' },
            'DOC': { label: 'Doc', class: 'doc', icon: 'bx-book' }
        };
        const type = typeLabels[ann.type] || typeLabels.INFO;

        return `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="ann-type-icon ${type.class}"><i class='bx ${type.icon}'></i></div>
                    <span style="font-weight: 600; font-size: 0.9rem;">${ann.text.length > 50 ? ann.text.substring(0, 50) + '...' : ann.text}</span>
                </div>
            </td>
            <td><span class="status ${type.class}">${type.label}</span></td>
            <td>
                <div style="font-size: 0.8rem; color: var(--text-muted);">
                    ${ann.startDate ? `De: ${new Date(ann.startDate).toLocaleDateString()}<br>` : ''}
                    ${ann.endDate ? `Até: ${new Date(ann.endDate).toLocaleDateString()}` : (ann.startDate ? '' : 'Sempre ativo')}
                </div>
            </td>
            <td>
                <div style="display: flex; align-items: center; gap: 5px; font-weight: 600; color: var(--primary);">
                    <i class='bx bx-show'></i> ${ann._count?.views || 0}
                </div>
            </td>
            <td><span style="color: ${ann.active ? 'var(--success)' : 'var(--danger)'}">${ann.active ? 'Sim' : 'Não'}</span></td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline btn-sm" onclick="UI.openAnnouncementModal('${ann.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="Data.deleteAnnouncement('${ann.id}')">Excluir</button>
                </div>
            </td>
        </tr>
        `;
    },
    AnnouncementTable: (anns) => `
        <div class="card">
            <div class="card-header">
                <h2>Gestão de Avisos do Sistema</h2>
                <button class="btn btn-primary" onclick="UI.openAnnouncementModal()">+ Novo Aviso</button>
            </div>
            <div class="table-container">
                <table>
                    <thead><tr><th>Conteúdo</th><th>Tipo</th><th>Validade</th><th>Vistos</th><th>Ativo</th><th>Ações</th></tr></thead>
                    <tbody id="anns-table-body">${anns.map(Components.AnnouncementRow).join('')}</tbody>
                </table>
            </div>
        </div>
    `,
    RequestFilterTabs: (activeFilter = 'ALL') => {
        const tabs = [
            { id: 'ALL', label: 'Todas', icon: 'bx-list-ul' },
            { id: 'PENDING', label: 'Pendentes', icon: 'bx-time-five' },
            { id: 'AWAITING_CONFIRMATION', label: 'Aguardando E-mail', icon: 'bx-envelope' },
            { id: 'APPROVED', label: 'Aprovadas', icon: 'bx-check-circle' },
            { id: 'REJECTED', label: 'Recusadas', icon: 'bx-x-circle' }
        ];

        return `
            <div class="filter-tabs" style="display: flex; gap: 10px; margin-bottom: 2rem; overflow-x: auto; padding-bottom: 5px;">
                ${tabs.map(t => `
                    <button class="filter-tab ${activeFilter === t.id ? 'active' : ''}" 
                            onclick="switchRequestFilter('${t.id}')"
                            style="
                                display: flex; 
                                align-items: center; 
                                gap: 8px; 
                                padding: 8px 16px; 
                                border-radius: 10px; 
                                border: 1px solid ${activeFilter === t.id ? 'var(--primary)' : 'var(--border)'}; 
                                background: ${activeFilter === t.id ? 'rgba(16, 185, 129, 0.1)' : 'var(--card-bg)'}; 
                                color: ${activeFilter === t.id ? 'var(--primary)' : 'var(--text-muted)'}; 
                                cursor: pointer;
                                white-space: nowrap;
                                font-size: 0.9rem;
                                font-weight: 500;
                                transition: all 0.2s;
                            ">
                        <i class='bx ${t.icon}'></i>
                        ${t.label}
                    </button>
                `).join('')}
            </div>
        `;
    },
    LinksGrid: () => `

    <div class="links-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; padding: 1rem 0;">
        <div class="card link-card" style="display: flex; flex-direction: column; gap: 1rem; padding: 2rem;">
            <div style="font-size: 2.5rem; color: var(--primary);"><i class='bx bx-file-blank'></i></div>
            <h3 style="margin: 0;">Formulário de Solicitação</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; flex-grow: 1;">Link direto para o formulário público de novas solicitações de integração.</p>
            <a href="/integration/form" target="_blank" class="btn btn-outline" style="text-align: center; text-decoration: none;">Abrir Formulário</a>
        </div>      
    
        <div class="card link-card" style="display: flex; flex-direction: column; gap: 1rem; padding: 2rem; transition: transform 0.3s;">
            <div style="font-size: 2.5rem; color: var(--primary);"><i class='bx bx-book-content'></i></div>
            <h3 style="margin: 0;">Documentação Técnica</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; flex-grow: 1;">Referência completa da API (Swagger). Endpoints, parâmetros e autenticação para desenvolvedores.</p>
            <a href="/docs" target="_blank" class="btn btn-outline" style="text-align: center; text-decoration: none;">Abrir Documentação</a>
        </div>

        <div class="card link-card" style="display: flex; flex-direction: column; gap: 1rem; padding: 2rem;">
            <div style="font-size: 2.5rem; color: var(--primary);"><i class='bx bx-rocket'></i></div>
            <h3 style="margin: 0;">Landing Page (Pública)</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; flex-grow: 1;">A vitrine do serviço. Ideal para apresentar a API para novos clientes e parceiros.</p>
            <a href="/integration" target="_blank" class="btn btn-outline" style="text-align: center; text-decoration: none;">Ver Landing Page</a>
        </div>

        <div class="card link-card" style="display: flex; flex-direction: column; gap: 1rem; padding: 2rem;">
            <div style="font-size: 2.5rem; color: var(--primary);"><i class='bx bx-user-pin'></i></div>
            <h3 style="margin: 0;">Portal do Cliente</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; flex-grow: 1;">Interface onde o cliente gerencia suas permissões, chaves de segurança e visualiza seu plano.</p>
                <a href="/integration/client" target="_blank" class="btn btn-outline" style="text-align: center; text-decoration: none;">Acessar Portal</a>
            </div>

            <div class="card link-card" style="display: flex; flex-direction: column; gap: 1rem; padding: 2rem;">
                <div style="font-size: 2.5rem; color: var(--primary);"><i class='bx bx-pulse'></i></div>
                <h3 style="margin: 0;">Página de Status</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; flex-grow: 1;">Monitoramento em tempo real da saúde dos servidores e serviços de integração.</p>
                <a href="https://stats.uptimerobot.com/zHdEriLG2n/" target="_blank" class="btn btn-outline" style="text-align: center; text-decoration: none;">Verificar Status</a>
            </div>


            <div class="card link-card" style="display: flex; flex-direction: column; gap: 1rem; padding: 2rem; border: 1px dashed var(--primary); background: rgba(16, 185, 129, 0.05);">
                <div style="font-size: 2.5rem; color: var(--primary);"><i class='bx bx-support'></i></div>
                <h3 style="margin: 0;">Suporte Interno</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; flex-grow: 1;">Dúvidas técnicas ou problemas com o painel administrativo? Acione o time de desenvolvimento.</p>
                <a href="mailto:suporte@infobrasilsistemas.com.br" class="btn btn-primary" style="text-align: center; text-decoration: none;">Enviar E-mail</a>
            </div>
        </div>
    `
};
