import { PostOrderDto, PostOrderSchema } from './create-order.dto';

describe('PostOrderDto', () => {
  describe('PostOrderSchema', () => {
    const validOrder = {
      date: '2024-01-15',
      hour: '14:30:00',
      payment_method: 'credit',
      payment_date: '2024-01-15',
    };

    describe('required fields', () => {
      test.each([['complete order', validOrder]])(
        'should accept %s',
        (_, input) => {
          expect(() => PostOrderSchema.parse(input)).not.toThrow();
        },
      );

      test.each([
        [
          'without date',
          {
            hour: '14:30:00',
            payment_method: 'credit',
            payment_date: '2024-01-15',
          },
        ],
        [
          'without hour',
          {
            date: '2024-01-15',
            payment_method: 'credit',
            payment_date: '2024-01-15',
          },
        ],
        [
          'without payment_method',
          {
            date: '2024-01-15',
            hour: '14:30:00',
            payment_date: '2024-01-15',
          },
        ],
        [
          'without payment_date',
          {
            date: '2024-01-15',
            hour: '14:30:00',
            payment_method: 'credit',
          },
        ],
      ])('should reject order %s', (_, input) => {
        expect(() => PostOrderSchema.parse(input)).toThrow();
      });
    });

    describe('optional fields', () => {
      test.each([
        ['taxes', { ...validOrder, taxes: 10.5 }, 'taxes', 10.5],
        ['discount', { ...validOrder, discount: 5.0 }, 'discount', 5.0],
        [
          'store_note',
          { ...validOrder, store_note: 'Customer request' },
          'store_note',
          'Customer request',
        ],
        [
          'payment_method_rate',
          { ...validOrder, payment_method_rate: 2.5 },
          'payment_method_rate',
          2.5,
        ],
        ['installment', { ...validOrder, installment: 3 }, 'installment', 3],
        ['interest', { ...validOrder, interest: 15.75 }, 'interest', 15.75],
      ])('should accept optional %s', (_, input, field, expected) => {
        const result = PostOrderSchema.parse(input);
        expect(result[field as keyof typeof result]).toBe(expected);
      });
    });

    describe('price_table_id validation', () => {
      test.each([
        ['price_table_id = 1', { ...validOrder, price_table_id: 1 }],
        ['price_table_id = 6', { ...validOrder, price_table_id: 6 }],
        ['price_table_id = 12', { ...validOrder, price_table_id: 12 }],
      ])('should accept valid %s', (_, input) => {
        expect(() => PostOrderSchema.parse(input)).not.toThrow();
      });

      it('should reject price_table_id = 0 with custom message', () => {
        const input = { ...validOrder, price_table_id: 0 };
        expect(() => PostOrderSchema.parse(input)).toThrow(
          'A tabela de preços deve ser entre 1 e 12.',
        );
      });

      it('should reject price_table_id = 13 with custom message', () => {
        const input = { ...validOrder, price_table_id: 13 };
        expect(() => PostOrderSchema.parse(input)).toThrow(
          'A tabela de preços deve ser entre 1 e 12.',
        );
      });

      it('should reject price_table_id = -1 with custom message', () => {
        const input = { ...validOrder, price_table_id: -1 };
        expect(() => PostOrderSchema.parse(input)).toThrow(
          'A tabela de preços deve ser entre 1 e 12.',
        );
      });

      it('should reject price_table_id = 100 with custom message', () => {
        const input = { ...validOrder, price_table_id: 100 };
        expect(() => PostOrderSchema.parse(input)).toThrow(
          'A tabela de preços deve ser entre 1 e 12.',
        );
      });
    });

    describe('products_sold validation', () => {
      test.each([
        [
          'multiple products',
          {
            ...validOrder,
            products_sold: [
              { product_id: 1, quantity: 2 },
              { product_id: 2, quantity: 1, variant_id: 5 },
            ],
          },
        ],
        ['empty array', { ...validOrder, products_sold: [] }],
      ])('should accept %s', (_, input) => {
        expect(() => PostOrderSchema.parse(input)).not.toThrow();
      });

      test.each([
        [
          'invalid quantity',
          { ...validOrder, products_sold: [{ product_id: 1, quantity: 0 }] },
        ],
      ])('should reject %s', (_, input) => {
        expect(() => PostOrderSchema.parse(input)).toThrow();
      });
    });

    describe('type validation', () => {
      test.each([
        ['non-string date', { ...validOrder, date: 20240115 }],
        ['non-string hour', { ...validOrder, hour: 143000 }],
      ])('should reject order with %s', (_, input) => {
        expect(() => PostOrderSchema.parse(input)).toThrow();
      });
    });
  });

  describe('PostOrderDto class', () => {
    it('should have static schema property', () => {
      expect(PostOrderDto.schema).toBe(PostOrderSchema);
    });

    it('should create instance with valid data', () => {
      const dto = new PostOrderDto();
      dto.date = '2024-01-15';
      dto.hour = '14:30:00';
      dto.payment_method = 'credit';
      dto.payment_date = '2024-01-15';
      expect(dto.date).toBe('2024-01-15');
      expect(dto.payment_method).toBe('credit');
    });
  });
});
