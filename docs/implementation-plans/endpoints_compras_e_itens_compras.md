# Plano de Implementação - Endpoints de Compras e Itens de Compras

## 1. Visão Geral e Contexto
Expandir o módulo de compras (`PurchaseModule`) da API para oferecer suporte completo às tabelas Firebird `COMPRAS` e `ITENSCOM`, espelhando a arquitetura e convenções já consolidadas em vendas (`OrderModule` e `OrderItemModule`).

A estratégia adotada segue a **Abordagem 2 (Segregação por Granularidade)**:
- `GET /purchases` (e alias retrocompatível `GET /purchase`): listagem resumida com paginação, filtros e suporte opt-in a `X-Request-Count`. Preserva estritamente todos os 15 campos originais e adiciona novos campos do cabeçalho DDL (sem quebrar clientes legados).
- `GET /purchases/:id` (e `GET /purchase/:id`): detalhe completo da compra (cabeçalho com dados de fornecedor, totais, transporte, impostos consolidados) agregando a lista de itens `ITENSCOM` enriquecidos com descrição do produto.
- `GET /purchase-items`: busca transversal paginada de itens de compra (`ITENSCOM` + `COMPRAS` + `PRODUTOS` + `MARCAS` + `GRUPOSPRO` + `CREODRES`), com filtros análogos aos de `GET /order-items` e suporte a `X-Request-Count`.

---

## 2. Levantamento de Campos das DDLs

### Cabeçalho `COMPRAS`
- Identificação: `COM_NUMERO` (PK), `LOJ_CODIGO`, `CRE_CODIGO`, `USU_CODIGO`, `FUN_CODIGO`, `TRA_CODIGO`, `SIT_CODIGO`
- Dados fiscais e NF: `COM_NUMERONF`, `COM_SERIE`, `COM_CHAVE`, `COM_DATAEMISSAONF`, `COM_DATABAIXA`, `COM_DATA`, `COM_HORA`, `NAF_CFOP`, `COM_TIPO`, `COM_TIPOCOMPRA`, `COM_ESPECIE`, `COM_PRAZO`, `COM_TIPOFRETE`, `COM_FINALIDADE`
- Totais financeiros e mercadoria: `COM_TOTAL`, `COM_QUANTIDADE`, `COM_VRTOTALNF`, `COM_VRDESCONTO`, `COM_VRBONIFICACAO`, `COM_VRCOMPLEMENTO`, `COM_VRDESCCOMPL`, `COM_VROUTRAS`
- Impostos e fretes: `COM_VRBASECALC`, `COM_VRICMS`, `COM_VRBASECALCSUBST`, `COM_VRICMSSUBST`, `COM_VRICMSANTECIPADO`, `COM_VRICMSDESON`, `COM_VRDIF_ICMS`, `COM_VRIPI`, `COM_VRII`, `COM_VRFRETENF`, `COM_VRFRETEAVULSO`, `COM_VRSEGURO`, `COM_VROUTRASDESP`, `COM_VRFCPST`
- Reforma Tributária (IBS / CBS): `COM_TOTALBCIBSCBS`, `COM_TOTALUFIBS`, `COM_TOTALMUNIBS`, `COM_TOTALCBS`, `COM_TOTALIS`, `COM_TOTALIBSMONO`, `COM_TOTALCBSMONO`, etc.
- Complementares: `COM_OBS1`, `PED_NUMERO`, `ETA_NUMERO`, `EAL_NUMERO`, `EVC_CODIGO`.

### Itens `ITENSCOM`
- Identificação: `ICP_NUMERO` (PK), `COM_NUMERO` (FK), `PRO_CODIGO`, `PED_NUMERO`, `TCP_CODIGO`, `ICP_ITEMREF`
- Quantidade e valores: `ICP_QTDE`, `ICP_PRECO`, `ICP_TOTAL`, `ICP_LIQUIDO`, `ICP_VLRTOTAL`, `ICP_QTDEPEND`, `ICP_QTDECONFERIDA`
- Preços de venda/referência: `ICP_PRECO1` a `ICP_PRECO4`, `ICP_PERCPRECO1` a `ICP_PERCPRECO4`
- Lote e Validade: `ICP_DATAVAL`, `ICP_DATAFAB`, `LOT_NUMERO`, `ICP_QTDELOTE`
- Tributação ICMS/IPI/PIS/COFINS: `NAF_CFOP`, `ICM_CODIGO`, `COF_CODIGO`, `PIS_CODIGO`, `IPI_CODIGO`, `ICP_PERCICMS`, `ICP_PERCIPI`, `ICP_VLRICMS`, `ICP_VLRIPI`, `ICP_VLRBCICMS`, `ICP_VLRBCICMSSUBST`, `ICP_VLRICMSSUBST`, `ICP_VLRICMSDESON`, etc.
- Reforma Tributária: `ICP_VRBCIBSCBS`, `ICP_PERCIBSUF`, `ICP_VRIBSUF`, `ICP_PERCIBSMUN`, `ICP_VRIBSMUN`, `ICP_PERCCBS`, `ICP_VRCBS`, etc.
- Enriquecimento com Produto: `PRO_DESCRICAO`, `PRO_UNIDADE`, `MAR_CODIGO`, `MAR_DESCRICAO`, `GRU_CODIGO`, `GRU_DESCRICAO`.

---

## 3. Arquitetura e Contratos de Rotas

### 3.1. `GET /purchases` (e alias `/purchase`)
- **Query DTO (`PurchaseQueryDto`):**
  - `page` (default 1), `pageSize` (default 10)
  - `storeId` (LOJ_CODIGO)
  - `supplierId` (CRE_CODIGO)
  - `startDate`, `endDate` (COM_DATA - YYYY-MM-DD)
  - `invoiceNumber` (COM_NUMERONF)
  - `nfeKey` (COM_CHAVE)
  - `statusId` (SIT_CODIGO)
  - `orderNumber` (PED_NUMERO)
- **Headers:** `@IncludeCount()` -> `X-Request-Count: true`
- **Response:** `PurchaseResponseDto[]` ou `PaginatedResponse<PurchaseResponseDto>`
- **Garantia Retrocompatível:** Todos os 15 campos originais de `PurchaseResponseDto` mantidos com mesmos nomes e tipos; campos adicionais do cabeçalho expostos como opcionais.

### 3.2. `GET /purchases/:id` (e `/purchase/:id`)
- **Param:** `id` (`COM_NUMERO`, integer)
- **Query:** `storeId` opcional
- **Response:** `PurchaseDetailResponseDto` (cabeçalho completo + `items: PurchaseItemResponseDto[]`).

### 3.3. `GET /purchase-items`
- **Controller Dedicado:** `PurchaseItemController` (`@Controller('purchase-items')`)
- **Query DTO (`PurchaseItemQueryDto`):**
  - `page`, `pageSize`
  - `purchaseId` (`COM_NUMERO`)
  - `productId` (`PRO_CODIGO`)
  - `supplierId` (`CRE_CODIGO`)
  - `storeId` (`LOJ_CODIGO`)
  - `startDate`, `endDate` (`COM_DATA`)
  - `invoiceNumber` (`COM_NUMERONF`)
  - `brandId` (`MAR_CODIGO`)
  - `groupId` (`GRU_CODIGO`)
  - `cfop` (`NAF_CFOP`)
- **Headers:** `@IncludeCount()` -> `X-Request-Count: true`
- **Response:** `PaginatedResponse<PurchaseItemEnrichedResponseDto>`

---

## 4. Permissões RBAC
- Permissão `tenant.purchases.view` já cadastrada em `src/infra/rbac/catalog/permissions.catalog.ts` e `prisma/sync_permissions.sql`.
- Todos os endpoints (`/purchases`, `/purchases/:id` e `/purchase-items`) utilizarão `@RequirePermissions({ allOf: ['tenant.purchases.view'] })`, garantindo paridade com a forma como `tenant.orders.view` rege tanto `/orders` quanto `/order-items`.

---

## 5. Plano de Fases e Execução

### Fase 1: DTOs e Contratos
1. Atualizar `PurchaseResponseDto` adicionando os novos campos do cabeçalho sem quebrar os campos existentes.
2. Criar `PurchaseDetailResponseDto` e `PurchaseItemResponseDto` para o detalhamento da compra com seus itens.
3. Criar `PurchaseItemQueryDto` e `PurchaseItemEnrichedResponseDto` para a busca transversal de itens em `/purchase-items`.
4. Atualizar `PurchaseQuerySchema` e `PurchaseQueryDto` adicionando filtros opcionais (`statusId`, `orderNumber`).

### Fase 2: Serviços e Consultas Firebird
1. Em `PurchaseService`:
   - Atualizar `get()` para suportar `@IncludeCount()`, calculando total via `COUNT(*)` caso solicitado, retornando `PaginatedResponse`.
   - Implementar `getById(credentialsId, storeId, purchaseId)` para buscar o cabeçalho completo de `COMPRAS` com dados do fornecedor e transportadora.
2. Em `PurchaseItemService` (novo serviço):
   - Implementar `findItemsByPurchaseId(credentialsId, purchaseId)` para retornar os itens de uma compra com dados do produto.
   - Implementar `get(credentialsId, filters, includeCount)` para a busca transversal paginada com `FIRST ? SKIP ?`, contagem opt-in e joins com `COMPRAS`, `PRODUTOS`, `MARCAS`, `GRUPOSPRO` e `CREODRES`.

### Fase 3: Controllers e Módulos
1. Atualizar `PurchaseController` para suportar `@Controller(['purchases', 'purchase'])`, adicionar `@IncludeCount()` em `get()`, e implementar `GET :id`.
2. Criar `PurchaseItemController` (`@Controller('purchase-items')`) com Swagger, guards e RBAC.
3. Registrar `PurchaseItemService` e `PurchaseItemController` no `PurchaseModule`.

### Fase 4: Testes Unitários e Validação
1. Atualizar testes unitários em `purchase.controller.spec.ts` e `purchase.service.spec.ts`.
2. Criar testes unitários em `purchase-item.controller.spec.ts` e `purchase-item.service.spec.ts`.
3. Executar a suíte de testes (`npm run test`) e checar linter/formatação.
