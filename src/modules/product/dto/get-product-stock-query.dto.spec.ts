import { GetProductStockQuerySchema } from './get-product-stock-query.dto';

describe('GetProductStockQueryDto', () => {
  const validData = {
    storeId: 1,
    page: 1,
    pageSize: 50,
    search: 'refrigerante',
    startDateAlteracao: '2026-01-01',
    endDateAlteracao: '2026-01-31',
  };

  test.each([
    ['valid full data', validData],
    ['empty query', {}],
    ['with string storeId coerced to int', { storeId: '2' }],
    ['with large pageSize allowed by schema (controlled by PlanLimitInterceptor)', { pageSize: 500 }],
    [
      'with only startDateAlteracao and endDateAlteracao',
      {
        startDateAlteracao: '2026-01-01',
        endDateAlteracao: '2026-01-31',
      },
    ],
  ])('should accept %s', (_, input) => {
    expect(() => GetProductStockQuerySchema.parse(input)).not.toThrow();
  });

  test.each([
    ['invalid page less than 1', { page: 0 }],
    ['invalid pageSize less than 1', { pageSize: 0 }],
  ])('should reject %s', (_, input) => {
    expect(() => GetProductStockQuerySchema.parse(input)).toThrow();
  });
});

