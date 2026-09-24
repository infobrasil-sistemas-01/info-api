import { GetProductsQuerySchema } from './get-products-query.dto';

describe('GetProductsQueryDto', () => {
  const validData = {
    storeId: 1,
    page: 1,
    pageSize: 10,
    priceTable: 1,
    group: 2,
    brand: 3,
    minStock: 5,
    search: 'refrigerante',
    startDateAlteracao: '2026-01-01',
    endDateAlteracao: '2026-01-31',
  };

  test.each([
    ['valid full data', validData],
    ['only required storeId', { storeId: 1 }],
    ['with string storeId coerced to int', { storeId: '2' }],
    [
      'with only startDateAlteracao and endDateAlteracao',
      {
        storeId: 1,
        startDateAlteracao: '2026-01-01',
        endDateAlteracao: '2026-01-31',
      },
    ],
  ])('should accept %s', (_, input) => {
    expect(() => GetProductsQuerySchema.parse(input)).not.toThrow();
  });

  test.each([
    ['invalid page less than 1', { storeId: 1, page: 0 }],
    ['invalid pageSize less than 1', { storeId: 1, pageSize: 0 }],
    ['invalid priceTable greater than 12', { storeId: 1, priceTable: 13 }],
  ])('should reject %s', (_, input) => {
    expect(() => GetProductsQuerySchema.parse(input)).toThrow();
  });
});
