# Adição de RPM (Requests Per Minute) no Painel do Dashboard

Este plano detalha as alterações necessárias para expor e renderizar a métrica de **RPM (Requisições por Minuto)** de forma dinâmica e agradável no painel administrativo do dashboard. Exibiremos tanto o RPM atual (tráfego em tempo real no último minuto) quanto a média de RPM referente ao período selecionado no filtro.

---

## User Review Required

> [!IMPORTANT]
> A adição de um sexto card no grid executivo do dashboard (`display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))`) faz com que o layout se ajuste automaticamente de forma responsiva. Em telas largas, os 6 cards ficarão dispostos em 3 colunas por 2 linhas (ou 6 colunas dependendo do zoom), mantendo a harmonia visual.

---

## Proposed Changes

### 1. Backend (Métricas de RPM)

#### [MODIFY] [dashboard.service.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.service.ts)
- Calcular o `averageRpm` baseado na diferença em minutos entre `startDate` e `endDate` e no `totalRequests`:
  ```typescript
  const diffMinutes = Math.max(1, (endDate.getTime() - startDate.getTime()) / (1000 * 60));
  const averageRpm = Number((totalRequests / diffMinutes).toFixed(2));
  ```
- Calcular o `currentRpm` (tráfego em tempo real) contando as requisições ativas no último 1 minuto:
  ```typescript
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const currentRpm = await this.prisma.requestLog.count({
    where: {
      createdAt: { gte: oneMinuteAgo },
      NOT: [
        { path: { startsWith: '/api/v1/dashboard' } },
        { path: { startsWith: '/api/v1/newsletter' } },
      ],
      ...(userId ? { userId } : {}),
    },
  });
  ```
- Retornar as novas chaves `currentRpm` e `averageRpm` no objeto retornado por `getSummary`.

---

### 2. Frontend (Exibição do Card)

#### [MODIFY] [admin-components.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/admin-components.js)
- Adicionar o card de RPM ao grid de Visão Executiva no método `Components.DashboardContent`.
- Utilizar a cor indigo/violeta (`#6366f1` / `rgba(99, 102, 241, 0.1)`) para diferenciar a métrica.
- Incluir o ícone de pulso (`bx bx-pulse`) com um elemento CSS dinâmico que simula uma animação de pulsação suave (*pulse dot*) para indicar tráfego em tempo real.
- Exibir a contagem atual e a média no período de forma clara.

---

### 3. Testes Unitários (Ajuste de Mock)

#### [MODIFY] [dashboard.service.spec.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.service.spec.ts)
- Atualizar os casos de testes que chamam `getSummary` para mockar a quarta chamada do método `mockPrisma.requestLog.count` (referente ao cálculo do `currentRpm`).
- Incluir as chaves `currentRpm` e `averageRpm` nos objetos de retorno esperados nos asserts.

---

## Verification Plan

### Automated Tests
- Executar os testes unitários do módulo de dashboard para verificar se os mocks de banco de dados e as respostas de assert estão alinhados:
  ```bash
  npx.cmd jest src/modules/dashboard/dashboard.service.spec.ts
  ```

### Manual Verification
1. Iniciar o servidor de desenvolvimento:
   ```bash
   npm run start:dev
   ```
2. Acessar a tela de administração e autenticar-se.
3. Confirmar que o novo card **RPM** aparece no painel com a animação de pulsação ativa.
4. Alterar os filtros de datas (ex: última 1 hora, últimas 24 horas, últimos 30 dias) e certificar que a **Média no Período** é recalculada e que o **RPM atual** se mantém atualizado.
