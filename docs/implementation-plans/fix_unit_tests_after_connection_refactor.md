# Fix Unit Tests after Connection Refactor

Update all unit tests to align with the new pool-based architecture and the introduction of `releaseConnection` in `TenantConnectionService`.

## User Review Required

> [!IMPORTANT]
> This refactor changes how database connections are mocked in all service tests. Instead of mocking `detach`, we now mock `releaseConnection`. The `TenantConnectionService` tests are also heavily updated to reflect the new caching logic.

## Proposed Changes

### Infrastructure

#### [MODIFY] [firebird.service.spec.ts](file:///c:/dev/infoapi/src/infra/firebird/firebird.service.spec.ts)
- Rename `getDatabaseConnection` tests to `createPool`.
- Mock `firebird.pool` instead of `firebird.attach`.

#### [MODIFY] [tenant-connection.service.spec.ts](file:///c:/dev/infoapi/src/infra/database/tenant-connection.service.spec.ts)
- Update `mockFirebirdService` to provide `createPool`.
- Update tests to handle `pool.get` callback logic.
- Add tests for new caching layers and `releaseConnection`.

### Domain Modules

Update the following service specs to use `releaseConnection` in their `mockTenantConnection`:

#### [MODIFY] [account-receivable.service.spec.ts](file:///c:/dev/infoapi/src/modules/account-receivable/account-receivable.service.spec.ts)
#### [MODIFY] [order.service.spec.ts](file:///c:/dev/infoapi/src/modules/order/order.service.spec.ts)
#### [MODIFY] [order-item.service.spec.ts](file:///c:/dev/infoapi/src/modules/order/order-item/order-item.service.spec.ts)
#### [MODIFY] [payment-method.service.spec.ts](file:///c:/dev/infoapi/src/modules/payment-method/payment-method.service.spec.ts)
#### [MODIFY] [product.service.spec.ts](file:///c:/dev/infoapi/src/modules/product/product.service.spec.ts)
#### [MODIFY] [product-brand.service.spec.ts](file:///c:/dev/infoapi/src/modules/product/brand/product-brand.service.spec.ts)
#### [MODIFY] [product-group.service.spec.ts](file:///c:/dev/infoapi/src/modules/product/group/product-group.service.spec.ts)
#### [MODIFY] [receipt.service.spec.ts](file:///c:/dev/infoapi/src/modules/receipt/receipt.service.spec.ts)

## Verification Plan

### Automated Tests
- Run `npm test` and ensure all 229+ tests pass.
- Specifically verify `infra` tests first: `npm test firebird.service.spec.ts` and `npm test tenant-connection.service.spec.ts`.
