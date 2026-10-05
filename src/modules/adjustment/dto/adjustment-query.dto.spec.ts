import {
  AdjustmentQuerySchema,
  GetAdjustmentByIdQuerySchema,
} from './adjustment-query.dto';

describe('AdjustmentQueryDto', () => {
  describe('AdjustmentQuerySchema', () => {
    it('deve aceitar parâmetros válidos', () => {
      const valid = {
        page: '1',
        pageSize: '20',
        storeId: '2',
        statusId: '1',
        type: '1',
        userId: '5',
        adjustmentNumber: '100',
        startDate: '2026-01-01',
        endDate: '2026-01-31',
      };

      const result = AdjustmentQuerySchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.pageSize).toBe(20);
        expect(result.data.storeId).toBe(2);
        expect(result.data.statusId).toBe(1);
        expect(result.data.type).toBe('1');
        expect(result.data.userId).toBe(5);
        expect(result.data.adjustmentNumber).toBe(100);
      }
    });

    it('deve aceitar objeto vazio (todos opcionais)', () => {
      const result = AdjustmentQuerySchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('deve rejeitar formato inválido de startDate', () => {
      const result = AdjustmentQuerySchema.safeParse({
        startDate: '01/01/2026',
      });
      expect(result.success).toBe(false);
    });

    it('deve rejeitar formato inválido de endDate', () => {
      const result = AdjustmentQuerySchema.safeParse({
        endDate: '2026-1-1',
      });
      expect(result.success).toBe(false);
    });

    it('deve rejeitar page menor que 1', () => {
      const result = AdjustmentQuerySchema.safeParse({
        page: '0',
      });
      expect(result.success).toBe(false);
    });

    it('deve rejeitar pageSize menor que 1', () => {
      const result = AdjustmentQuerySchema.safeParse({
        pageSize: '0',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('GetAdjustmentByIdQuerySchema', () => {
    it('deve validar storeId coerzido', () => {
      const result = GetAdjustmentByIdQuerySchema.safeParse({ storeId: '3' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.storeId).toBe(3);
      }
    });

    it('deve validar sem storeId', () => {
      const result = GetAdjustmentByIdQuerySchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });
});
