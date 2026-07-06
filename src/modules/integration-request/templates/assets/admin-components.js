const translateAction = (key) => {
  const action = key.split('.').pop();
  return (
    {
      view: 'Ver',
      create: 'Criar',
      update: 'Edit',
      delete: 'Del',
      manage: 'Tudo',
      approve: 'Aprovar',
      reject: 'Recusar',
      read: 'Leitura',
    }[action] || action
  );
};

const translateStatus = (s) =>
  ({
    AWAITING_CONFIRMATION: 'AGUARDANDO CONFIRMAÇÃO',
    PENDING: 'PENDENTE',
    APPROVED: 'APROVADO',
    REJECTED: 'RECUSADO',
  })[s] || s;

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
                        ${
                          req.status === 'REJECTED' && req.rejectionReason
                            ? `
                            <div class="rejection-box">
                                <strong class="rejection-box-title">Motivo da Recusa</strong> 
                                ${req.rejectionReason}
                            </div>
                        `
                            : ''
                        }
                    </div>
                    <small style="color: var(--text-muted)">${new Date(req.createdAt).toLocaleDateString()}</small>
                </div>
                <h3 style="margin-bottom: 4px;">${req.clientName}</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">${req.cnpj || 'Sem CNPJ'}</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                    <div style="min-width: 0; overflow-wrap: anywhere;">
                        <small style="font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">RESPONSÁVEL</small>
                        <p style="font-size: 0.9rem; font-weight: 600; overflow-wrap: anywhere;">${req.responsiblePerson?.name || 'N/A'}</p>
                        <p style="font-size: 0.85rem; color: var(--text-muted); overflow-wrap: anywhere;">${req.responsiblePerson?.email || ''}</p>
                        <p style="font-size: 0.85rem; color: var(--text-muted); overflow-wrap: anywhere;">${req.responsiblePerson?.phone || ''}</p>
                    </div>
                    <div style="min-width: 0; overflow-wrap: anywhere;">
                        <small style="font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">CONTATO TÉCNICO</small>
                        <p style="font-size: 0.9rem; font-weight: 600; overflow-wrap: anywhere;">${contact.name || 'N/A'}</p>
                        <p style="font-size: 0.85rem; color: var(--text-muted); overflow-wrap: anywhere;">${contact.email || ''}</p>
                        <p style="font-size: 0.85rem; color: var(--text-muted); overflow-wrap: anywhere;">${contact.phone || ''}</p>
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
                    </div>
                    <div style="margin-bottom: 12px;">
                        <small style="font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">BANCO DE DADOS</small>
                        <p style="font-size: 0.8rem; font-family: monospace;">${db.host}:${db.port} / ${db.database}</p>
                    </div>
                    <div>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
                            ${req.modules.map((m) => `<span class="tag-pill">${m}</span>`).join('')}
                        </div>
                        <div style="font-size: 0.75rem;">
                            ${req.scopes.map((s) => `<strong>${s.resource}:</strong> ${s.actions.map(translateAction).join(', ')}`).join(' | ')}
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
    const isExpired =
      hasInvite && new Date(inv.expiresAt) < new Date() && !inv.acceptedAt;

    console.log('UserRow data:', u);

    return `
        <tr class="user-main-row">
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    ${
                      hasInvite
                        ? `
                        <button class="btn-icon" onclick="UI.toggleInvite('${u.id}')" id="btn-exp-${u.id}">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s;" id="svg-exp-${u.id}">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    `
                        : '<div style="width: 24px;"></div>'
                    }
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
        ${
          hasInvite
            ? `
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
        `
            : ''
        }
    `;
  },
  UserTable: (users) => `
        <div class="card">
            <div class="card-header">
                <h2>Gestão de Usuários</h2>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline" onclick="Data.fetchUsers()" title="Atualizar dados"><i class='bx bx-refresh'></i></button>
                    <button class="btn btn-primary" onclick="UI.openUserModal()">+ Novo Usuário</button>
                </div>
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
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline" onclick="Data.fetchRoles()" title="Atualizar dados"><i class='bx bx-refresh'></i></button>
                    <button class="btn btn-primary" onclick="UI.openRoleModal()">+ Novo Perfil</button>
                </div>
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
                    <button id="btn-test-${c.id}" class="btn btn-outline btn-sm" onclick="Data.testCred('${c.id}')">Testar conexão</button>
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
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline" onclick="Data.fetchCreds()" title="Atualizar dados"><i class='bx bx-refresh'></i></button>
                    <button class="btn btn-primary" onclick="UI.openCredModal()">+ Nova Credencial</button>
                </div>
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
      INFO: { label: 'Informativo', class: 'info', icon: 'bx-info-circle' },
      WARNING: { label: 'Aviso', class: 'warning', icon: 'bx-error' },
      ALERT: { label: 'Alerta', class: 'alert', icon: 'bx-alarm' },
      DOC: { label: 'Doc', class: 'doc', icon: 'bx-book' },
    };
    const type = typeLabels[ann.type] || typeLabels.INFO;

    const checkboxHtml = ann.newsletterId
      ? `<span class="tag-pill" style="font-size:0.75rem; background: rgba(59, 130, 246, 0.1); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2); padding: 2px 6px; border-radius: 4px;" title="Enviado na Newsletter #${ann.newsletterId}">News #${ann.newsletterId}</span>`
      : `<input type="checkbox" class="ann-checkbox" value="${ann.id}" onchange="UI.updateNewsletterButtonState()" style="width: 16px; height: 16px; cursor: pointer; accent-color: var(--primary);">`;

    return `
        <tr>
            <td style="width: 50px; text-align: center;">${checkboxHtml}</td>
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
                    ${ann.endDate ? `Até: ${new Date(ann.endDate).toLocaleDateString()}` : ann.startDate ? '' : 'Sempre ativo'}
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
            <div class="card-header" style="flex-wrap: wrap; gap: 12px;">
                <h2>Gestão de Avisos do Sistema</h2>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <button id="btn-prep-newsletter" class="btn btn-outline btn-sm" style="display: none; color: var(--primary); border-color: var(--primary);" onclick="UI.openNewsletterModal()">
                        <i class='bx bx-envelope' style="font-size: 1.1rem; vertical-align: middle;"></i> Preparar para Newsletter
                    </button>
                    <button class="btn btn-outline" onclick="Data.fetchAnnouncements()" title="Atualizar dados"><i class='bx bx-refresh'></i></button>
                    <button class="btn btn-primary" onclick="UI.openAnnouncementModal()">+ Novo Aviso</button>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th style="width: 50px; text-align: center;">
                                <input type="checkbox" id="select-all-anns" onchange="UI.selectAllAnnouncements(this)" style="width: 16px; height: 16px; cursor: pointer; accent-color: var(--primary);">
                            </th>
                            <th>Conteúdo</th>
                            <th>Tipo</th>
                            <th>Validade</th>
                            <th>Vistos</th>
                            <th>Ativo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="anns-table-body">${anns.map(Components.AnnouncementRow).join('')}</tbody>
                </table>
            </div>
        </div>
    `,
  RequestFilterTabs: (activeFilter = 'ALL') => {
    const tabs = [
      { id: 'ALL', label: 'Todas', icon: 'bx-list-ul' },
      { id: 'PENDING', label: 'Pendentes', icon: 'bx-time-five' },
      {
        id: 'AWAITING_CONFIRMATION',
        label: 'Aguardando E-mail',
        icon: 'bx-envelope',
      },
      { id: 'APPROVED', label: 'Aprovadas', icon: 'bx-check-circle' },
      { id: 'REJECTED', label: 'Recusadas', icon: 'bx-x-circle' },
    ];

    return `
            <div class="filter-tabs-wrapper" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
                <div class="filter-tabs" style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px;">
                    ${tabs
                      .map(
                        (t) => `
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
                    `,
                      )
                      .join('')}
                </div>
                <button class="btn btn-outline" onclick="Data.fetchRequests()" title="Atualizar solicitações" style="padding: 10px; border-radius: 10px;">
                    <i class='bx bx-refresh' style="font-size: 1.2rem;"></i>
                </button>
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
                <a href="https://stats.uptimerobot.com/zHdEriLG2n/802908478/" target="_blank" class="btn btn-outline" style="text-align: center; text-decoration: none;">Verificar Status</a>
            </div>


            <div class="card link-card" style="display: flex; flex-direction: column; gap: 1rem; padding: 2rem; border: 1px dashed var(--primary); background: rgba(16, 185, 129, 0.05);">
                <div style="font-size: 2.5rem; color: var(--primary);"><i class='bx bx-support'></i></div>
                <h3 style="margin: 0;">Suporte Interno</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; flex-grow: 1;">Dúvidas técnicas ou problemas com o painel administrativo? Acione o time de desenvolvimento.</p>
                <a href="mailto:suporte@infobrasilsistemas.com.br" class="btn btn-primary" style="text-align: center; text-decoration: none;">Enviar E-mail</a>
            </div>
        </div>
    `,

  DashboardTopUserRow: (u) => {
    const usagePercent = Math.min(100, Math.round((u.monthlyRequests / (u.planReqMonth || 1)) * 100));
    const statusBadge = u.status
      ? `<span class="tag-pill" style="background: rgba(16, 185, 129, 0.1); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.2);">Ativo</span>`
      : `<span class="tag-pill" style="background: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.2);">Inativo</span>`;

    return `
      <tr>
          <td style="padding: 10px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 32px; height: 32px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; font-size: 0.85rem;">
                      ${(u.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                      <div style="font-weight: 600; color: white;">${u.username}</div>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">${u.email || 'Sem e-mail'}</div>
                  </div>
              </div>
          </td>
          <td style="padding: 10px;"><span class="tag-pill">${u.planName || 'Sem Plano'}</span></td>
          <td style="font-weight: 600; color: white; text-align: center; padding: 10px;">${u.totalRequests.toLocaleString()}</td>
          <td style="padding: 10px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="flex-grow: 1; height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                      <div style="width: ${usagePercent}%; height: 100%; background: ${usagePercent > 80 ? 'var(--danger)' : 'var(--primary)'}; border-radius: 4px;"></div>
                  </div>
                  <span style="font-size: 0.8rem; font-weight: 600; color: ${usagePercent > 80 ? 'var(--danger)' : 'var(--text-muted)'}; min-width: 35px; text-align: right;">
                      ${usagePercent}%
                  </span>
              </div>
              <small style="font-size: 0.7rem; color: var(--text-muted); display: block; margin-top: 2px;">
                  ${u.monthlyRequests.toLocaleString()} / ${(u.planReqMonth || 0).toLocaleString()}
              </small>
          </td>
          <td style="color: ${u.errorRate > 10 ? 'var(--danger)' : 'var(--success)'}; font-weight: 600; text-align: center; padding: 10px;">
              ${u.errorRate}%
          </td>
          <td style="padding: 10px;">${statusBadge}</td>
      </tr>
    `;
  },

  DashboardTopEndpointRow: (e) => {
    const methodColor = {
      GET: 'var(--primary)',
      POST: 'var(--success)',
      PATCH: 'var(--warning)',
      DELETE: 'var(--danger)',
    }[e.method] || 'var(--text-muted)';

    return `
      <tr>
          <td style="width: 80px; padding: 10px;"><span class="tag-pill" style="background: rgba(255,255,255,0.05); color: ${methodColor}; border: 1px solid ${methodColor}; font-weight: 700; width: 60px; text-align: center; display: inline-block;">${e.method}</span></td>
          <td style="font-family: monospace; font-size: 0.85rem; color: white; padding: 10px;">${e.path}</td>
          <td style="font-weight: 600; color: white; text-align: center; padding: 10px;">${e.totalRequests.toLocaleString()}</td>
          <td style="color: ${e.successRate > 90 ? 'var(--success)' : e.successRate > 75 ? 'var(--warning)' : 'var(--danger)'}; font-weight: 600; text-align: center; padding: 10px;">
              ${e.successRate}%
          </td>
          <td style="color: white; text-align: center; padding: 10px; font-family: monospace;">
              ${e.avgLatency ? e.avgLatency + ' ms' : '-'}
          </td>
          <td style="color: white; text-align: center; padding: 10px; font-family: monospace; font-weight: 600;">
              ${e.p95Latency ? e.p95Latency + ' ms' : '-'}
          </td>
      </tr>
    `;
  },

  DashboardRequestLogRow: (log) => {
    const methodColor = {
      GET: 'var(--primary)',
      POST: 'var(--success)',
      PATCH: 'var(--warning)',
      DELETE: 'var(--danger)',
    }[log.method] || 'var(--text-muted)';

    const statusColor = log.status >= 500 ? 'var(--danger)' : log.status >= 400 ? 'var(--warning)' : 'var(--success)';
    const dateStr = new Date(log.timestamp).toLocaleString('pt-BR');

    return `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 10px; font-family: monospace; color: var(--text-muted);">${dateStr}</td>
          <td style="padding: 10px;"><span class="tag-pill" style="background: rgba(255,255,255,0.05); color: ${methodColor}; border: 1px solid ${methodColor}; font-weight: 700; width: 60px; text-align: center; display: inline-block;">${log.method}</span></td>
          <td style="padding: 10px; font-family: monospace; color: white;">${log.path}</td>
          <td style="padding: 10px;"><span style="color: ${statusColor}; font-weight: 700;">${log.status}</span></td>
          <td style="padding: 10px; font-family: monospace; color: white;">${log.durationMs ? log.durationMs.toFixed(2) + ' ms' : '-'}</td>
          <td style="padding: 10px; color: white;"><strong>${log.username}</strong> <span style="color: var(--text-muted); font-size: 0.8rem;">(${log.email})</span></td>
      </tr>
    `;
  },

  DashboardContent: (summary, topUsers, topEndpoints, proactiveAlerts, databaseLoad, planDist, heartbeat, requestLogs) => {
    const activeRefresh = localStorage.getItem('dashboard-auto-refresh') === 'true' ? 'checked' : '';

    const proactiveRows = proactiveAlerts.map(a => `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 10px 0;"><strong style="color: white;">${a.username}</strong><br><small style="color: var(--text-muted);">${a.email || ''}</small></td>
              <td style="padding: 10px 0;"><span class="tag-pill">${a.planName}</span></td>
              <td style="color: var(--danger); font-weight: 700; text-align: right; padding: 10px 0;">${a.usagePercentage}%</td>
          </tr>
      `).join('') || `<tr><td colspan="3" style="text-align: center; color: var(--text-muted); padding: 20px;">Nenhum usuário crítico no momento (>80%)</td></tr>`;

    const dbRows = databaseLoad.map(d => `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 10px 0; font-family: monospace; color: white;">${d.host}</td>
              <td style="color: var(--text-muted); font-size: 0.85rem; padding: 10px 0;">${d.database}</td>
              <td style="font-weight: 600; text-align: right; color: white; padding: 10px 0;">${d.totalRequests.toLocaleString()}</td>
          </tr>
      `).join('') || `<tr><td colspan="3" style="text-align: center; color: var(--text-muted); padding: 20px;">Sem dados</td></tr>`;

    return `
      <!-- Toolbar de Controles -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 15px;">
          <div>
              <div style="display: flex; align-items: center; gap: 10px;">
                  <h1 style="margin: 0; color: white;">Dashboard de Uso da API</h1>
                  ${heartbeat ? `
                  <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border); font-size: 0.75rem; font-weight: 600;">
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${heartbeat.status === 'ACTIVE' ? '#10b981' : '#ef4444'}; box-shadow: 0 0 8px ${heartbeat.status === 'ACTIVE' ? '#10b981' : '#ef4444'};"></span>
                      <span style="color: ${heartbeat.status === 'ACTIVE' ? '#10b981' : '#ef4444'};">${heartbeat.status === 'ACTIVE' ? 'Consumer Ativo' : 'Consumer Inativo'}</span>
                  </div>
                  ` : ''}
              </div>
              <p style="color: var(--text-muted); margin: 5px 0 0 0; font-size: 0.9rem;">Métricas de consumo, tráfego e usuários em tempo real.</p>
          </div>
          <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
              <!-- Auto Refresh Control -->
              <div style="display: flex; align-items: center; gap: 8px; background: var(--card-bg); border: 1px solid var(--border); padding: 8px 16px; border-radius: 10px;">
                  <label class="switch" style="position: relative; display: inline-block; width: 36px; height: 18px; margin: 0;">
                      <input type="checkbox" id="dashboard-refresh-toggle" onchange="Data.toggleDashboardRefresh(this)" ${activeRefresh} style="width: 100%; height: 100%; cursor: pointer; accent-color: var(--primary);">
                  </label>
                  <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">
                      Auto-refresh (30m)
                  </span>
                  <span id="dashboard-refresh-countdown" style="font-size: 0.85rem; font-weight: 600; color: var(--primary); margin-left: 5px; display: none;"></span>
              </div>

              <!-- Filtro de Período -->
              <select id="dashboard-date-filter" onchange="Data.fetchDashboard()" 
                  style="
                      padding: 10px 16px; 
                      border-radius: 10px; 
                      border: 1px solid var(--border); 
                      background: var(--card-bg); 
                      color: white; 
                      cursor: pointer;
                      font-weight: 500;
                      outline: none;
                  ">
                  <option value="1h">Última 1 hora</option>
                  <option value="6h">Últimas 6 horas</option>
                  <option value="24h">Últimas 24 horas</option>
                  <option value="7days">Últimos 7 dias</option>
                  <option value="30days" selected>Últimos 30 dias</option>
              </select>
              <button class="btn btn-outline" onclick="Data.fetchDashboard()" title="Atualizar dados" style="padding: 10px; border-radius: 10px;">
                  <i class='bx bx-refresh' style="font-size: 1.2rem;"></i>
              </button>
          </div>
      </div>

      <!-- Cards de Visão Executiva -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <div class="card" style="padding: 1.5rem; display: flex; align-items: center; gap: 1.5rem;">
              <div style="font-size: 2.2rem; color: var(--primary); background: rgba(16, 185, 129, 0.1); width: 60px; height: 60px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">
                  <i class='bx bx-data'></i>
              </div>
              <div>
                  <small style="color: var(--text-muted); font-weight: 600; display: block; margin-bottom: 4px;">TOTAL DE REQUISIÇÕES</small>
                  <h2 style="margin: 0; font-size: 1.6rem; color: white;">${summary.totalRequests.toLocaleString()}</h2>
              </div>
          </div>
          <div class="card" style="padding: 1.5rem; display: flex; align-items: center; gap: 1.5rem;">
              <div style="font-size: 2.2rem; color: var(--primary); background: rgba(16, 185, 129, 0.1); width: 60px; height: 60px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">
                  <i class='bx bx-group'></i>
              </div>
              <div>
                  <small style="color: var(--text-muted); font-weight: 600; display: block; margin-bottom: 4px;">USUÁRIOS ATIVOS</small>
                  <h2 style="margin: 0; font-size: 1.6rem; color: white;">${summary.activeUsers.toLocaleString()}</h2>
              </div>
          </div>
          <div class="card" style="padding: 1.5rem; display: flex; align-items: center; gap: 1.5rem;">
              <div style="font-size: 2.2rem; color: var(--success); background: rgba(16, 185, 129, 0.1); width: 60px; height: 60px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">
                  <i class='bx bx-check-double'></i>
              </div>
              <div>
                  <small style="color: var(--text-muted); font-weight: 600; display: block; margin-bottom: 4px;">TAXA DE SUCESSO</small>
                  <h2 style="margin: 0; font-size: 1.6rem; color: white;">${summary.successRate.toFixed(2)}%</h2>
              </div>
          </div>
          <div class="card" style="padding: 1.5rem; display: flex; align-items: center; gap: 1.5rem;">
              <div style="font-size: 2.2rem; color: var(--danger); background: rgba(239, 68, 68, 0.1); width: 60px; height: 60px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">
                  <i class='bx bx-shield-quarter'></i>
              </div>
              <div>
                  <small style="color: var(--text-muted); font-weight: 600; display: block; margin-bottom: 4px;">LIMITES EXCEDIDOS (429)</small>
                  <h2 style="margin: 0; font-size: 1.6rem; color: white;">${summary.rateLimitHits.toLocaleString()}</h2>
              </div>
          </div>
          <div class="card" style="padding: 1.5rem; display: flex; align-items: center; gap: 1.5rem;">
              <div style="font-size: 2.2rem; color: #f59e0b; background: rgba(245, 158, 11, 0.1); width: 60px; height: 60px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">
                  <i class='bx bx-time-five'></i>
              </div>
              <div>
                  <small style="color: var(--text-muted); font-weight: 600; display: block; margin-bottom: 4px;">LATÊNCIA P95</small>
                  <h2 style="margin: 0; font-size: 1.6rem; color: white;">${summary.p95Latency ? summary.p95Latency + ' ms' : '0 ms'}</h2>
              </div>
          </div>
      </div>

      <!-- Linha 1: Evolução Temporal & Status Codes -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 2rem; min-height: 350px; flex-wrap: wrap;">
          <!-- Gráfico de Linha de requisições -->
          <div class="card" style="padding: 1.5rem; display: flex; flex-direction: column;">
              <h3 style="margin-top: 0; margin-bottom: 1rem; color: white;">Evolução Temporal das Requisições</h3>
              <div id="chart-time-series" style="flex-grow: 1; width: 100%; min-height: 300px;"></div>
          </div>
          <!-- Gráfico Donut de Status Codes -->
          <div class="card" style="padding: 1.5rem; display: flex; flex-direction: column;">
              <h3 style="margin-top: 0; margin-bottom: 1rem; color: white;">Distribuição de Status HTTP</h3>
              <div id="chart-status-dist" style="flex-grow: 1; width: 100%; min-height: 300px; display: flex; align-items: center; justify-content: center;"></div>
          </div>
      </div>

      <!-- Linha 2: Top Usuários -->
      <div class="card" style="margin-bottom: 2rem; padding: 1.5rem;">
          <h3 style="margin-top: 0; margin-bottom: 1rem; color: white;">Top Usuários (Maior Consumo)</h3>
          <div class="table-container" style="max-height: 400px; overflow-y: auto;">
              <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                      <tr style="border-bottom: 1px solid var(--border);">
                          <th style="text-align: left; padding: 10px; color: var(--text-muted);">Usuário / Cliente</th>
                          <th style="text-align: left; padding: 10px; color: var(--text-muted);">Plano</th>
                          <th style="text-align: center; padding: 10px; width: 150px; color: var(--text-muted);">Total Requisições</th>
                          <th style="text-align: left; padding: 10px; width: 220px; color: var(--text-muted);">Progresso do Limite Mensal</th>
                          <th style="text-align: center; padding: 10px; width: 100px; color: var(--text-muted);">Taxa Erro</th>
                          <th style="text-align: left; padding: 10px; width: 100px; color: var(--text-muted);">Status</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${topUsers.map(Components.DashboardTopUserRow).join('') || '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">Nenhum log de requisição encontrado.</td></tr>'}
                  </tbody>
              </table>
          </div>
      </div>

      <!-- Linha 3: Top Endpoints -->
      <div class="card" style="margin-bottom: 2rem; padding: 1.5rem;">
          <h3 style="margin-top: 0; margin-bottom: 1rem; color: white;">Top Endpoints (Mais Requisitados & Latência)</h3>
          <div class="table-container" style="max-height: 400px; overflow-y: auto;">
              <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                      <tr style="border-bottom: 1px solid var(--border);">
                          <th style="text-align: left; padding: 10px; width: 80px; color: var(--text-muted);">Método</th>
                          <th style="text-align: left; padding: 10px; color: var(--text-muted);">Rota / Endpoint Sanitizado</th>
                          <th style="text-align: center; padding: 10px; width: 140px; color: var(--text-muted);">Total Chamadas</th>
                          <th style="text-align: center; padding: 10px; width: 120px; color: var(--text-muted);">Taxa de Sucesso</th>
                          <th style="text-align: center; padding: 10px; width: 120px; color: var(--text-muted);">Média Latência</th>
                          <th style="text-align: center; padding: 10px; width: 120px; color: var(--text-muted);">Latência P95</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${topEndpoints.map(Components.DashboardTopEndpointRow).join('') || '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">Nenhum log de requisição encontrado.</td></tr>'}
                  </tbody>
              </table>
          </div>
      </div>

      <!-- Linha 4: Tabelas Menores Auxiliares -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
          <!-- Alertas Proativos -->
          <div class="card" style="padding: 1.5rem; display: flex; flex-direction: column;">
              <h3 style="margin-top: 0; margin-bottom: 0.5rem; color: var(--danger); display: flex; align-items: center; gap: 8px;">
                  <i class='bx bx-bell'></i> Alertas Críticos (>80% do Limite)
              </h3>
              <p style="color: var(--text-muted); font-size: 0.8rem; margin: 0 0 1rem 0;">Usuários próximos ao estouro mensal do plano.</p>
              <div style="flex-grow: 1; overflow-y: auto; max-height: 250px;">
                  <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                      <thead>
                          <tr style="border-bottom: 1px solid var(--border); color: var(--text-muted);">
                              <th style="text-align: left; padding: 8px 0; color: var(--text-muted);">Usuário</th>
                              <th style="text-align: left; padding: 8px 0; color: var(--text-muted);">Plano</th>
                              <th style="text-align: right; padding: 8px 0; color: var(--text-muted);">Uso %</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${proactiveRows}
                      </tbody>
                  </table>
              </div>
          </div>

          <!-- Banco de Dados Load -->
          <div class="card" style="padding: 1.5rem; display: flex; flex-direction: column;">
              <h3 style="margin-top: 0; margin-bottom: 0.5rem; color: white; display: flex; align-items: center; gap: 8px;">
                  <i class='bx bx-server'></i> Carga por Banco de Dados
              </h3>
              <p style="color: var(--text-muted); font-size: 0.8rem; margin: 0 0 1rem 0;">Acessos consolidados por servidor/banco de dados.</p>
              <div style="flex-grow: 1; overflow-y: auto; max-height: 250px;">
                  <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                      <thead>
                          <tr style="border-bottom: 1px solid var(--border); color: var(--text-muted);">
                              <th style="text-align: left; padding: 8px 0; color: var(--text-muted);">Host</th>
                              <th style="text-align: left; padding: 8px 0; color: var(--text-muted);">Database</th>
                              <th style="text-align: right; padding: 8px 0; color: var(--text-muted);">Chamadas</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${dbRows}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>

      <!-- Linha 5: HTTP Request Logs (Sentry Style) -->
      <div class="card" style="margin-top: 2rem; padding: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 10px;">
              <div>
                  <h3 style="margin: 0; color: white; display: flex; align-items: center; gap: 8px;">
                      <i class='bx bx-list-ul' style="color: var(--primary);"></i> Log de Requisições HTTP (Real-Time)
                  </h3>
                  <p style="color: var(--text-muted); font-size: 0.8rem; margin: 4px 0 0 0;">Histórico recente de requisições de clientes do período selecionado.</p>
              </div>
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600; background: rgba(255,255,255,0.05); padding: 4px 12px; border-radius: 20px;">Mostrando as últimas 50 requisições</span>
          </div>
          <div class="table-container" style="max-height: 450px; overflow-y: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                  <thead>
                      <tr style="border-bottom: 1px solid var(--border); text-align: left; color: var(--text-muted);">
                          <th style="padding: 10px; width: 180px; color: var(--text-muted);">Timestamp</th>
                          <th style="padding: 10px; width: 80px; color: var(--text-muted);">Método</th>
                          <th style="padding: 10px; color: var(--text-muted);">Endpoint</th>
                          <th style="padding: 10px; width: 80px; color: var(--text-muted);">Status</th>
                          <th style="padding: 10px; width: 120px; color: var(--text-muted);">Tempo Resposta</th>
                          <th style="padding: 10px; color: var(--text-muted);">Usuário Chamador</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${requestLogs.map(Components.DashboardRequestLogRow).join('') || '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">Nenhum log de requisição no período.</td></tr>'}
                  </tbody>
              </table>
          </div>
      </div>
      `;
  },
};
