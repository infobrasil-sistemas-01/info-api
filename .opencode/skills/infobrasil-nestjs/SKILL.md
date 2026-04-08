---
name: infobrasil-nestjs
description: Create a NestJS API for sales integration. 
license: MIT
compatibility: opencode
---

## Overview

NestJS TypeScript API for sales integration. Connects to PostgreSQL (registry) and Firebird (customer databases) with multi-tenant architecture.

## Project Structure

```
src/
├── main.ts                    # Entry point, API prefix, Swagger setup
├── app.module.ts              # Root module
├── config/
│   ├── auth.config.ts         # JWT configuration
│   └── env/
│       ├── env.module.ts      # Global EnvModule
│       ├── env.schema.ts      # Zod validation schema
│       └── env.service.ts     # Env service with helpers
├── common/
│   └── validation/
│       └── zod-dto.ts         # ZodDto base class
├── generated/prisma/           # Prisma generated client (DO NOT EDIT)
├── infra/
│   ├── database/
│   │   └── tenant-connection.service.ts  # Firebird connection manager
│   ├── firebird/
│   │   └── firebird.service.ts
│   └── prisma/
│       └── registry-prisma.service.ts   # PostgreSQL client
└── modules/
    ├── auth/                  # Login, JWT tokens
    ├── product/              # Products, brands, groups
    ├── order/                 # Order management
    ├── payment-method/       # Payment methods
    └── receipt/               # Fiscal receipt generation
```

## Key Commands

```bash
npm run build        # Compile to dist/
npm run start:dev    # Hot reload dev server
npm run start:prod   # Production (requires dist/)
npm run lint         # ESLint
npm run format       # Prettier
npm run test         # Unit tests (*.spec.ts)
npm run test:e2e     # E2E tests (test/*.e2e-spec.ts)
npx prisma migrate dev   # Dev migrations
npx prisma migrate deploy # Prod migrations
```

## Critical Patterns

### Prisma Client Location

**Generated client is at `src/generated/prisma/client.ts`**, NOT `node_modules/@prisma/client`.

```typescript
import { PrismaClient } from 'src/generated/prisma/client';
```

### API Prefix

All routes prefixed with `/api/v1` (set in `main.ts`).

### Environment Validation

`EnvService` validates env vars at startup using Zod schema. **Invalid env = `process.exit(1)` immediately**.

### Firebird Connection Pattern

```typescript
const connection = await this.tenantConnectionService.getConnection(credentialsId);

// Query
connection.query(query, params, (err, res) => { ... });

// Transaction
connection.startTransaction((err, transaction) => {
  transaction.query(query, params, (err) => {
    if (err) { transaction.rollback(); return reject(err); }
    transaction.commit((err) => {
      if (err) { transaction.rollback(); return reject(err); }
      resolve(true);
    });
  });
});
```

### Auth Context (from JWT)

```typescript
export type AuthContext = {
  userId: string;
  credentialsId: string;
  storeId: number;
};
// Available via @CurrentUser() decorator or req.authContext
```

### DTO Validation with Zod

```typescript
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string(),
  price: z.number(),
});

export class CreateProductDto extends ZodDto(CreateProductSchema) {
  @ApiProperty()
  name: string;
}
```

## Business Rules

### Fiscal Receipt Generation

For fiscal financial generation, table `CONFIG_PERFIL_LOJAS` must have:

- `PFL_CODIGO = 104`
- `CPL_PERFIL = 'S'`

### Encrypted Firebird Passwords

Firebird passwords stored encrypted in env vars by `dbId`:

- `P98` → dbId 98
- `P99` → dbId 99
- `P131` → dbId 131
- `P104` → dbId 104

Use `ids(dbId)` utility from `src/utils/ids.util.ts`.

## Module Conventions

Each module follows:

```
module/
├── *.controller.ts    # HTTP endpoints
├── *.service.ts       # Business logic
├── *.module.ts        # Module definition
├── dto/               # Data transfer objects
└── submodules/        # Optional nested modules
```

## Testing

```typescript
describe('ServiceName', () => {
  let service: ServiceName;
  let mockDependency: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceName,
        { provide: DependencyToken, useValue: mockDependency },
      ],
    }).compile();
    service = module.get<ServiceName>(ServiceName);
  });

  it('should do something', async () => {
    mockDependency.method.mockResolvedValue(mockData);
    expect(await service.method()).toEqual(expected);
  });
});
```

## Docker Production

- Entrypoint runs `prisma migrate deploy` before starting
- Start command: `node dist/src/main.js`
- Test credentials: `infomobile:yd9FvSJ69bz6zvRq7GM&TJ5RD6*DsQPf`
