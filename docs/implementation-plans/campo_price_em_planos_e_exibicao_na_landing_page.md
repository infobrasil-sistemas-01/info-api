# Planejamento: Campo de Preço (`price`) em Planos & Exibição na Landing Page

Este plano descreve a adição da coluna opcional/nula `price` no modelo `Plan` do Prisma ORM e a atualização da Landing Page e Dashboard para exibir o valor formatado quando preenchido ou a indicação **"Sob Consulta"** quando for `null` (comportamento padrão).

## Proposed Changes

### 1. Banco de Dados & Prisma ORM

#### [MODIFY] [schema.prisma](file:///c:/dev/info-api/prisma/schema.prisma)
- Adicionar o campo `price Decimal? @db.Decimal(10, 2)` na model `Plan`.
- Executar a migration do Prisma (`npx prisma migrate dev --name add_price_to_plans`) para atualizar a tabela `plans` no PostgreSQL e regerar o Prisma Client em `src/generated/prisma`.

#### [MODIFY] [seed_plans.ts](file:///c:/dev/info-api/prisma/seed_plans.ts)
- Atualizar o script de seed de planos para suportar a propriedade `price` (ex: `Free: 0`, `Profissional: null`, `Enterprise: null`).

---

### 2. Backend DTO & API

#### [MODIFY] [plan-response.dto.ts](file:///c:/dev/info-api/src/modules/plan/dto/plan-response.dto.ts)
- Adicionar o campo `price` no `PlanResponseDto` com anotação `@ApiPropertyOptional({ description: 'Preço mensal do plano em R$', example: 199.90, nullable: true })`.

---

### 3. Frontend & Landing Page

#### [MODIFY] [landing.html](file:///c:/dev/info-api/src/modules/integration-request/templates/landing.html)
- Atualizar a função `loadPlans()`:
  - Verificar se `p.price !== null && p.price !== undefined`.
  - Se possuir valor: formatar como moeda brasileira (ex: `R$ 199,90<span>/mês</span>` ou `R$ 0<span>/mês</span>`).
  - Se for `null`: exibir **"Sob Consulta"**.

#### [MODIFY] [client-core.js](file:///c:/dev/info-api/src/modules/integration-request/templates/assets/client-core.js)
- Atualizar a renderização dos cards de upgrade de plano no modal do cliente para utilizar `p.price` quando presente ou retornar **"Sob Consulta"** quando nulo.

---

## Verification Plan

### Automated Tests
- Executar `npm run test` para garantir que a inclusão do novo atributo nos DTOs e serviços de plano não quebre os testes unitários existentes.
- Executar `npm run build` para validar a compilação do TypeScript com os tipos atualizados do Prisma.

### Manual Verification
- Acessar a rota da Landing Page (`GET /integration`) e verificar se planos sem `price` (`null`) exibem "Sob Consulta" e planos com `price` numérico exibem o valor formatado em `R$ X,XX/mês`.
