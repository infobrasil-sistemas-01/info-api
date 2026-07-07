# Plano de Implementação: Exportação de Dossiês PDF no Frontend

Este plano detalha a correção de um bug visual (div vazia no final do dashboard) e a introdução da interface de exportação de dossiês em formato PDF diretamente no painel administrativo do Info Vendas.

## Alterações Propostas

### 1. Frontend: Componentes do Painel

#### [MODIFY] [admin-components.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/admin-components.js)

* **Remover Bug Visual**: Excluir a tag órfã `<!-- Linha 5: HTTP Request Logs (Sentry Style) --> <div class="card" style="margin-top: 2rem; padding: 1.5rem;">` no final do arquivo (linhas 804-806).
* **Adicionar Botão do Dossiê Geral (Interno)**:
  * No template da barra de ferramentas (`DashboardContent`), ao lado do botão de atualizar dados, adicionar o botão "Exportar Dossiê" (`#btn-export-dossier`).
* **Adicionar Botão do Dossiê por Cliente**:
  * Na tabela de **Top Usuários** no dashboard, adicionar a coluna "Dossiê" no cabeçalho e, para cada linha, um botão de exportar correspondente com o ícone de PDF do Boxicons (`#btn-export-client-${u.userId}`).
  * Na tabela da aba de **Usuários** (`UserRow`), adicionar o botão de PDF (`#btn-export-user-${u.id}`) na coluna de ações, permitindo gerar o relatório por cliente diretamente da listagem geral de usuários.

---

### 2. Frontend: Lógica do Painel

#### [MODIFY] [admin-core.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/admin-core.js)

* **Adicionar Métodos de Exportação de Arquivos**:
  * **`getDateRange()`**: Função auxiliar para ler a data inicial e final ativa do filtro do dashboard (`#dashboard-date-filter`).
  * **`downloadInternalDossier()`**: Método disparado pelo botão de Dossiê Geral. Altera o texto do botão para exibição de carregamento ("Gerando..."), realiza a requisição à API passando as datas do filtro de período, gera o Blob do PDF e inicia o download do arquivo.
  * **`downloadClientDossier(userId, username)`**: Método disparado pelos botões de PDF de cada cliente. Apresenta o spinner de carregamento no botão específico, solicita o PDF do cliente pelo ID à API, e realiza o download nomeando-o de acordo com o nome da empresa correspondente.

---

## Plano de Verificação

### Verificação Manual
1. **Remoção da Div Vazia**: Acessar o dashboard e certificar-se de que a barra vazia cinza no final da página sumiu.
2. **Exportação de Dossiê Geral**:
   * Clicar no botão "Exportar Dossiê" na barra superior do Dashboard.
   * Verificar se o botão exibe o estado de carregamento e se o download de um PDF chamado `dossie-interno-[data].pdf` é iniciado e gerado corretamente.
3. **Exportação de Dossiê de Cliente**:
   * Na aba "Dashboard", clicar no ícone do PDF na linha de um usuário da tabela de "Top Usuários".
   * Na aba "Usuários", clicar no mesmo ícone na listagem geral.
   * Validar se o botão exibe o spinner e realiza o download de `dossie-cliente-[username]-[data].pdf`.
