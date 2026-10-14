# Implementation Plan: Suporte a X-Request-Count e Headers de Paginação no GET /order-items

## 1. Visão Geral
Adicionar suporte ao cabeçalho `X-Request-Count: true` no endpoint `GET /order-items`, retornando metadados de paginação via cabeçalhos HTTP (`X-Total-Count`, `X-Total-Pages`, `X-Current-Page`, `X-Per-Page`), seguindo exatamente o mesmo padrão arquitetural já estabelecido em `GET /orders` e documentado no ADR 002.

## 2. Decisões Arquiteturais
- **Opt-in de contagem**: Apenas executa `SELECT COUNT(*) AS TOTAL` se `X-Request-Count: true` for enviado na requisição (capturado pelo decorator `@IncludeCount()`).
- **Encapsulamento**: O `OrderItemService.get` retorna `new PaginatedResponse(result, total, page, pageSize)`.
- **Camada de Apresentação**: O `PaginationHeadersInterceptor` global injeta os headers `X-Total-Count`, `X-Total-Pages`, `X-Current-Page` e `X-Per-Page` na resposta e desempacota o payload devolvendo o array original aos clientes legados.
- **Documentação OpenAPI/Swagger**: Declaração de `@ApiHeader({ name: 'X-Request-Count' })` e `@ApiResponse({ headers: { ... } })` no `OrderItemController`.

## 3. Alterações Planejadas
1. **`src/modules/order/order-item/order-item.service.ts`**:
   - Importar `PaginatedResponse`.
   - Adicionar parâmetro `includeCount: boolean = false` ao método `get`.
   - Implementar query de contagem condicional preservando os mesmos filtros (`LOJ_CODIGO`, `orderId`, `productId`, `brandId`, `groupId`, `startDate`, `endDate`).
   - Retornar instância de `PaginatedResponse`.

2. **`src/modules/order/order-item/order-item.controller.ts`**:
   - Injetar `@IncludeCount() includeCount: boolean = false`.
   - Adicionar decorators `@ApiHeader` e `@ApiResponse({ headers: { ... } })`.
   - Repassar `includeCount` para `this.orderItemService.get(...)`.

3. **Testes Unitários**:
   - Atualizar `src/modules/order/order-item/order-item.service.spec.ts` para testar `get` com `includeCount: true` e `includeCount: false`.
   - Adicionar teste para o controller em `src/modules/order/order-item/order-item.controller.spec.ts`.

4. **Sincronização Swagger**:
   - Executar `npm run swagger:generate` para manter a documentação da versão atualizada.
   - Validar com `npm test` e `npm run build`.

5. **Commit e Push**:
   - Commit semântico em inglês e `git push`.
