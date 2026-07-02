# Plano de Implementação - Dashboard do Administrador (Métricas de Consumo)

Este plano descreve o design e a arquitetura para a criação de uma nova aba de **Dashboard** na área do Administrador da Info Vendas API. O objetivo primário é responder às perguntas: **Quem está consumindo a API?** e **O que está sendo consumido?**

---

## 1. Visão Geral

Atualmente, o sistema possui um interceptor (`PlanLimitInterceptor`) que intercepta requisições não isentas e registra logs detalhados na tabela `RequestLog` do PostgreSQL (contendo `userId`, `method`, `path`, `status`, `ip` e `createdAt`).

Propomos a criação de um novo módulo no NestJS (`DashboardModule`) que consolida esses logs em consultas agregadas eficientes para expor métricas na nova aba de Dashboard do painel de administração (`admin.html`).

Adicionalmente, será incluída uma opção de **Auto-refresh (atualização automática)** configurável na interface para recarregar as métricas periodicamente.

---

## 2. Detalhamento das Métricas (KPIs)

O painel será dividido em blocos de informação estruturados e detalhados abaixo:

### A. Resumo Executivo (Cards Superiores)
*   **Total de Requisições:** Contagem absoluta de todas as requisições gravadas no período selecionado.
*   **Usuários Ativos:** Contagem distinta de `userId` que realizaram ao menos 1 requisição no período.
*   **Taxa de Sucesso Geral:** Percentual de requisições que retornaram status `2xx` em relação ao total.
*   **Bloqueios por Rate Limit:** Contagem de requisições que retornaram `429 (Too Many Requests)` devido ao estouro de limites do plano.
*   **Tempo de Resposta Médio (Opcional - Requer migração de banco):** Se aprovado, propomos adicionar o campo `latency` (inteiro, em milissegundos) na tabela `RequestLog` para exibir a média de tempo de resposta da API.

### B. Quem Consome? (Top Usuários)
Tabela detalhada ordenada decrescentemente por total de requisições:
1.  **Usuário/Cliente:** Identificação (`User.user` e `User.email`).
2.  **Plano Atual:** Nome do plano associado (`Plan.name`).
3.  **Total de Requisições:** Contagem absoluta de acessos do usuário no período.
4.  **Consumo Mensal vs. Limite:** Barra de progresso visual exibindo a relação `(requisições mensais do usuário) / (limite mensal de Plan.reqMonth) * 100`.
5.  **Taxa de Erro Individual:** Percentual de erros `4xx` e `5xx` gerados por aquele usuário.

### C. O que é Consumido? (Top Endpoints)
Tabela detalhada ordenada decrescentemente por total de acessos às rotas da API:
1.  **Método HTTP:** `GET`, `POST`, `PATCH`, `DELETE`, etc.
2.  **Rota Agrupada (Sanitizada):** Exibição amigável agrupando caminhos parametrizados (ex: `/api/v1/products/3c9b-4f8a-921c` vira `/api/v1/products/:id`).
3.  **Volume de Requisições:** Contagem de acessos a essa rota.
4.  **Breakdown de Retornos:** Percentuais de `2xx` (Sucesso), `4xx` (Erro do Cliente) e `5xx` (Erro do Servidor) daquela rota específica para detecção de endpoints instáveis.

### D. Distribuição de Retornos (HTTP Status Codes)
*   Gráfico de rosca/pizza com o agrupamento consolidado das respostas:
    *   `2xx` (Verde: Sucesso)
    *   `3xx` (Cinza: Redirecionamentos)
    *   `4xx` (Amarelo: Erro do Cliente - exceto 429)
    *   `429` (Laranja: Bloqueios de Rate Limit)
    *   `5xx` (Vermelho: Erro de Servidor - bugs críticos)

### E. Evolução Temporal (Gráfico de Linha)
*   Linha temporal mostrando o comportamento volumétrico das requisições (agrupado por hora se o período for < 24h, ou por dia se for 7/30 dias).

### F. Métricas Adicionais Sugeridas (Estratégicas)
1.  **Alerta de Consumo Crítico:** Lista rápida de usuários que já consumiram mais de 80% do seu limite mensal (oportunidade de upgrade comercial).
2.  **Distribuição de Carga por Plano:** Gráfico comparativo de tráfego gerado por plano (Enterprise vs Basic vs Premium).
3.  **Top IPs de Origem:** Identificação dos endereços IPs mais ativos, útil para segurança e detecção de ataques de raspagem de dados.
4.  **Carga por Banco de Dados (DbCredentials):** Total de requisições agrupadas pelo host do banco de dados (DbCredentials) para mapear overload em servidores compartilhados.

---

## 3. Funcionalidade de Atualização Automática (Auto-refresh)

Para que o administrador possa deixar o dashboard aberto em uma tela/monitor de monitoramento sem precisar atualizar a página manualmente, será adicionado um controle de **Auto-refresh**:

*   **Interface (UI):** Um interruptor (switch toggle) ou checkbox posicionado no topo do painel: `[ ] Auto-atualizar (30 min)`.
*   **Comportamento:**
    *   Quando ativado, inicia um timer (`window.setInterval`) de **30 minutos (1.800.000 ms)**.
    *   A cada ciclo de 30 minutos, todas as requisições de dados do dashboard (summary, top users, top endpoints, status, time series) serão refeitas silenciosamente em segundo plano, atualizando os gráficos e tabelas.
    *   Haverá um pequeno indicador visual com a contagem regressiva ou a última hora de atualização (ex: "Última atualização: 10:15:32 - Próxima em 30 min").
    *   O estado de ativação do Auto-refresh será salvo no `localStorage` do navegador para manter a preferência do administrador nas próximas sessões.

---

## 4. Design Técnico e Arquitetura

### A. Banco de Dados e Queries Eficientes
*   **Agrupamento de Endpoints (Path Sanitization):**
    No PostgreSQL, a query utilizará expressões regulares (`regexp_replace`) para agrupar as rotas na própria agregação do banco.
    *   *Exemplo de Regex PostgreSQL:*
        `regexp_replace(path, '/[0-9a-fA-F-]{36}', '/:id', 'g')` (para UUIDs)
        e `regexp_replace(path, '/[0-9]+', '/:id', 'g')` (para IDs numéricos)

### B. RBAC & Permissões
Uma nova permissão será adicionada em `src/infra/rbac/catalog/permissions.catalog.ts`:
*   **Chave:** `core.dashboard.view`
*   **Descrição:** Visualizar dashboard de uso da API
*   **Módulo:** `core`

### C. Estrutura de Arquivos
Será criado o módulo `DashboardModule` na estrutura de diretórios:

#### [NEW] [dashboard.module.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.module.ts)
*   Módulo NestJS padrão.

#### [NEW] [dashboard.controller.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.controller.ts)
*   Controlador protegido com `@RequirePermissions('core.dashboard.view')`.
*   **Rotas:**
    *   `GET /api/v1/dashboard/summary?startDate=...&endDate=...`
    *   `GET /api/v1/dashboard/top-users?startDate=...&endDate=...&limit=...`
    *   `GET /api/v1/dashboard/top-endpoints?startDate=...&endDate=...&limit=...`
    *   `GET /api/v1/dashboard/status-distribution?startDate=...&endDate=...`
    *   `GET /api/v1/dashboard/time-series?startDate=...&endDate=...`

#### [NEW] [dashboard.service.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.service.ts)
*   Executa as queries agregadas no banco usando `this.prisma.$queryRaw`.

---

## 5. Mockup da Interface de Usuário

![Dashboard de Uso da API (Mockup Visual)](file:///C:/Users/gabriel.bezerra/.gemini/antigravity-ide/brain/80d4408d-3a11-4557-830b-4443a9460f35/admin_dashboard_usage_mockup_1782996541414.png)

### Detalhes de Integração do Frontend (`admin.html`)
*   **Novo Botão de Tab:** `<div id="tab-dashboard" class="tab-btn hidden" onclick="switchTab('dashboard')">Dashboard</div>` (Visível apenas para usuários com permissão `core.dashboard.view`).
*   **Nova Seção:** `<section id="section-dashboard" class="tab-content hidden"></section>`.
*   **Biblioteca de Gráficos:** **ApexCharts** via CDN.

---

## 6. Plano de Verificação

### Testes Automatizados
*   **Unitários:** Criação de `dashboard.service.spec.ts` para validar agregação e regex de limpeza de rota.
*   **Segurança (Guard):** Testar bloqueios de rota para usuários sem a permissão `core.dashboard.view`.

### Verificação Manual
*   Acessar o painel administrativo (`admin.html`), ativar o Auto-refresh, simular o tempo no console (reduzindo o tempo para alguns segundos) e checar se o recarregamento automático ocorre conforme o esperado.
