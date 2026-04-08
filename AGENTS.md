# AGENTS.md - Info Vendas API

## Project Overview

NestJS TypeScript API for sales integration. Uses Prisma ORM with PostgreSQL and Firebird support.

## Key Commands

```bash
npm run build        # Compile with NestJS
npm run start:dev    # Dev server with hot reload
npm run start:prod   # Production (requires dist/)
npm run lint         # ESLint
npm run format       # Prettier
npm run test         # Unit tests (src/**/*spec.ts)
npm run test:e2e     # E2E tests (test/*.e2e-spec.ts)
npx prisma migrate dev   # Run migrations (dev)
npx prisma migrate deploy # Apply migrations (prod)
```

## Important Patterns

### Prisma Client Location

Generated client is at `src/generated/prisma/client.ts`, NOT `node_modules/@prisma/client`. Import from `src/generated/prisma/client` or re-export from a module.

### API Prefix

All routes prefixed with `api/v1` (set in `src/main.ts`).

### Environment Validation

`EnvService` validates env vars at startup using Zod schema (`src/config/env/env.schema.ts`). Invalid env = `process.exit(1)` immediately.

### Docker Production

- Entrypoint runs `prisma migrate deploy` before starting
- Start command: `node dist/src/main.js` (not `dist/main.js`)

## Architecture

- `src/modules/` - Feature modules (auth, product, order, payment-method, receipt)
- `src/infra/` - Infrastructure (prisma, firebird, database)
- `src/config/` - Configuration (env, auth)
- `src/generated/prisma/` - Prisma-generated code (do not edit manually)

## Business Rule

For fiscal financial generation, table `CONFIG_PERFIL_LOJAS` must have `PFL_CODIGO = 104` with `CPL_PERFIL = 'S'` in the customer's database.
