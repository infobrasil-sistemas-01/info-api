import { GetAccountReceivablesQuerySchema } from './get-account-receivables-query.dto';

describe('GetAccountReceivablesQueryDto', () => {
  const validData = {
    page: 1,
    pageSize: 10,
    storeId: 1,
    clientId: 2,
    arId: 3,
    situation: 'A',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  };

  test.each([
    ['valid full data', validData],
    ['only page and pageSize', { page: 1, pageSize: 10 }],
    ['empty object', {}],
  ])('should accept %s', (_, input) => {
    expect(() => GetAccountReceivablesQuerySchema.parse(input)).not.toThrow();
  });

  test.each([
    ['invalid page', { page: 0 }],
    ['invalid pageSize', { pageSize: 101 }],
    ['invalid situation', { situation: 'X' }],
  ])('should reject %s', (_, input) => {
    expect(() => GetAccountReceivablesQuerySchema.parse(input)).toThrow();
  });
});
