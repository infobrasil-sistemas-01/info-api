# Plano de Implementação: Alinhamento das Colunas Retornadas nos Endpoints GET de Produtos

## 1. Visão Geral e Objetivo

Atualmente, a API disponibiliza três endpoints para consulta de produtos:
1. `GET /products` (listagem geral paginada)
2. `GET /products/id/:id` (busca pontual por ID)
3. `GET /products/barcode/:barcode` (busca pontual por Código de Barras)

Historicamente, o endpoint geral utilizava o método `ProductService.get()`, retornando colunas de venda e estoque com `EST_ATUAL`, `EST_APOIO`, `EST_DTALTERACAO` e junções `LEFT JOIN` com marcas e grupos. Por outro lado, os endpoints de busca pontual (`/id/:id` e `/barcode/:barcode`) utilizavam o método `ProductService.getUnique()`, que apresentava discrepâncias de aliases e joins. Além disso, os campos de precificação e custos internos (`PRO_PRCCOMPRA`, `PRO_PRCCUSTO`, `PRO_PRCCOMPRAFISCAL`, `PRO_CUSTOFISCAL`) estavam restritos apenas a chamadas internas de pedidos.

Conforme alinhamento de arquitetura, como a API atende a integrações privadas onde o integrador controla a camada de visualização/consumo, **todos os três endpoints GET de produtos devem retornar rigorosamente as mesmas colunas**, incluindo preços de venda, estoque e composição de custos/compra.

---

## 2. Projeção de Colunas Unificada (`ProductResponseDto`)

Todos os endpoints GET de produtos (`get` geral, `getUnique` por id e `getUnique` por barcode) projetam as seguintes 15 colunas:
* `PRO_CODIGO` (Código do produto)
* `PRO_CODIGOBAR` (Código de barras)
* `PRO_DESCRICAO` (Descrição do produto)
* `MAR_CODIGO` (Código da marca)
* `MAR_DESCRICAO` (Descrição da marca)
* `GRU_CODIGO` (Código do grupo)
* `GRU_DESCRICAO` (Descrição do grupo)
* `EST_ATUAL` (Estoque atual na loja informada)
* `EST_APOIO` (Estoque de apoio na loja informada)
* `PRECO` (Preço correspondente à tabela solicitada `PRO_PRECO${priceTable}`)
* `EST_DTALTERACAO` (Data da última alteração de estoque)
* `PRO_PRCCOMPRA` (Preço de compra)
* `PRO_PRCCUSTO` (Preço de custo)
* `PRO_PRCCOMPRAFISCAL` (Preço de compra fiscal)
* `PRO_CUSTOFISCAL` (Custo fiscal)

---

## 3. Etapas de Execução

1. **Atualização do DTO de Resposta (`ProductResponseDto`):**
   - Adicionar as propriedades `@ApiProperty` para `PRO_PRCCOMPRA`, `PRO_PRCCUSTO`, `PRO_PRCCOMPRAFISCAL`, `PRO_CUSTOFISCAL`.
2. **Atualização das Queries SQL em `ProductService`:**
   - Adicionar `P.PRO_PRCCOMPRA, P.PRO_PRCCUSTO, P.PRO_PRCCOMPRAFISCAL, P.PRO_CUSTOFISCAL` na query de `get()`.
   - Adicionar `P.PRO_PRCCOMPRA, P.PRO_PRCCUSTO, P.PRO_PRCCOMPRAFISCAL, P.PRO_CUSTOFISCAL` na query de `getUnique()`.
   - Garantir junções `LEFT JOIN` idênticas para marcas e grupos em ambas.
3. **Atualização do `ProductController`:**
   - Garantir tipagem unificada com `ProductResponseDto` em `@Get('/id/:id')` e `@Get('/barcode/:barcode')`.
4. **Atualização dos Testes Unitários:**
   - Adaptar assertions em `product.service.spec.ts` para validar a presença das colunas fiscais/custo em ambas as queries.
5. **Validação:**
   - Executar suíte de testes e validar compilação `nest build`.
