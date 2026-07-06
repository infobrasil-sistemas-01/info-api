# Remoção do Card de IPs e Alinhamento do Dashboard do Admin

## Objetivo

1. Remover o card de "IPs de Origem mais Ativos" (Top IPs) tanto do frontend (interface do usuário) quanto do backend (APIs e endpoints correspondentes) do Dashboard do Admin.
2. Validar o alinhamento da somatória geral de requisições com a lista de endpoints mais requisitados, garantindo que o filtro temporal (período selecionado) é aplicado de forma consistente em todas as queries.
3. Investigar e corrigir a volumetria inesperada de requisições para `/api/v1/newsletter/preview` (136 chamadas reportadas pelo usuário).

---

## Análise e Validação do Filtro Temporal & Volumetria de Newsletter

Confirmamos as seguintes descobertas:
- **Filtro Temporal**: O filtro temporal (`startDate` e `endDate`) é repassado e aplicado a **todas** as queries de consumo do período no `DashboardService`. A somatória geral em `getSummary` usa os mesmos critérios de exclusão e período que `getTopEndpoints`, garantindo o alinhamento dos dados.
- **Volumetria de Newsletter (Bug Encontrado)**:
  1. A rota `/api/v1/newsletter/preview` está sendo disparada no evento `oninput` (a cada tecla digitada) no assunto e mensagens da newsletter na tela de administração, sem qualquer debounce.
  2. Adicionalmente, `/api/v1/newsletter` é uma rota de gestão operacional e **não** deveria estar sendo logada em `request_logs` (que deve contar apenas consumo da API de integração pelos clientes), mas foi omitida da lista de isenções del `PlanLimitInterceptor`.
  3. Para corrigir isso na raiz, iremos isentar a rota `/api/v1/newsletter` no interceptor de logs, adicionar a exclusão do caminho nas queries existentes do dashboard para limpar o histórico visual, e aplicar um debounce de 500ms no frontend para evitar avalanche de chamadas futuras.

---

## Modificações Propostas

### 1. Frontend (Templates e Assets)

#### [MODIFY] [admin-components.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/admin-components.js)
- Remover o parâmetro `topIPs` da assinatura de `Components.DashboardContent`.
- Remover a geração da constante `ipRows` baseada no mapeamento de `topIPs`.
- Remover a marcação HTML correspondente ao bloco `<!-- Top IPs -->` (linhas 719-738).

#### [MODIFY] [admin-core.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/admin-core.js)
- Debouçar as chamadas de `UI.updateNewsletterPreview()` com um delay de 500ms usando `setTimeout` para evitar disparos em lote por caractere digitado.
- Remover a requisição a `/dashboard/top-ips` do `Promise.all` em `fetchDashboard`.
- Remover a constante `resIPs` do array resultante e a validação correspondente de `!resIPs.ok`.
- Remover o parsing da variável `topIPs` e sua passagem como argumento no `Components.DashboardContent`.

---

### 2. Backend (Interceptor & Dashboard Module)

#### [MODIFY] [plan-limit.interceptor.ts](file:///c:/dev/infoapi/src/modules/plan/interceptors/plan-limit.interceptor.ts)
- Adicionar `/api/v1/newsletter` à lista `isExcluded` para evitar que rotas de preview/envio de newsletter administrativa gravem logs de requisições de clientes.

#### [MODIFY] [dashboard.service.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.service.ts)
- Adicionar a exclusão de caminhos começando com `/api/v1/newsletter` nas consultas do dashboard:
  - No Prisma Client do `getSummary`: adicionar exclusão usando `NOT: [ { path: { startsWith: '/api/v1/dashboard' } }, { path: { startsWith: '/api/v1/newsletter' } } ]`.
  - Nas queries SQL puras (`getTopUsers`, `getTopEndpoints`, `getStatusDistribution`, `getTimeSeries`, `getProactiveAlerts`, `getDatabaseLoad`, `getPlanDistribution`): adicionar `AND path NOT LIKE '/api/v1/newsletter%'` (ou `rl.path` conforme o caso).
- Remover o método `getTopIPs` obsoleto.

#### [MODIFY] [dashboard.controller.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.controller.ts)
- Remover o endpoint `@Get('top-ips')`.

---

## Plano de Verificação

### Testes Automatizados
- Executar a suíte de testes unitários para validar o comportamento do dashboard e garantir que não há regressões:
  ```bash
  npm run test
  ```

### Verificação Manual
- Iniciar a aplicação localmente (`npm.cmd run start:dev`) e acessar o painel do administrador para confirmar:
  1. Que o card de "IPs de Origem mais Ativos" não é mais exibido.
  2. Que os demais cards e gráficos funcionam corretamente e os dados batem ao selecionar períodos.
  3. Que ao digitar no modal de preview de newsletter, as requisições HTTP para `/api/v1/newsletter/preview` são debouçadas e o contador de chamadas não infla.
