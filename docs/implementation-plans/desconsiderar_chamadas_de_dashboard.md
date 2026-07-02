# Plano de Implementação - Desconsiderar chamadas de dashboard na contagem do próprio dashboard

Este plano descreve as alterações necessárias para desconsiderar as chamadas realizadas nas rotas do próprio Dashboard de Admin (`/api/v1/dashboard/...`) nas contagens de métricas do próprio dashboard e nos limites de uso dos usuários.

## Motivação
Atualmente, quando o Administrador acessa a tela de Dashboard, o painel realiza várias requisições paralelas para buscar as métricas. Se essas chamadas forem interceptadas e registradas na tabela `request_logs`, elas inflam incorretamente os números de uso da API e podem atingir o limite de requisições do usuário administrador.

---

## Alterações Propostas

### 1. Interceptor de Limites de Plano
#### [MODIFY] [plan-limit.interceptor.ts](file:///c:/dev/infoapi/src/modules/plan/interceptors/plan-limit.interceptor.ts)
Bypass nas rotas do dashboard no interceptor de planos, de modo que chamadas ao dashboard não sofram rate limit e não sejam registradas em banco.

- Adicionar o prefixo `'/api/v1/dashboard'` ao array `isExcluded`.

```typescript
    const isExcluded = [
      '/api/v1/auth',
      '/api/v1/plans',
      '/api/v1/users',
      '/api/v1/roles',
      '/api/v1/permissions',
      '/api/v1/db-credentials',
      '/api/v1/announcements',
      '/api/v1/dashboard', // <--- Adicionado para isentar chamadas do dashboard
      '/integration',
      '/status',
    ].some((excluded) => path.startsWith(excluded));
```

### 2. Serviço do Dashboard (DashboardService)
#### [MODIFY] [dashboard.service.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.service.ts)
Mesmo que novas requisições não sejam mais gravadas pelo interceptor, precisamos garantir que requisições antigas já registradas em banco (ou qualquer chamada direta) não influenciem as métricas. Faremos isso adicionando um filtro de exclusão em todas as queries.

- **getSummary**: Adicionar o filtro `path: { not: { startsWith: '/api/v1/dashboard' } }` em todas as consultas Prisma.
- **Queries raw SQL** (`getTopUsers`, `getTopEndpoints`, `getStatusDistribution`, `getTimeSeries`, `getProactiveAlerts`, `getTopIPs`, `getDatabaseLoad`, `getPlanDistribution`): Adicionar a cláusula `AND path NOT LIKE '/api/v1/dashboard%'` (ou `AND rl.path NOT LIKE '/api/v1/dashboard%'` para aliases).

---

## Plano de Verificação

### Testes Automatizados
Executar testes unitários do dashboard para garantir que continuam passando:
- `npm run test`

Atualizar os testes unitários em `dashboard.service.spec.ts` para validar o comportamento com o filtro.

### Verificação Manual
- Após a aplicação, subir o servidor em desenvolvimento (`npm run start:dev`).
- Realizar chamadas para a API do dashboard `/api/v1/dashboard/summary`.
- Verificar se as chamadas em si não são inseridas na tabela `request_logs`.
