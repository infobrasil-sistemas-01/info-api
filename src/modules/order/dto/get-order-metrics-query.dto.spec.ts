import { GetOrderMetricsQuerySchema } from './get-order-metrics-query.dto';

describe('GetOrderMetricsQueryDto', () => {
  describe('GetOrderMetricsQuerySchema', () => {
    const validData = {
      startDate: '2026-09-01',
      endDate: '2026-09-30',
      storeId: 1,
    };

    it('should validate successfully with valid data', () => {
      const result = GetOrderMetricsQuerySchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should validate successfully without optional storeId', () => {
      const result = GetOrderMetricsQuerySchema.safeParse({
        startDate: '2026-09-01',
        endDate: '2026-09-30',
      });
      expect(result.success).toBe(true);
    });

    it('should fail when startDate is missing', () => {
      const result = GetOrderMetricsQuerySchema.safeParse({
        endDate: '2026-09-30',
      });
      expect(result.success).toBe(false);
    });

    it('should fail when endDate is missing', () => {
      const result = GetOrderMetricsQuerySchema.safeParse({
        startDate: '2026-09-01',
      });
      expect(result.success).toBe(false);
    });

    it('should fail with invalid date format for startDate', () => {
      const result = GetOrderMetricsQuerySchema.safeParse({
        startDate: '01/09/2026',
        endDate: '2026-09-30',
      });
      expect(result.success).toBe(false);
    });

    it('should fail when startDate is greater than endDate', () => {
      const result = GetOrderMetricsQuerySchema.safeParse({
        startDate: '2026-09-30',
        endDate: '2026-09-01',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'A data final (endDate) deve ser maior ou igual à data inicial (startDate)',
        );
      }
    });
  });
});
