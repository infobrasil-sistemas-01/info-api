import {
  PostProductionOrderSchema,
  ProductionOrderItemSchema,
  CreateProductionOrderSchema,
  CreateProductionOrderItemSchema,
} from './create-production-order.dto';

describe('PostProductionOrderDto', () => {
  describe('ProductionOrderItemSchema', () => {
    it('deve aceitar item válido com product_id no padrão POST /orders', () => {
      const valid = {
        product_id: 101,
        quantity: 10.5,
      };

      const result = ProductionOrderItemSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.product_id).toBe(101);
        expect(result.data.quantity).toBe(10.5);
      }
    });

    it('deve aceitar item válido com product_code string', () => {
      const valid = {
        product_code: '00000000000012',
        quantity: 5,
      };

      const result = ProductionOrderItemSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar item com quantidade zero ou negativa', () => {
      expect(
        ProductionOrderItemSchema.safeParse({
          product_id: 101,
          quantity: 0,
        }).success,
      ).toBe(false);

      expect(
        ProductionOrderItemSchema.safeParse({
          product_id: 101,
          quantity: -5,
        }).success,
      ).toBe(false);
    });

    it('deve rejeitar item sem product_id nem product_code', () => {
      expect(
        ProductionOrderItemSchema.safeParse({
          quantity: 2,
        }).success,
      ).toBe(false);
    });
  });

  describe('PostProductionOrderSchema', () => {
    const validOrderPattern = {
      product_id: 45,
      quantity: 50,
      store_id: 1,
      user_id: 10,
      start_date: '2026-04-01',
      end_date: '2026-04-05',
      store_note: 'Produção lote inicial',
      items: [
        {
          product_id: 12,
          quantity: 25,
        },
      ],
    };

    it('deve aceitar payload completo válido com items', () => {
      const result = PostProductionOrderSchema.safeParse(validOrderPattern);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.product_id).toBe(45);
        expect(result.data.quantity).toBe(50);
        expect(result.data.store_id).toBe(1);
        expect(result.data.user_id).toBe(10);
        expect(result.data.items).toHaveLength(1);
      }
    });

    it('deve aceitar payload com aliases retrocompatíveis (productCode, obs)', () => {
      const validWithAliases = {
        productCode: '00000000000045',
        quantity: 10,
        storeId: 1,
        userId: 10,
        startDate: '2026-04-01',
        endDate: '2026-04-05',
        obs: 'Obs teste',
        items: [{ productCode: 'INSUMO-1', quantity: 2 }],
      };

      const result = CreateProductionOrderSchema.safeParse(validWithAliases);
      expect(result.success).toBe(true);
    });

    it('deve aceitar payload com campos opcionais omitidos', () => {
      const minimal = {
        product_id: 45,
        quantity: 10,
        items: [{ product_id: 12, quantity: 2 }],
      };

      const result = PostProductionOrderSchema.safeParse(minimal);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar payload com array items vazio', () => {
      const invalid = {
        ...validOrderPattern,
        items: [],
      };

      const result = PostProductionOrderSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar payload sem o campo items', () => {
      const { items, ...withoutItems } = validOrderPattern;

      const result = PostProductionOrderSchema.safeParse(withoutItems);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar quantidade a produzir menor ou igual a zero', () => {
      expect(
        PostProductionOrderSchema.safeParse({
          ...validOrderPattern,
          quantity: 0,
        }).success,
      ).toBe(false);

      expect(
        PostProductionOrderSchema.safeParse({
          ...validOrderPattern,
          quantity: -10,
        }).success,
      ).toBe(false);
    });

    it('deve rejeitar formato inválido de datas', () => {
      expect(
        PostProductionOrderSchema.safeParse({
          ...validOrderPattern,
          start_date: '01/04/2026',
        }).success,
      ).toBe(false);

      expect(
        PostProductionOrderSchema.safeParse({
          ...validOrderPattern,
          end_date: '2026-4-5',
        }).success,
      ).toBe(false);
    });

    it('deve rejeitar observações com mais de 200 caracteres', () => {
      const result = PostProductionOrderSchema.safeParse({
        ...validOrderPattern,
        store_note: 'A'.repeat(201),
      });
      expect(result.success).toBe(false);
    });
  });
});
