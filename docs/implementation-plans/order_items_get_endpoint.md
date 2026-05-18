# Implementation Plan - Order Items GET Endpoint

Create a new endpoint `GET /order-items` to allow filtering and listing items across all orders with enriched data (brand, group, date).

## User Review Required

> [!NOTE]
> The endpoint will use the existing `tenant.orders.view` permission as requested.

## Proposed Changes

### Order Module

#### [NEW] [OrderItemQueryDto](file:///c:/dev/infoapi/src/modules/order/order-item/dto/order-item-query.dto.ts)
- Define `GetOrderItemsQueryDto` with filters:
    - `order_id` (number)
    - `product_id` (number)
    - `brand_id` (number)
    - `group_id` (number)
    - `startDate` (string, YYYY-MM-DD)
    - `endDate` (string, YYYY-MM-DD)
    - `page` (number, default 1)
    - `pageSize` (number, default 10)

#### [NEW] [OrderItemEnrichedResponseDto](file:///c:/dev/infoapi/src/modules/order/order-item/dto/order-item-response.dto.ts)
- Define `OrderItemEnrichedResponseDto` with the requested fields:
    - `VEN_NUMERO` (Order ID)
    - `VEN_DATA` (Order Date)
    - `PRO_CODIGO`, `PRO_DESCRICAO`
    - `IVD_PRECO`, `IVD_QTDE`, `IVD_TOTAL`, `IVD_DESCONTO`, `IVD_LIQUIDO`
    - `MAR_CODIGO`, `MAR_DESCRICAO`
    - `GRU_CODIGO`, `GRU_DESCRICAO`

#### [MODIFY] [order-item.service.ts](file:///c:/dev/infoapi/src/modules/order/order-item/order-item.service.ts)
- Implement `get(credentialsId, storeId, filters)`:
    - Perform a complex query joining `ITENSVEN`, `PRODUTOS`, `MARCAS`, `GRUPOSPRO`, and `VENDAS`.
    - Apply filters for product, brand, group, and date range.
    - Implement pagination using `FIRST ? SKIP ?`.

#### [NEW] [order-item.controller.ts](file:///c:/dev/infoapi/src/modules/order/order-item/order-item.controller.ts)
- Create `OrderItemController` with `@Controller('order-items')`.
- Add `GET /` method:
    - Protect with `JwtAuthGuard` and `PermissionsGuard`.
    - Require `tenant.orders.view` permission.
    - Inject `OrderItemService`.

#### [MODIFY] [order.module.ts](file:///c:/dev/infoapi/src/modules/order/order.module.ts)
- Add `OrderItemController` to the `controllers` array.

## Verification Plan

### Automated Tests
- Verify the SQL query logic against the expected Firebird syntax.
- Test the endpoint manually using a REST client if possible.

### Manual Verification
- Check Swagger documentation for the new endpoint.
- Verify that all requested fields are returned correctly.
