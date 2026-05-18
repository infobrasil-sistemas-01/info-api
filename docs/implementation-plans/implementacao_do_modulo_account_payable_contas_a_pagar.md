# Implementação do Módulo Account Payable (Contas a Pagar)

Este plano descreve a criação do novo módulo `Account Payable`, que consultará a tabela `CONTASPAGAR` do banco de dados Firebird. O módulo contará com métodos para listagem geral e busca por ID.

## Proposed Changes

### 1. Novo Módulo: Account Payable

Criaremos a estrutura completa dentro de `src/modules/account-payable/`:

#### [NEW] [account-payable.module.ts](file:///c:/dev/infoapi/src/modules/account-payable/account-payable.module.ts)
Módulo NestJS que exportará os controllers e services e importará o `TenantConnectionModule`.

#### [NEW] [account-payable.controller.ts](file:///c:/dev/infoapi/src/modules/account-payable/account-payable.controller.ts)
Controller com dois endpoints:
- `GET /api/v1/account-payable`: Listagem paginada trazendo apenas os campos principais: `PAG_NUMERO`, `CRE_CODIGO`, `PAG_VALOR`, `PAG_SITUACAO`, `PAG_DATAVENC`.
- `GET /api/v1/account-payable/:id`: Busca por ID trazendo todos os campos da tabela conforme solicitado (PAG_NUMERO, LOJ_CODIGO, CEN_CODIGO, FPG_CODIGO, BAN_CONTA, PAG_DOCUMENTO, PAG_PORCONTA, PAG_VALOR, PAG_SITUACAO, PAG_HISTORICO, PAG_DATAMOV, PAG_DATAVENC, PAG_DATAPAG, PAG_VALORTESOURARIA, PAG_VALORBANCO, PAG_TOTAL).

O Swagger será configurado com os respectivos decorators e os endpoints estarão protegidos por `JwtAuthGuard` e `PermissionsGuard`.

#### [NEW] [account-payable.service.ts](file:///c:/dev/infoapi/src/modules/account-payable/account-payable.service.ts)
Serviço com os métodos `get()` (paginação e campos principais) e `getById()` (todos os campos filtrados por `PAG_NUMERO`), além do tratamento de `TenantConnectionService` e log de execução da query.

#### [NEW] [dto/account-payable-response.dto.ts](file:///c:/dev/infoapi/src/modules/account-payable/dto/account-payable-response.dto.ts)
DTOs de Resposta para Swagger (um para a listagem resumida e um para os detalhes completos).

#### [NEW] Testes Unitários
- `account-payable.controller.spec.ts`
- `account-payable.service.spec.ts`

---

### 2. Integração Backend

#### [MODIFY] [app.module.ts](file:///c:/dev/infoapi/src/app.module.ts)
Importar e registrar `AccountPayableModule`.

#### [MODIFY] RBAC Catalogs
Adicionar `tenant.account-payable.view`, `.create`, `.update`, e `.delete` nos arquivos:
- `src/infra/rbac/catalog/permissions.catalog.ts`
- `prisma/sync_permissions.sql`

---

### 3. Integração Frontend (Mapeamentos)

Para garantir que o módulo possa ter seu acesso solicitado pelo painel e visualizar na listagem de integrações, faremos os mapeamentos de "Contas a Pagar" nos seguintes arquivos:

#### [MODIFY] [client-core.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/client-core.js)
Mapear a chave `account-payable: 'Contas a Pagar'` no dicionário de `modules`.

#### [MODIFY] [admin-core.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/admin-core.js)
Mapear a chave `account-payable: 'Contas a Pagar'` na renderização do painel admin.

#### [MODIFY] [form.html](file:///c:/dev/infoapi/src/modules/integration-request/templates/form.html)
Adicionar `Contas a Pagar` como option no Select de escopos e configurar seu objeto de permissões com base (ex: `{ read: true, create: true, update: false, delete: false }`).

## Verification Plan

### Automated Tests
Rodar `npm run test` para validar a injeção do controller, os parâmetros do service e o comportamento do service no tratamento das conexões (mocking das queries de resumo e completo).
