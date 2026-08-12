import { GetDeliveriesQuerySchema } from './get-deliveries-query.dto';

describe('GetDeliveriesQueryDto', () => {
  const validData = {
    page: 1,
    pageSize: 10,
    storeId: 1,
    status: 11,
  };

  test.each([
    ['valid basic query', validData],
    ['pageSize=500', { ...validData, pageSize: 500 }],
    ['pageSize=5000', { ...validData, pageSize: 5000 }],
    ['with date range', { ...validData, startDate: '2026-08-01', endDate: '2026-08-12' }],
    ['with vehicle plate', { ...validData, vehiclePlate: 'ABC1234' }],
  ])('should accept %s', (_, input) => {
    expect(() => GetDeliveriesQuerySchema.parse(input)).not.toThrow();
  });

  test.each([
    ['pageSize less than 1', { ...validData, pageSize: 0 }],
    ['invalid startDate format', { ...validData, startDate: '12-08-2026' }],
    ['invalid vehiclePlate length', { ...validData, vehiclePlate: 'TOO_LONG_PLATE' }],
  ])('should reject %s', (_, input) => {
    expect(() => GetDeliveriesQuerySchema.parse(input)).toThrow();
  });
});
