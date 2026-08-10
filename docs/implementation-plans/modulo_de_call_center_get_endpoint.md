# Implementação do Módulo Call Center (GET /call-centers)

Este plano descreve a criação e modelagem do novo módulo `Call Center` no NestJS, realizando a consulta na tabela `CALLCENTER` do banco de dados Firebird com `LEFT JOIN` nas tabelas auxiliares `APLICACOES`, `TOPICOS` e `FORMASATENDIMENTOS` para retornar as descrições correspondentes.

## Proposed Changes

### 1. Módulo Call Center (`src/modules/call-center/`)

Criaremos a estrutura completa dentro de `src/modules/call-center/`:

#### [NEW] [call-center.module.ts](file:///c:/dev/info-api/src/modules/call-center/call-center.module.ts)
- Módulo NestJS registrando `CallCenterController` e `CallCenterService`, e importando `TenantConnectionModule`.

#### [NEW] [call-center.controller.ts](file:///c:/dev/info-api/src/modules/call-center/call-center.controller.ts)
Controller no caminho `@Controller('call-centers')` com dois endpoints:
- `GET /api/v1/call-centers`: Listagem paginada trazendo os dados do Call Center com descrições das tabelas auxiliares (`APL_DESCRICAO`, `TOP_DESCRICAO`, `FAT_DESCRICAO`).
- `GET /api/v1/call-centers/id/:id`: Detalhes de um registro específico de Call Center filtrado por `CAL_NUMERO`.
- Protegidos por `JwtAuthGuard` e `PermissionsGuard` (`tenant.call-centers.view`).

#### [NEW] [call-center.service.ts](file:///c:/dev/info-api/src/modules/call-center/call-center.service.ts)
- Serviço para execução das queries SQL Firebird via `TenantConnectionService`.
- Execução de `LEFT JOIN` entre `CALLCENTER CC`, `APLICACOES A ON CC.APL_CODIGO = A.APL_CODIGO`, `TOPICOS T ON CC.TOP_CODIGO = T.TOP_CODIGO` e `FORMASATENDIMENTOS F ON CC.FAT_CODIGO = F.FAT_CODIGO`.
- Trativa assíncrona/conversão de campos `BLOB SUB_TYPE 1` (`CAL_DEPOIMENTO`, `CAL_RELATORIO`, `CAL_OUTRASINFO`) retornados pelo driver `node-firebird`.

#### [NEW] DTOs de Filtro e Resposta (`src/modules/call-center/dto/`)
- `call-center-query.dto.ts`: Validação de filtros (`page`, `pageSize`, `clientId`, `userId`, `status`, `storeId`, `sellerId`, `startDate`, `endDate`) com Zod e `@nestjs/swagger`.
- `call-center-response.dto.ts`: Schemas de documentação OpenAPI para respostas do GET list e GET por ID.

#### [NEW] Testes Unitários
- `call-center.controller.spec.ts`
- `call-center.service.spec.ts`

---

### 2. Integração Backend & RBAC

#### [MODIFY] [app.module.ts](file:///c:/dev/info-api/src/app.module.ts)
- Importar e registrar `CallCenterModule` no `AppModule`.

#### [MODIFY] [permissions.catalog.ts](file:///c:/dev/info-api/src/infra/rbac/catalog/permissions.catalog.ts)
- Adicionar permissões do módulo Call Center ao catálogo (`tenant.call-centers.view`, `tenant.call-centers.create`, `tenant.call-centers.update`, `tenant.call-centers.delete`).

#### [MODIFY] [sync_permissions.sql](file:///c:/dev/info-api/prisma/sync_permissions.sql)
- Adicionar permissões no script SQL de permissões iniciais do sistema.

---

### 3. Integração Frontend / Solicitações de Integração

#### [MODIFY] [client-core.js](file:///c:/dev/info-api/src/modules/integration-request/templates/assets/client-core.js)
- Mapear `'call-centers': 'Call Center'` no dicionário de traduções de módulos.

#### [MODIFY] [admin-core.js](file:///c:/dev/info-api/src/modules/integration-request/templates/assets/admin-core.js)
- Mapear `'call-centers': 'Call Center'` para a interface administrativa.

#### [MODIFY] [form.html](file:///c:/dev/info-api/src/modules/integration-request/templates/form.html)
- Adicionar a opção `Call Center` no menu de seleção de escopos/módulos para solicitação de acesso.

## Verification Plan

### Automated Tests
- Executar `npm run test` especificando os arquivos `call-center.service.spec.ts` e `call-center.controller.spec.ts`.
- Validar tratamento de DTOs, permissões e mock de resposta com campos BLOB e JOINs.

### Manual Verification
- Validar compilação com `npm run build`.
