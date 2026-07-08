# Conversão de Controllers Restantes para DTO de Query

## Objetivo

Seguir o padrão estabelecido no plano de validação de parâmetros inexistentes em query DTOs. Vamos refatorar todos os controllers que utilizavam parâmetros de query avulsos com `@Query('paramName')` para usar DTOs estruturados herdando de `ZodDto`. Isso garante que a validação estrita (`strict()`) configurada no `ZodValidationPipe` rejeite chaves desconhecidas (como o cliente mandar `data_inicio` em vez de `startDate`, ou `limit` em vez de `pageSize`), retornando o erro HTTP `400 Bad Request` apropriado.

---

## Modificações Propostas

### 1. Novo DTO para Pedidos (Orders)

#### [NEW] [get-orders-query.dto.ts](file:///c:/dev/infoapi/src/modules/order/dto/get-orders-query.dto.ts)
- Definir o schema `GetOrdersQuerySchema` usando Zod:
  - `page`: `z.coerce.number().int().min(1).optional()`
  - `pageSize`: `z.coerce.number().int().min(1).max(100).optional()`
  - `storeId`: `z.coerce.number().int().optional()`
  - `startDate`: `z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido de data. Use YYYY-MM-DD").optional()`
  - `endDate`: `z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido de data. Use YYYY-MM-DD").optional()`
  - `clientId`: `z.coerce.number().int().optional()`
  - `employeeId`: `z.coerce.number().int().optional()`
- Criar a classe `GetOrdersQueryDto` estendendo `ZodDto(GetOrdersQuerySchema)`.

#### [NEW] [get-order-by-id-query.dto.ts](file:///c:/dev/infoapi/src/modules/order/dto/get-order-by-id-query.dto.ts)
- Definir o schema `GetOrderByIdQuerySchema` usando Zod:
  - `storeId`: `z.coerce.number().int().optional()`
- Criar a classe `GetOrderByIdQueryDto` estendendo `ZodDto(GetOrderByIdQuerySchema)`.

#### [MODIFY] [order.controller.ts](file:///c:/dev/infoapi/src/modules/order/order.controller.ts)
- Refatorar o método `getOrders` para receber `@Query() query: GetOrdersQueryDto` no lugar dos parâmetros individuais.
- Refatorar o método `getOrderById` para receber `@Query() query: GetOrderByIdQueryDto` no lugar de `@Query('storeId')`.

---

### 2. Novo DTO para Lojas (Stores)

#### [NEW] [get-stores-query.dto.ts](file:///c:/dev/infoapi/src/modules/store/dto/get-stores-query.dto.ts)
- Definir o schema `GetStoresQuerySchema` usando Zod:
  - `page`: `z.coerce.number().int().min(1).optional()`
  - `pageSize`: `z.coerce.number().int().min(1).max(100).optional()`
  - `storeId`: `z.coerce.number().int().optional()`
  - `storeCnpj`: `z.string().optional()`
- Criar a classe `GetStoresQueryDto` estendendo `ZodDto(GetStoresQuerySchema)`.

#### [MODIFY] [store.controller.ts](file:///c:/dev/infoapi/src/modules/store/store.controller.ts)
- Refatorar o método `get` para receber `@Query() query: GetStoresQueryDto` no lugar dos parâmetros individuais.

---

### 3. Novo DTO para Produtos (Products)

#### [NEW] [get-products-query.dto.ts](file:///c:/dev/infoapi/src/modules/product/dto/get-products-query.dto.ts)
- Definir o schema `GetProductsQuerySchema` usando Zod:
  - `storeId`: `z.coerce.number().int()` (obrigatório, seguindo a lógica original)
  - `page`: `z.coerce.number().int().min(1).optional()`
  - `pageSize`: `z.coerce.number().int().min(1).max(100).optional()`
  - `priceTable`: `z.coerce.number().int().min(1).max(12).optional()`
  - `group`: `z.coerce.number().int().optional()`
  - `brand`: `z.coerce.number().int().optional()`
  - `minStock`: `z.coerce.number().optional()`
  - `search`: `z.string().optional()`
- Criar a classe `GetProductsQueryDto` estendendo `ZodDto(GetProductsQuerySchema)`.

#### [NEW] [get-product-query.dto.ts](file:///c:/dev/infoapi/src/modules/product/dto/get-product-query.dto.ts)
- Definir o schema `GetProductQuerySchema` usando Zod (reutilizado para busca por ID e por código de barras):
  - `priceTable`: `z.coerce.number().int().min(1).max(12).optional()`
  - `storeId`: `z.coerce.number().int().optional()`
- Criar a classe `GetProductQueryDto` estendendo `ZodDto(GetProductQuerySchema)`.

#### [MODIFY] [product.controller.ts](file:///c:/dev/infoapi/src/modules/product/product.controller.ts)
- Refatorar `getProducts` para receber `@Query() query: GetProductsQueryDto`.
- Refatorar `getProductById` para receber `@Query() query: GetProductQueryDto`.
- Refatorar `getProductByBarcode` para receber `@Query() query: GetProductQueryDto`.

---

### 4. Novo DTO para Grupos e Marcas de Produtos (Groups & Brands)

#### [NEW] [get-product-groups-query.dto.ts](file:///c:/dev/infoapi/src/modules/product/group/dto/get-product-groups-query.dto.ts)
- Definir o schema `GetProductGroupsQuerySchema` usando Zod:
  - `page`: `z.coerce.number().int().min(1).optional()`
  - `pageSize`: `z.coerce.number().int().min(1).max(100).optional()`
- Criar a classe `GetProductGroupsQueryDto` estendendo `ZodDto(GetProductGroupsQuerySchema)`.

#### [MODIFY] [product-group.controller.ts](file:///c:/dev/infoapi/src/modules/product/group/product-group.controller.ts)
- Refatorar `getGroups` para usar `@Query() query: GetProductGroupsQueryDto`.

#### [NEW] [get-product-brands-query.dto.ts](file:///c:/dev/infoapi/src/modules/product/brand/dto/get-product-brands-query.dto.ts)
- Definir o schema `GetProductBrandsQuerySchema` usando Zod:
  - `page`: `z.coerce.number().int().min(1).optional()`
  - `pageSize`: `z.coerce.number().int().min(1).max(100).optional()`
- Criar a classe `GetProductBrandsQueryDto` estendendo `ZodDto(GetProductBrandsQuerySchema)`.

#### [MODIFY] [product-brand.controller.ts](file:///c:/dev/infoapi/src/modules/product/brand/product-brand.controller.ts)
- Refatorar `getBrands` para usar `@Query() query: GetProductBrandsQueryDto`.

---

### 5. Novo DTO para Formas e Planos de Pagamento (Payment Methods & Plans)

#### [NEW] [get-payment-methods-query.dto.ts](file:///c:/dev/infoapi/src/modules/payment-method/dto/get-payment-methods-query.dto.ts)
- Definir o schema `GetPaymentMethodsQuerySchema` usando Zod:
  - `page`: `z.coerce.number().int().min(1).optional()`
  - `pageSize`: `z.coerce.number().int().min(1).max(100).optional()`
- Criar a classe `GetPaymentMethodsQueryDto` estendendo `ZodDto(GetPaymentMethodsQuerySchema)`.

#### [MODIFY] [payment-method.controller.ts](file:///c:/dev/infoapi/src/modules/payment-method/payment-method.controller.ts)
- Refatorar `getPaymentMethods` para usar `@Query() query: GetPaymentMethodsQueryDto`.

#### [NEW] [get-payment-plans-query.dto.ts](file:///c:/dev/infoapi/src/modules/payment-plan/dto/get-payment-plans-query.dto.ts)
- Definir o schema `GetPaymentPlansQuerySchema` usando Zod:
  - `page`: `z.coerce.number().int().min(1).optional()`
  - `pageSize`: `z.coerce.number().int().min(1).max(100).optional()`
- Criar a classe `GetPaymentPlansQueryDto` estendendo `ZodDto(GetPaymentPlansQuerySchema)`.

#### [MODIFY] [payment-plan.controller.ts](file:///c:/dev/infoapi/src/modules/payment-plan/payment-plan.controller.ts)
- Refatorar `getPaymentPlans` para usar `@Query() query: GetPaymentPlansQueryDto`.

---

### 6. Novo DTO para Entregas (Deliveries)

#### [NEW] [get-delivery-by-id-query.dto.ts](file:///c:/dev/infoapi/src/modules/delivery/dto/get-delivery-by-id-query.dto.ts)
- Definir o schema `GetDeliveryByIdQuerySchema` usando Zod:
  - `storeId`: `z.coerce.number().int().optional()`
- Criar a classe `GetDeliveryByIdQueryDto` estendendo `ZodDto(GetDeliveryByIdQuerySchema)`.

#### [MODIFY] [delivery.controller.ts](file:///c:/dev/infoapi/src/modules/delivery/delivery.controller.ts)
- Refatorar `getDeliveryById` para usar `@Query() query: GetDeliveryByIdQueryDto`.

---

## Plano de Verificação

### Testes Automatizados
- Rodar o linter para garantir que os imports e tipos estão corretos:
  ```bash
  npm run lint
  ```
- Executar os testes unitários existentes e adaptar os specs afetados:
  ```bash
  npm run test
  ```

### Testes Manuais
- Iniciar a aplicação localmente (`npm run start:dev`).
- Fazer uma requisição `GET /api/v1/orders?limit=100&offset=0&data_inicio=2026-07-08&data_fim=2026-07-08`.
- Verificar se a API retorna `400 Bad Request` com a mensagem em português detalhando quais parâmetros adicionais não existem.
