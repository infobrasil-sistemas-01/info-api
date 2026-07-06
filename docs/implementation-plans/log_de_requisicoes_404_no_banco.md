# Plano de Implementação: Flag 'Success' no Log de Requisições e Captura de 404s

Este plano detalha as alterações necessárias para adicionar uma flag `success` (booleana) à tabela `request_logs`, de forma a contabilizar nos limites de uso apenas as requisições bem-sucedidas (status < 400). Além disso, implementa a gravação de logs de rota não encontrada (404/Cannot GET) no banco de dados.

---

## 1. Alterações Propostas

### 1.1 Banco de Dados (Prisma & Postgres)

#### [MODIFY] [schema.prisma](file:///c:/dev/infoapi/prisma/schema.prisma)
- Adicionar a propriedade `success Boolean @default(true)` no model `RequestLog`.

#### [NEW] [migration.sql](file:///c:/dev/infoapi/prisma/migrations/20260706203500_add_success_to_request_logs/migration.sql)
- Criar a pasta de migração manualmente com a seguinte instrução SQL:
  ```sql
  -- AlterTable
  ALTER TABLE "request_logs" ADD COLUMN "success" BOOLEAN NOT NULL DEFAULT true;
  ```

---

### 1.2 Backend (NestJS)

#### [MODIFY] [plan.service.ts](file:///c:/dev/infoapi/src/modules/plan/plan.service.ts)
- **logRequest**:
  - Aceitar parâmetro opcional `success`. Se não fornecido, calcular automaticamente como `status < 400`.
  - Gravar o valor de `success` na criação do log.
- **getRequestCount**:
  - Modificar a query de contagem de limite para filtrar apenas por `{ success: true }`. Assim, falhas (404, 401, 429, etc.) não contam para o limite do plano.

#### [MODIFY] [plan-limit.interceptor.ts](file:///c:/dev/infoapi/src/modules/plan/interceptors/plan-limit.interceptor.ts)
- Adicionar a propriedade `request.logged = true` tanto no callback de sucesso (`next`) quanto no de erro (`error`) do interceptor.

#### [MODIFY] [all-exceptions.filter.ts](file:///c:/dev/infoapi/src/common/filters/all-exceptions.filter.ts)
- Injetar o `PlanService` no construtor.
- Extrair o token JWT do header `Authorization` de forma manual/safe caso `request.user` não esteja definido (comum em rotas inexistentes/404).
- Se a requisição não foi logada (`!request.logged`), o usuário for identificado e a rota não for isenta (Excluded), gravar a chamada no banco usando o `PlanService.logRequest`, determinando `success: false`.

---

## 2. Plano de Verificação

### 2.1 Testes Automatizados
- Atualizar os testes unitários do `PlanService` em `plan.service.spec.ts` para mockar a flag `success`.
- Atualizar os testes unitários do `AllExceptionsFilter` em `all-exceptions.filter.spec.ts` e `PlanLimitInterceptor` em `plan-limit.interceptor.spec.ts` para suportar as novas injeções/propriedades.
- Executar todos os testes (`npm.cmd run test`).

### 2.2 Verificação Manual
1. Efetuar requisição válida (ex: `GET /api/v1/orders`). Confirmar no banco que o log é gerado com `success = true`.
2. Efetuar requisição para rota inexistente (ex: `GET /api/v1/entregas/5`). Confirmar no banco que o log é gerado com `success = false` e com o usuário correto.
3. Testar se a requisição de erro aparece no painel de Logs do Administrador, mas sem aumentar o contador de limite mensal do plano.
