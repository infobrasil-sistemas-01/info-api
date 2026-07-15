# Plano de Implementação: Registrar Requisições 429 Sem Contar na Cota

Modificar o tratamento de requisições de limite excedido (status 429 - Too Many Requests) para que sejam registradas normalmente na tabela `request_logs` (para fins de auditoria e métricas de erros), mas sejam desconsideradas nas contagens de cotas de uso do plano do usuário (franquias de minutos e meses).

---

## 1. Alterações Propostas

### 1.1 Módulo de Planos (`src/modules/plan`)

#### [MODIFY] [plan-limit.interceptor.ts](file:///c:/dev/infoapi/src/modules/plan/interceptors/plan-limit.interceptor.ts)
- Remover o filtro condicional que impedia o log de erros `TOO_MANY_REQUESTS` (429) no interceptor.
- Garantir que a requisição seja logada com o status HTTP correspondente (429) no callback de erro.

#### [MODIFY] [plan.service.ts](file:///c:/dev/infoapi/src/modules/plan/plan.service.ts)
- Alterar o método `getRequestCount` para excluir requisições com status `429` na contagem das cotas por minuto e por mês (`status: { not: 429 }`).

#### [MODIFY] [plan.service.spec.ts](file:///c:/dev/infoapi/src/modules/plan/plan.service.spec.ts)
- Adicionar testes de unidade para o método `getRequestCount` no `PlanService`, validando que requisições com status 429 não são contadas na cota.

---

### 1.2 Módulo de Dashboard (`src/modules/dashboard`)

#### [MODIFY] [dashboard.service.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.service.ts)
- Alterar o método `getDossierData` (caso do cliente) para excluir requisições com status `429` na query do Prisma que contabiliza `monthlyRequests`.
- Alterar o método `getTopUsers` (na query SQL bruta) para excluir logs com status `429` (`AND m.status <> 429`) na subquery que calcula as requisições mensais (`monthlyRequests`) de cada usuário.
- Alterar o método `getProactiveAlerts` (na query SQL bruta) para desconsiderar requisições com status `429` (`AND rl.status <> 429`) no cálculo do percentual de uso da franquia.

---

## 2. Plano de Verificação

### 2.1 Testes Automatizados
- Executar os testes unitários do serviço de planos:
  ```bash
  npm run test src/modules/plan/plan.service.spec.ts
  ```
- Executar todos os testes do projeto para garantir que nenhuma regressão foi introduzida:
  ```bash
  npm run test
  ```

### 2.2 Verificação Manual
1. Efetuar requisições até bater no limite do plano (retornando 429).
2. Verificar na tabela `request_logs` no banco de dados se as chamadas com status 429 foram corretamente persistidas.
3. Verificar na rota de estatísticas `/api/v1/plans/stats` ou na tela de Dashboard se a contagem do limite de requisições mensais do usuário NÃO foi incrementada pelas chamadas 429.
