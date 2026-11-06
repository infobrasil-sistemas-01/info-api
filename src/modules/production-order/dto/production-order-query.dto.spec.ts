import {
  ProductionOrderQuerySchema,
  GetProductionOrderByIdQuerySchema,
} from './production-order-query.dto';

describe('ProductionOrderQueryDto', () => {
  describe('ProductionOrderQuerySchema', () => {
    it('deve aceitar parâmetros válidos', () => {
      const valid = {
        page: '1',
        pageSize: '20',
        storeId: '2',
        statusId: '1',
        productCode: '00000000000001',
        productionOrderNumber: '201',
        startDate: '2026-01-01',
        endDate: '2026-01-31',
        startDateBaixa: '2026-02-01',
        endDateBaixa: '2026-02-28',
      };

      const result = ProductionOrderQuerySchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.pageSize).toBe(20);
        expect(result.data.storeId).toBe(2);
        expect(result.data.statusId).toBe(1);
        expect(result.data.productCode).toBe('00000000000001');
        expect(result.data.productionOrderNumber).toBe(201);
        expect(result.data.startDate).toBe('2026-01-01');
        expect(result.data.endDate).toBe('2026-01-31');
        expect(result.data.startDateBaixa).toBe('2026-02-01');
        expect(result.data.endDateBaixa).toBe('2026-02-28');
      }
    });

    it('deve aceitar objeto vazio (todos opcionais)', () => {
      const result = ProductionOrderQuerySchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('deve rejeitar formato inválido de startDate', () => {
      const result = ProductionOrderQuerySchema.safeParse({
        startDate: '01/01/2026',
      });
      expect(result.success).toBe(false);
    });

    it('deve rejeitar formato inválido de endDate', () => {
      const result = ProductionOrderQuerySchema.safeParse({
        endDate: '2026-1-1',
      });
      expect(result.success).toBe(false);
    });

    it('deve rejeitar formato inválido de startDateBaixa', () => {
      const result = ProductionOrderQuerySchema.safeParse({
        startDateBaixa: '2026/02/01',
      });
      expect(result.success).toBe(false);
    });

    it('deve rejeitar page menor que 1', () => {
      const result = ProductionOrderQuerySchema.safeParse({
        page: '0',
      });
      expect(result.success).toBe(false);
    });

    it('deve rejeitar pageSize menor que 1', () => {
      const result = ProductionOrderQuerySchema.safeParse({
        pageSize: '0',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('GetProductionOrderByIdQuerySchema', () => {
    it('deve validar storeId coerzido', () => {
      const result = GetProductionOrderByIdQuerySchema.safeParse({
        storeId: '3',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.storeId).toBe(3);
      }
    });

    it('deve validar sem storeId', () => {
      const result = GetProductionOrderByIdQuerySchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });
});

