import {
  CreateProductionOrderSchema,
  CreateProductionOrderItemSchema,
} from './create-production-order.dto';

describe('CreateProductionOrderDto', () => {
  describe('CreateProductionOrderItemSchema', () => {
    it('deve aceitar item válido', () => {
      const valid = {
        productCode: '00000000000012',
        quantity: 10.5,
      };

      const result = CreateProductionOrderItemSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.productCode).toBe('00000000000012');
        expect(result.data.quantity).toBe(10.5);
      }
    });

    it('deve rejeitar item com quantidade zero ou negativa', () => {
      expect(
        CreateProductionOrderItemSchema.safeParse({
          productCode: 'PROD-1',
          quantity: 0,
        }).success,
      ).toBe(false);

      expect(
        CreateProductionOrderItemSchema.safeParse({
          productCode: 'PROD-1',
          quantity: -5,
        }).success,
      ).toBe(false);
    });

    it('deve rejeitar item sem productCode', () => {
      expect(
        CreateProductionOrderItemSchema.safeParse({
          productCode: '',
          quantity: 2,
        }).success,
      ).toBe(false);
    });
  });

  describe('CreateProductionOrderSchema', () => {
    const validOrder = {
      productCode: '00000000000045',
      quantity: 50,
      storeId: 1,
      userId: 10,
      startDate: '2026-04-01',
      endDate: '2026-04-05',
      obs: 'Produção lote inicial',
      items: [
        {
          productCode: '00000000000012',
          quantity: 25,
        },
      ],
    };

    it('deve aceitar payload completo válido', () => {
      const result = CreateProductionOrderSchema.safeParse(validOrder);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.productCode).toBe('00000000000045');
        expect(result.data.quantity).toBe(50);
        expect(result.data.items).toHaveLength(1);
      }
    });

    it('deve aceitar payload com campos opcionais omitidos', () => {
      const minimal = {
        productCode: '00000000000045',
        quantity: 10,
        items: [{ productCode: 'INSUMO-1', quantity: 2 }],
      };

      const result = CreateProductionOrderSchema.safeParse(minimal);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar payload com array de itens vazio', () => {
      const invalid = {
        ...validOrder,
        items: [],
      };

      const result = CreateProductionOrderSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar quantidade a produzir menor ou igual a zero', () => {
      expect(
        CreateProductionOrderSchema.safeParse({
          ...validOrder,
          quantity: 0,
        }).success,
      ).toBe(false);

      expect(
        CreateProductionOrderSchema.safeParse({
          ...validOrder,
          quantity: -10,
        }).success,
      ).toBe(false);
    });

    it('deve rejeitar formato inválido de datas', () => {
      expect(
        CreateProductionOrderSchema.safeParse({
          ...validOrder,
          startDate: '01/04/2026',
        }).success,
      ).toBe(false);

      expect(
        CreateProductionOrderSchema.safeParse({
          ...validOrder,
          endDate: '2026-4-5',
        }).success,
      ).toBe(false);
    });

    it('deve rejeitar observações com mais de 200 caracteres', () => {
      const result = CreateProductionOrderSchema.safeParse({
        ...validOrder,
        obs: 'A'.repeat(201),
      });
      expect(result.success).toBe(false);
    });
  });
});

