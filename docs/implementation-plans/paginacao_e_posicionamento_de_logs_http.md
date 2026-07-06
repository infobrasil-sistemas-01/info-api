# Plano de Implementação: Paginação e Reordenamento do Painel de Logs HTTP

Este plano detalha as alterações para introduzir paginação no painel de Logs HTTP (estilo Sentry) e reposicioná-lo para a terceira linha do dashboard administrativo (acima do bloco de Top Endpoints).

---

## 1. Alterações Propostas

### 1.1 Backend (NestJS)

#### [MODIFY] [dashboard.service.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.service.ts)
- Alterar o método `getRequestLogs` para aceitar o parâmetro `page`.
- Calcular o `offset = (page - 1) * limit`.
- Executar uma query de contagem total concorrentemente (`COUNT(rl.id)`) para retornar metadados de paginação.
- Retornar o formato estruturado: `{ data: any[], meta: { total, page, limit, totalPages } }`.

#### [MODIFY] [dashboard.controller.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.controller.ts)
- Aceitar o parâmetro query `page` (padrão 1).
- Encaminhar `page` para o serviço.

---

### 1.2 Frontend (Dashboard Admin)

#### [MODIFY] [admin-components.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/admin-components.js)
1. **DashboardContent**:
   - Ajustar a renderização da tabela para iterar sobre `requestLogs.data` (em vez de `requestLogs`).
   - Adicionar os botões de controle de paginação (Anterior/Próxima) e o contador textual de páginas no rodapé da tabela.
   - Mudar a posição da seção de logs no template final para a **terceira linha** (abaixo de Top Usuários e acima de Top Endpoints).

#### [MODIFY] [admin-core.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/admin-core.js)
- Adicionar `logsCurrentPage` no objeto global `State` (iniciando em 1).
- Modificar `Data.fetchDashboard(isPagination = false)` para zerar a página atual para `1` quando a chamada for por alteração de filtros/refresh, mas manter o valor atual ao paginar.
- Criar a função `Data.changeLogsPage(page)` que atualiza `State.logsCurrentPage` e dispara `fetchDashboard(true)`.

---

## 2. Plano de Verificação

### 2.1 Testes Automatizados
- Atualizar a suíte de testes unitários do `DashboardService` em `dashboard.service.spec.ts` para contemplar a estrutura de paginação de logs.
- Executar a suíte inteira via `npm.cmd run test`.

### 2.2 Verificação Manual
1. Abrir o dashboard admin e testar os botões de paginação, confirmando se os dados e os contadores atualizam perfeitamente.
2. Mudar o range de data (ex: Últimos 7 dias) e verificar se o número da página é reiniciado para 1.
