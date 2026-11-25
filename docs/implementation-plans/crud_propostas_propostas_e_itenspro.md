# Plano de Implementação: CRUD de Propostas (`PROPOSTAS` e `ITENSPRO`)

## Goal Description

Implementar o módulo completo de **Propostas Comerciais** (`src/modules/proposal/`) integrado ao banco Firebird do tenant, contemplando operações de leitura, criação e atualização (**CRUD sem `DELETE`**) para as tabelas `PROPOSTAS` (cabeçalho) e `ITENSPRO` (itens), seguindo **estritamente a nomenclatura original das colunas do banco de dados** nos contratos de entrada (criação/atualização) e saída (respostas).

O módulo seguirá os mesmos padrões arquiteturais de `ProductionOrderModule`, `OrderModule` e `ClientModule`:
- Validação de entrada com `ZodDto` (`src/common/validation/zod-dto`).
- Paginação com `FIRST ? SKIP ?`, `PaginatedResponse` e suporte a `X-Request-Count: true` (`@IncludeCount()`).
- Autenticação JWT (`JwtAuthGuard`), controle de acesso RBAC (`PermissionsGuard` / `@RequirePermissions`) e isolamento por loja/operador para tokens `H2M`.
- Inserção e atualização atômica via transação Firebird (`startTransaction` / `commit` / `rollback`).

---

## User Review Required

> [!IMPORTANT]
> **Nomenclatura Estrita do Banco (Firebird):**
> Todos os campos dos payloads de `POST /proposals`, `PATCH /proposals/:id` e dos DTOs de resposta utilizarão exatamente os nomes das colunas do DDL fornecido (`PRO_NUMERO`, `FUN_CODIGO`, `SIT_CODIGO`, `LOJ_CODIGO`, `CLI_CODIGO`, `ITENS`, `IPR_NUMERO`, `PRO_CODIGO`, `IPR_QTDE`, `IPR_PRECO`, etc.), garantindo mapeamento 1:1 sem tradução de nomes de colunas.

---

## Open Questions

> [!WARNING]
> **Pontos para confirmar antes da execução:**
> 1. **Generators no Firebird:** Seguindo o padrão dos demais módulos (`GEN_NUMEROVEN`, `GEN_NUMEROIVD`, `GEN_NUMEROORP`, `GEN_NUMEROOPI`), estamos assumindo `GEN_NUMEROPRO` para `PROPOSTAS.PRO_NUMERO` e `GEN_NUMEROIPR` para `ITENSPRO.IPR_NUMERO`. Caso os nomes no banco sejam diferentes (ou usem `MAX(...) + 1` / trigger), informe os nomes exatos.
> 2. **Cálculo de Preços e Totais:** No `POST /proposals` (e `PATCH` com `ITENS`), deseja que `IPR_PRECO` e os totais (`IPR_TOTAL`, `IPR_LIQUIDO`, `PRO_TOTALBRUTO`, `PRO_TOTALLIQUIDO`, `PRO_QUANT`) sejam **calculados/validados automaticamente** no servidor a partir da tabela `ESTOQUE` quando omitidos, ou aceitos livremente quando enviados no payload? (Proposta padrão: aceitar os valores enviados e calcular automaticamente os campos de totalização omitidos).
> 3. **Bloqueio de edição para Proposta Gerada (`PRO_GERADA = 'S'`):** No `PATCH /proposals/:id`, devemos impedir alteração quando `PRO_GERADA = 'S'` (proposta já faturada/convertida em venda com `VEN_NUMERO`)?
> 4. **Atualização de Itens no `PATCH /proposals/:id`:** Se `ITENS` for enviado no `PATCH`, a substituição atômica (`DELETE FROM ITENSPRO WHERE PRO_NUMERO = ?` + reinserção dos itens) atende ao fluxo esperado?

---

## Proposed Changes

### Infraestrutura — RBAC, Swagger e AppModule

#### [MODIFY] `src/infra/rbac/catalog/permissions.catalog.ts`
Adicionar as permissões do domínio `proposals`:
- `tenant.proposals.view` — Visualizar propostas do tenant
- `tenant.proposals.create` — Criar propostas do tenant
- `tenant.proposals.update` — Atualizar propostas do tenant

#### [MODIFY] `prisma/seed_admin_permissions.sql`
Incluir `tenant.proposals.view`, `tenant.proposals.create` e `tenant.proposals.update` no seed de permissões administrativas.

#### [MODIFY] `src/config/swagger.ts`
Registrar a tag `'Proposals'` na seção de Vendas do `DocumentBuilder`.

#### [MODIFY] `src/app.module.ts`
Importar e registrar `ProposalModule`.

---

### Módulo Proposal (`src/modules/proposal/`)

#### [NEW] `src/modules/proposal/dto/proposal-query.dto.ts`
Query DTO com Zod para `GET /proposals` e `GET /proposals/:id`:
- `page` (default `1`), `pageSize` (default `10`), `storeId` (`LOJ_CODIGO`), `statusId` (`SIT_CODIGO`), `clientId` (`CLI_CODIGO`), `sellerId` (`FUN_CODIGO`), `proposalNumber` (`PRO_NUMERO`), `proGerada` (`S` | `N`), `proStatus`, `startDate` (`YYYY-MM-DD`), `endDate` (`YYYY-MM-DD`).

#### [NEW] `src/modules/proposal/dto/proposal-response.dto.ts`
DTOs de resposta tipados para Swagger:
- `ProposalItemResponseDto`: todas as colunas de `ITENSPRO` + `PRO_DESCRICAO`, `PRO_UNIDADE`, `PRO_CODIGOBAR` (via `LEFT JOIN PRODUTOS`).
- `ProposalResponseDto`: todas as colunas de `PROPOSTAS` + `SIT_DESCRICAO`, `LOJ_NOME`, `LOJ_FANTASIA`, `CLI_NOME`, `FUN_NOME`, `USU_APELIDO`.
- `ProposalDetailResponseDto`: estende `ProposalResponseDto` adicionando `ITENS: ProposalItemResponseDto[]`.

#### [NEW] `src/modules/proposal/dto/create-proposal.dto.ts`
Schemas Zod e classes `ZodDto`:
- `CreateProposalItemSchema` / `CreateProposalItemDto`: campos de `ITENSPRO` (`PRO_CODIGO`, `IPR_QTDE`, `IPR_PRECO`, `IPR_TOTAL` opcional/calculado, `IPR_DESCONTO`, `IPR_LIQUIDO`, `IPR_PERCDESCONTO`, `PES_CODIGO`, `TEC_CODIGO`, `IPR_QTDEENT`, `IPR_INFADICIONAIS`, `LOJ_CODIGO`, `IPR_NEGATIVO`, `AMB_CODIGO`, `IPR_PRCVENDADIA`, `TAM_CODIGO`, `COR_CODIGO`, `PRG_CODIGO`, `IPR_ALTURA`, `IPR_LARGURA`, `IPR_QTDEUNT`, `PRK_CODIGO`, `IPR_TABELAPRECO`, `IPR_METRAGEMSUGERIDA`, `IPR_QTDEMETRAGEMSUGERIDA`, `TRM_CODIGO`, `IPR_ITEM`, `IPR_GARANTEESTOQUE`, `IPR_PRCCUSTO`, `IPR_PRCCOMPRA`, `IPR_MARGEMLUCROCOMPRA`, `IPR_MARGEMLUCROCUSTO`, `IPR_ACRESCIMO`, `IPR_PERCACRESC`).
- `CreateProposalSchema` / `CreateProposalDto`: campos de `PROPOSTAS` (`FUN_CODIGO`, `SIT_CODIGO`, `LOJ_CODIGO`, `CLI_CODIGO`, `USU_CODIGO`, `FPG_CODIGO`, `PRO_ATENCIOSAMENTE`, `PRO_PRAZO`, `PRO_VALIDADE`, `PRO_DATA`, `PRO_HORA`, `PRO_DATABAIXA`, `PRO_TOTALBRUTO`, `PRO_TOTALDESC`, `PRO_PERCDESC`, `PRO_TOTALLIQUIDO`, `PRO_OBS`, `PRO_QUANT`, `PRO_CONDICAOPAG`, `PRO_GERADA`, `PRO_FANTCLI`, `VEN_NUMERO`, `PRE_CODIGO`, `PRO_PRECO`, `PRO_PEDCLIENTE`, `TRA_CODIGO`, `PRO_MOTIVO`, `PRO_STATUS`, `PRO_TOTALPP1..3`, `PP1..3_CODIGO`, `FP1..3_CODIGO`, `PRO_NUMORG`, `PRO_DATABASE1..3`, `PRO_HORABAIXA`, `PRO_PERCDESC1..3`, `PRO_TOTALDESC1..3`, `PRO_TOTALPPA1..3`, `PRO_INFADICIONAIS`, `PRO_PERCACRESC`, `PRO_TOTALACRESC`, `TCN_CODIGO`) + `ITENS: CreateProposalItemDto[]` (mínimo 1 item).

#### [NEW] `src/modules/proposal/dto/update-proposal.dto.ts`
`UpdateProposalSchema = CreateProposalSchema.partial()` + classe `UpdateProposalDto extends ZodDto(UpdateProposalSchema)`.

#### [NEW] `src/modules/proposal/proposal.service.ts`
Métodos principais:
- `get(credentialsId, storeId, queryDto, includeCount)`:
  - Consulta paginada em `PROPOSTAS P` com `LEFT JOIN` em `CLIENTES`, `FUNCIONARIOS`, `SITUACAO`, `LOJAS`, `USUARIOS`, `FORMASPAG`, `PLANOSPAG`.
  - Suporte a `COUNT(*) AS TOTAL` quando `includeCount` for `true`, retornando `PaginatedResponse`.
- `getById(credentialsId, storeId, id)`:
  - Busca cabeçalho em `PROPOSTAS` e itens em `ITENSPRO` (`LEFT JOIN PRODUTOS`), lançando `NotFoundException` caso não exista.
- `getItemsByProposalNumber(credentialsId, proposalNumber, storeId)`:
  - Retorna os itens de `ITENSPRO` vinculados à proposta (validando existência/acesso por loja).
- `create(credentialsId, storeId, operatorId, employeeId, dto)`:
  - Valida existência dos produtos em `PRODUTOS` (e cliente/vendedor quando aplicável).
  - Preenche defaults de data/hora (`America/Sao_Paulo`), `PRO_GERADA = 'N'`, `PRO_STATUS = '2'`, `PRO_PRECO = '2'`, e calcula totais (`PRO_QUANT`, `PRO_TOTALBRUTO`, `PRO_TOTALLIQUIDO`, `IPR_TOTAL`, `IPR_LIQUIDO`, `IPR_ITEM` sequencial) quando omitidos.
  - Executa `INSERT INTO PROPOSTAS (... PRO_NUMERO ...) VALUES (GEN_ID(GEN_NUMEROPRO, 1), ...) RETURNING PRO_NUMERO` e loop de `INSERT INTO ITENSPRO (... IPR_NUMERO ...) VALUES (GEN_ID(GEN_NUMEROIPR, 1), ...)` dentro de transação atômica.
  - Retorna `this.getById(credentialsId, finalStoreId, proNumero)`.
- `update(credentialsId, storeId, id, dto)`:
  - Busca proposta existente (lança `NotFoundException` se não existir; `BadRequestException` se `PRO_GERADA === 'S'` caso confirmado).
  - Atualiza dinamicamente apenas os campos enviados de `PROPOSTAS` (mesmo padrão de `ClientService.update`).
  - Se `dto.ITENS` for informado, executa `DELETE FROM ITENSPRO WHERE PRO_NUMERO = ?` e reinsere os novos itens na mesma transação atômica, recalculando totais caso omitidos.
  - Retorna `this.getById(credentialsId, storeId, id)`.

#### [NEW] `src/modules/proposal/proposal.controller.ts`
Rotas sob `@Controller('proposals')` com `@ApiTags('Proposals')` e `@UseGuards(JwtAuthGuard, PermissionsGuard)`:
- `GET /proposals` (`@RequirePermissions({ allOf: ['tenant.proposals.view'] })`, `@IncludeCount()`)
- `GET /proposals/:id` (`@RequirePermissions({ allOf: ['tenant.proposals.view'] })`)
- `GET /proposals/:id/items` (`@RequirePermissions({ allOf: ['tenant.proposals.view'] })`)
- `POST /proposals` (`@RequirePermissions({ allOf: ['tenant.proposals.create'] })`)
- `PATCH /proposals/:id` (`@RequirePermissions({ allOf: ['tenant.proposals.update'] })`)
- *(Sem rota `DELETE`, conforme especificado)*

#### [NEW] `src/modules/proposal/proposal.module.ts`
Registra `ProposalController` e `ProposalService` (importando `DatabaseModule` / `RbacModule` se necessário — seguindo exatamente `ProductionOrderModule`).

---

### Testes Automatizados (`src/modules/proposal/`)

#### [NEW] `src/modules/proposal/dto/proposal.dto.spec.ts`
Testes de validação Zod para `CreateProposalSchema`, `UpdateProposalSchema` e `ProposalQuerySchema` com `test.each`.

#### [NEW] `src/modules/proposal/proposal.service.spec.ts`
Testes unitários com mock de `TenantConnectionService` (incluindo callback-based `query` e `startTransaction` / `commit` / `rollback`) cobrindo `get`, `getById`, `getItemsByProposalNumber`, `create` e `update` (sucesso e cenários de erro/rollback).

#### [NEW] `src/modules/proposal/proposal.controller.spec.ts`
Testes unitários do controller com override de `JwtAuthGuard` e `PermissionsGuard` validando delegação, isolamento `H2M` e exceções.

---

## Verification Plan

### Automated Tests
```bash
npx.cmd jest src/modules/proposal/
npm.cmd run build
```

### Manual Verification
1. Conferir endpoints e schemas gerados no Swagger (`/docs#/Proposals`), validando que todos os campos usam a nomenclatura exata de `PROPOSTAS` e `ITENSPRO` e que não há rota `DELETE`.
2. Testar `POST /api/v1/proposals`, `GET /api/v1/proposals` (com `X-Request-Count: true`), `GET /api/v1/proposals/:id`, `GET /api/v1/proposals/:id/items` e `PATCH /api/v1/proposals/:id` contra um banco Firebird de teste.
