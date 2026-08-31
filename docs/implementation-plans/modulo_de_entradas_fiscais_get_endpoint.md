# Plano de Implementação - Módulo de Entradas Fiscais (`ENTRADAS_APOIO`)

Implementação enxuta do módulo de consulta de Entradas Fiscais de Apoio (`ENTRADAS_APOIO`) integrado ao banco Firebird do tenant, seguindo **exatamente o mesmo padrão e quantidade de campos de `COMPRAS`**.

---

## 1. Visão Geral e Arquitetura

O módulo fornecerá o endpoint `GET /api/v1/fiscal-entry` protegido por JWT e RBAC (`tenant.fiscal-entries.view`).

### Campos Retornados (1:1 equivalente a `COMPRAS`):
```sql
SELECT FIRST ? SKIP ?
  ETA.ETA_NUMERO,
  ETA.ETA_DATA,
  ETA.ETA_HORA,
  ETA.LOJ_CODIGO,
  ETA.CRE_CODIGO,
  CR.CRE_NOME,
  CR.CRE_FANTASIA,
  CR.CRE_CNPJ,
  ETA.ETA_NUMERONF,
  ETA.ETA_SERIE,
  ETA.ETA_DATAEMISSAONF,
  ETA.ETA_CHAVE,
  CAST(ETA.ETA_VRTOTALNF AS NUMERIC(15,2)) as ETA_VRTOTALNF,
  CAST(ETA.ETA_TOTAL AS NUMERIC(15,2)) as ETA_TOTAL,
  CAST(ETA.ETA_QUANTIDADE AS NUMERIC(15,2)) as ETA_QUANTIDADE,
  ETA.SIT_CODIGO
FROM ENTRADAS_APOIO ETA
LEFT JOIN CREDORES CR ON ETA.CRE_CODIGO = CR.CRE_CODIGO
WHERE 1=1
```

---

## 2. Mudanças Propostas

### Backend (`src/modules/fiscal-entry/`)

#### [NEW] `fiscal-entry-query.dto.ts`
Filtros idênticos aos de Compras:
- `page`, `pageSize`, `storeId`, `supplierId`, `startDate`, `endDate`, `invoiceNumber`, `nfeKey`.

#### [NEW] `fiscal-entry-response.dto.ts`
Os 16 campos equivalentes aos de Compras (`ETA_NUMERO`, `ETA_DATA`, `ETA_HORA`, `LOJ_CODIGO`, `CRE_CODIGO`, `CRE_NOME`, `CRE_FANTASIA`, `CRE_CNPJ`, `ETA_NUMERONF`, `ETA_SERIE`, `ETA_DATAEMISSAONF`, `ETA_CHAVE`, `ETA_VRTOTALNF`, `ETA_TOTAL`, `ETA_QUANTIDADE`, `SIT_CODIGO`).

#### [NEW] `fiscal-entry.service.ts`
- Query direta parametrizada no Firebird com `try/finally` para liberar a conexão.

#### [NEW] `fiscal-entry.controller.ts`
- `@Controller('fiscal-entry')`
- `@RequirePermissions({ allOf: ['tenant.fiscal-entries.view'] })`

#### [NEW] `fiscal-entry.module.ts`
- Módulo NestJS exportando serviço e controller.

#### [MODIFY] `src/app.module.ts`
- Importar e registrar `FiscalEntryModule`.

---

### RBAC e Telas

#### [MODIFY] `src/infra/rbac/catalog/permissions.catalog.ts`
- Adicionar `tenant.fiscal-entries.view`, `create`, `update`, `delete`.

#### [MODIFY] `prisma/sync_permissions.sql`
- Adicionar `tenant.fiscal-entries.*`.

#### [MODIFY] `src/modules/integration-request/templates/assets/admin-core.js` & `src/modules/integration-request/templates/assets/client-core.js`
- Tradução: `'fiscal-entries': 'Entradas Fiscais'`.

#### [MODIFY] `src/modules/integration-request/templates/form.html`
- Adicionar opção `'Entradas Fiscais'` no formulário.

---

### Testes

#### [NEW] `fiscal-entry.controller.spec.ts`
#### [NEW] `fiscal-entry.service.spec.ts`
#### [NEW] `fiscal-entry-query.dto.spec.ts`
