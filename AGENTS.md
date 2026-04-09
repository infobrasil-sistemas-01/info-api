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

## Testing Patterns

### Test File Naming

- Unit tests: `*.spec.ts` in same directory as source
- E2E tests: `test/*.e2e-spec.ts`

### Test Structure

**Service tests** (`*.service.spec.ts`):

```typescript
describe('ServiceName', () => {
  let service: ServiceName;
  let mockDependency: any;

  beforeEach(async () => {
    mockDependency = {
      /* mock methods */
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceName,
        { provide: Dependency, useValue: mockDependency },
      ],
    }).compile();
    service = module.get<ServiceName>(ServiceName);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('methodName', () => {
    it('should return expected result', async () => {
      mockDependency.method.mockResolvedValue(expectedValue);
      const result = await service.methodName();
      expect(result).toEqual(expectedValue);
    });

    it('should throw error on failure', async () => {
      mockDependency.method.mockRejectedValue(new Error());
      await expect(service.methodName()).rejects.toThrow();
    });
  });
});
```

**Controller tests** (`*.controller.spec.ts`):

```typescript
describe('ControllerName', () => {
  let controller: ControllerName;
  let mockService: jest.Mocked<Service>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ControllerName],
      providers: [{ provide: Service, useValue: mockService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get<ControllerName>(ControllerName);
  });
});
```

**DTO/Schema validation tests** (`*.dto.spec.ts`):

```typescript
describe('DtoName', () => {
  const validData = {
    /* valid fields */
  };

  test.each([
    ['description', validData],
    ['another case', { ...validData, optional: 'value' }],
  ])('should accept %s', (_, input) => {
    expect(() => Schema.parse(input)).not.toThrow();
  });

  test.each([
    [
      'missing required',
      {
        /* missing field */
      },
    ],
  ])('should reject %s', (_, input) => {
    expect(() => Schema.parse(input)).toThrow();
  });
});
```

### Key Patterns

- Use `jest.mock()` for external modules (e.g., `argon2`, `bcrypt`)
- Use `mockResolvedValue`/`mockRejectedValue` for async methods
- Use `describe('FAILING: ...')` for edge case tests that document known issues
- Mock database connections with callback-based `query.mockImplementation((query, params, callback) => { callback(null, result); })`
- Use `test.each` with template literals for data-driven tests
- Clean up mocks in `afterEach` with `jest.clearAllMocks()`
