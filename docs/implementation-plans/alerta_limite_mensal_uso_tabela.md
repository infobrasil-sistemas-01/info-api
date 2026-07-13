# Registro de Alertas de Uso em Tabela do Banco de Dados

Este plano descreve a substituição do controle de alertas do arquivo temporário `.tmp/usage-alerts.json` por uma tabela relacional no banco de dados chamada `usage_alert_logs`. A migration SQL correspondente será criada manualmente.

## User Review Required

> [!IMPORTANT]
> - **Migration SQL Manual**: Criaremos manualmente a pasta e o script SQL correspondente para a migration no PostgreSQL. Isso permite a aplicação direta das alterações no banco sem depender do auto-generation do Prisma CLI quando o banco estiver indisponível localmente para validação.
> - **Atualização dos Testes Unitários**: Removeremos o mock do módulo `fs` nos testes unitários e passaremos a mockar os métodos correspondentes da nova tabela `usageAlertLog` no Prisma client mockado.

## Open Questions

Não há dúvidas em aberto.

## Proposed Changes

---

### Banco de Dados (Database & Prisma)

#### [MODIFY] [schema.prisma](file:///c:/dev/infoapi/prisma/schema.prisma)
- Adicionar o modelo `UsageAlertLog` relacionado com a tabela `User`:
  ```prisma
  model User {
    // ... campos existentes
    usageAlertLogs UsageAlertLog[]
  }

  model UsageAlertLog {
    id        String   @id @default(uuid())
    userId    String   @map("user_id")
    alertType String   @map("alert_type")
    sentAt    DateTime @default(now()) @map("sent_at")
    user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@index([userId, sentAt])
    @@map("usage_alert_logs")
  }
  ```

#### [NEW] [migration.sql](file:///c:/dev/infoapi/prisma/migrations/20260713144737_create_usage_alert_logs/migration.sql)
- Criar a pasta da migration `20260713144737_create_usage_alert_logs` e escrever o script DDL em SQL puro para criar a tabela, seus índices e chaves estrangeiras.

---

### Módulo de Planos (Plan Module)

#### [MODIFY] [plan.service.ts](file:///c:/dev/infoapi/src/modules/plan/plan.service.ts)
- Remover as dependências do `fs` e `path`.
- Atualizar os métodos `hasSentUsageAlertThisMonth(userId)` e `markUsageAlertSent(userId)` para realizar consultas e inserções na tabela `usageAlertLog` usando o Prisma Client:
  - `hasSentUsageAlertThisMonth`: Busca registros de `UsageAlertLog` do usuário criados a partir do dia 1 do mês corrente.
  - `markUsageAlertSent`: Insere um novo registro com `alertType: "MONTHLY_80"`.

#### [MODIFY] [plan.service.spec.ts](file:///c:/dev/infoapi/src/modules/plan/plan.service.spec.ts)
- Remover o mock `jest.mock('fs')`.
- Atualizar o mock do Prisma para incluir a tabela `usageAlertLog` com métodos de `findFirst` e `create`.
- Ajustar os casos de teste para verificar se o e-mail de alerta é disparado com base nos registros retornados pelo banco.

## Verification Plan

### Automated Tests
- Executar os testes unitários do `PlanService` para validar a integração com as tabelas mockadas do Prisma:
  ```bash
  npm run test src/modules/plan/plan.service.spec.ts
  ```

### Manual Verification
- Rodar o build completo (`npm run build`) para assegurar que o Prisma client regenerado compila perfeitamente com o NestJS.
