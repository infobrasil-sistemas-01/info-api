# Plano de Implementação - Endpoint GET /products/stock (Multi-lojas)

Endpoint dedicado para consulta de saldo de estoque multi-lojas (`EST_ATUAL` e `EST_APOIO`) por produto, sem quebrar o contrato existente de `GET /products` ou incorrer em produtos cartesianos duplicados.

## 1. Contexto e Motivação
- A consulta geral de produtos (`GET /products`) é atrelada a uma única loja fixa (`LOJ_CODIGO = ?`), mantendo uma relação 1:1 estrita na paginação linear (`FIRST ? SKIP ?`).
- Ao necessitar do estoque de todas as lojas disponíveis para cada produto, um `JOIN` direto duplicaria as linhas do produto pelo número de filiais, quebrando a contagem de páginas e inflando desnecessariamente o payload com dados cadastrais duplicados.
- A criação do endpoint segregado `GET /api/v1/products/stock` adota o padrão de Segregação de Interfaces (ISP), retornando um payload enxuto (`PRO_CODIGO`, `PRO_DESCRICAO`, `PRO_CODIGOBAR`, `STOCKS: [{ LOJ_CODIGO, EST_ATUAL, EST_APOIO }]`).

## 2. Arquitetura e Estratégia de Banco (Two-Phase Query)
Para garantir desempenho de leitura no Firebird:
1. **Fase 1 (Catálogo Paginado):**
   - Executa `SELECT FIRST ? SKIP ? P.PRO_CODIGO, P.PRO_CODIGOBAR, P.PRO_DESCRICAO FROM PRODUTOS P` com filtros opcionais (`search`, `startDateAlteracao`, `endDateAlteracao`).
2. **Fase 2 (Inventário em Lote):**
   - Com os `PRO_CODIGO` da página atual (ex: 50 itens), executa `SELECT E.PRO_CODIGO, E.LOJ_CODIGO, E.EST_ATUAL, E.EST_APOIO FROM ESTOQUE E WHERE E.PRO_CODIGO IN (...)`.
   - O Firebird utiliza o índice primário composto `(PRO_CODIGO, LOJ_CODIGO)` para busca instantânea.
3. **Agrupamento em Memória (Node.js):**
   - Agrupa os estoques por produto em um array `STOCKS` com a identidade da filial (`LOJ_CODIGO`).

## 3. Contrato da API
- **Endpoint:** `GET /api/v1/products/stock`
- **Permissão RBAC:** `tenant.products.view`
- **Query Params:**
  - `page`: number (default 1)
  - `pageSize`: number (default 50, max 100)
  - `search`: string (opcional, busca por descrição)
  - `storeId`: number (opcional, restringe a uma loja se informado)
  - `startDateAlteracao`: string (opcional)
  - `endDateAlteracao`: string (opcional)
- **Resposta:**
  ```json
  [
    {
      "PRO_CODIGO": "101",
      "PRO_CODIGOBAR": "7891234567890",
      "PRO_DESCRICAO": "Produto Exemplo",
      "STOCKS": [
        { "LOJ_CODIGO": 1, "EST_ATUAL": 10.0, "EST_APOIO": 2.0 },
        { "LOJ_CODIGO": 2, "EST_ATUAL": 5.0, "EST_APOIO": 0.0 }
      ]
    }
  ]
  ```

## 4. Arquivos Envolvidos
- `src/modules/product/dto/get-product-stock-query.dto.ts` (Novo)
- `src/modules/product/dto/product-stock-response.dto.ts` (Novo)
- `src/modules/product/product.service.ts` (Método `getStock`)
- `src/modules/product/product.controller.ts` (Endpoint `@Get('stock')`)
- `src/modules/product/product.service.spec.ts` (Testes unitários do service)
- `src/modules/product/product.controller.spec.ts` (Testes unitários do controller)

