import { GetAbcCurveQuerySchema } from './get-abc-curve-query.dto';

describe('GetAbcCurveQueryDto', () => {
  describe('GetAbcCurveQuerySchema', () => {
    const validSellerData = {
      startDate: '2026-01-22',
      endDate: '2026-10-22',
      groupBy: 'SELLER' as const,
      storeId: 1,
      system: 'PED' as const,
      situation: 2,
      orderBy: 'NAME' as const,
    };

    it('should validate successfully with standard SELLER query without pagination', () => {
      const result = GetAbcCurveQuerySchema.safeParse(validSellerData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.groupBy).toBe('SELLER');
        expect(result.data.system).toBe('PED');
      }
    });

    it('should allow omitting optional fields', () => {
      const result = GetAbcCurveQuerySchema.safeParse({
        startDate: '2026-01-22',
        endDate: '2026-10-22',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.groupBy).toBeUndefined();
        expect(result.data.system).toBeUndefined();
      }
    });

    it('should allow STORE, GROUP and BRAND without pagination', () => {
      for (const dimension of ['STORE', 'GROUP', 'BRAND'] as const) {
        const result = GetAbcCurveQuerySchema.safeParse({
          startDate: '2026-01-22',
          endDate: '2026-10-22',
          groupBy: dimension,
        });
        expect(result.success).toBe(true);
      }
    });

    it('should FAIL when CUSTOMER is requested without pagination (page and pageSize)', () => {
      const result = GetAbcCurveQuerySchema.safeParse({
        startDate: '2026-01-22',
        endDate: '2026-10-22',
        groupBy: 'CUSTOMER',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Para agrupamentos de alta cardinalidade ('CUSTOMER' e 'PRODUCT'), os parâmetros 'page' e 'pageSize' (máx: 100) são obrigatórios",
        );
      }
    });

    it('should FAIL when PRODUCT is requested without pagination', () => {
      const result = GetAbcCurveQuerySchema.safeParse({
        startDate: '2026-01-22',
        endDate: '2026-10-22',
        groupBy: 'PRODUCT',
        page: 1,
        // pageSize missing
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Para agrupamentos de alta cardinalidade ('CUSTOMER' e 'PRODUCT'), os parâmetros 'page' e 'pageSize' (máx: 100) são obrigatórios",
        );
      }
    });

    it('should PASS when CUSTOMER or PRODUCT has valid pagination', () => {
      const result = GetAbcCurveQuerySchema.safeParse({
        startDate: '2026-01-22',
        endDate: '2026-10-22',
        groupBy: 'CUSTOMER',
        page: 1,
        pageSize: 50,
      });
      expect(result.success).toBe(true);
    });

    it('should fail when startDate is greater than endDate', () => {
      const result = GetAbcCurveQuerySchema.safeParse({
        startDate: '2026-10-23',
        endDate: '2026-10-22',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'startDate não pode ser posterior a endDate',
        );
      }
    });

    it('should fail when date format is invalid', () => {
      const result = GetAbcCurveQuerySchema.safeParse({
        startDate: '22/01/2026',
        endDate: '2026-10-22',
      });
      expect(result.success).toBe(false);
    });
  });
});
