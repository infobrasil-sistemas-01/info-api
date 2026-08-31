# Módulo de Compras / Entradas de Mercadorias (GET All)

## Contexto e Objetivo
Implementação do novo módulo e endpoint `GET /api/v1/purchase` para consulta e listagem de entradas de notas fiscais/compras de mercadorias da tabela `COMPRAS` do banco Firebird.

O endpoint atenderá a necessidade de consultar o histórico de entradas com filtros de loja, fornecedor, intervalo de datas e paginação, trazendo os dados da nota, chave da NF-e e identificação do fornecedor (`CREDORES`).

---

## Requisitos do Endpoint

### Dados Retornados por Entrada:
1. **Número da entrada**: `COM_NUMERO`
2. **Data da entrada**: `COM_DATA`
3. **Loja/empresa da entrada**: `LOJ_CODIGO`
4. **Identificação do fornecedor**:
   - `CRE_CODIGO` (Código do Fornecedor)
   - `CRE_NOME` (Razão Social)
   - `CRE_FANTASIA` (Nome Fantasia)
   - `CRE_CNPJ` (CNPJ/CPF)
5. **Número da nota fiscal**: `COM_NUMERONF`
6. **Data de emissão da nota**: `COM_DATAEMISSAONF`
7. **Chave de acesso da NF-e**: `COM_CHAVE`
8. **Valor total da nota / compra**: `COM_VRTOTALNF` e `COM_TOTAL`

### Filtros Aceitos (`PurchaseQueryDto`):
- `page` (number, default: 1)
- `pageSize` (number, default: 10)
- `storeId` (number, opcional)
- `supplierId` (number, opcional)
- `startDate` (string YYYY-MM-DD, opcional)
- `endDate` (string YYYY-MM-DD, opcional)
- `invoiceNumber` (string, opcional)
- `nfeKey` (string, opcional)

---

## User Review Required

> [!NOTE]
> **Permissão RBAC:** Será criada a permissão `tenant.purchases.view` vinculada ao módulo `tenant`.
> **Rota Principal:** `GET /api/v1/purchase`

---

## Proposed Changes

### 1. Novo Módulo `Purchase` (`src/modules/purchase/`)

#### [NEW] [purchase.module.ts](file:///c:/dev/info-api/src/modules/purchase/purchase.module.ts)
- Declaração do `PurchaseModule` com `PurchaseController` e `PurchaseService`, importando `TenantConnectionModule`.

#### [NEW] [purchase.controller.ts](file:///c:/dev/info-api/src/modules/purchase/purchase.controller.ts)
- Controller protegido com `JwtAuthGuard` e `PermissionsGuard` (`@RequirePermissions({ allOf: ['tenant.purchases.view'] })`).
- Documentação Swagger `@ApiTags('Purchase')`, `@ApiOperation`, `@ApiResponse`.

#### [NEW] [purchase.service.ts](file:///c:/dev/info-api/src/modules/purchase/purchase.service.ts)
- Método `get(credentialsId, query)` com query SQL otimizada (`SELECT FIRST ? SKIP ? ... FROM compras COM LEFT JOIN credores CR ON COM.CRE_CODIGO = CR.CRE_CODIGO WHERE 1=1`), paginação e filtros dinâmicos.
- Liberação segura de conexão via `TenantConnectionService`.

#### [NEW] [purchase-query.dto.ts](file:///c:/dev/info-api/src/modules/purchase/dto/purchase-query.dto.ts)
- Schema Zod com coerção de números e validação de parâmetros opcionais.

#### [NEW] [purchase-response.dto.ts](file:///c:/dev/info-api/src/modules/purchase/dto/purchase-response.dto.ts)
- DTO Swagger para tipagem do retorno.

### 2. Integração e Permissões

#### [MODIFY] [permissions.catalog.ts](file:///c:/dev/info-api/src/infra/rbac/catalog/permissions.catalog.ts)
- Adicionar permissões do módulo:
  - `tenant.purchases.view`
  - `tenant.purchases.create`
  - `tenant.purchases.update`
  - `tenant.purchases.delete`

#### [MODIFY] [sync_permissions.sql](file:///c:/dev/info-api/prisma/sync_permissions.sql)
- Incluir `tenant.purchases.view`, `tenant.purchases.create`, `tenant.purchases.update`, `tenant.purchases.delete` no script de sincronização com o banco.

#### [MODIFY] [app.module.ts](file:///c:/dev/info-api/src/app.module.ts)
- Registrar `PurchaseModule` nos `imports` do `AppModule`.

#### [MODIFY] [client-core.js](file:///c:/dev/info-api/src/modules/integration-request/templates/assets/client-core.js) e [admin-core.js](file:///c:/dev/info-api/src/modules/integration-request/templates/assets/admin-core.js)
- Adicionar tradução de `'purchases': 'Compras / Entradas'`.

### 3. Testes Automatizados

#### [NEW] [purchase.controller.spec.ts](file:///c:/dev/info-api/src/modules/purchase/purchase.controller.spec.ts)
- Testes unitários do controller (chamada ao serviço com credenciais e query).

#### [NEW] [purchase.service.spec.ts](file:///c:/dev/info-api/src/modules/purchase/purchase.service.spec.ts)
- Testes unitários do service (filtros, paginação, montagem de query, fallback de credenciais).

#### [NEW] [purchase-query.dto.spec.ts](file:///c:/dev/info-api/src/modules/purchase/dto/purchase-query.dto.spec.ts)
- Testes unitários do schema Zod com `test.each`.

---

## Verification Plan

### Automated Tests
- Executar testes unitários do módulo criado:
  ```bash
  npm test -- purchase
  ```
- Executar suíte completa de testes:
  ```bash
  npm test
  ```
- Validar build TypeScript:
  ```bash
  npm run build
  ```

### Manual Verification
- Validar Swagger spec gerado com os novos endpoints e schemas.
