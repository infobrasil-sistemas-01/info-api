import { PostOrderDto, PostOrderSchema } from './create-order.dto';

describe('PostOrderDto', () => {
  describe('PostOrderSchema', () => {
    const validOrder = {
      id: 1,
      date: '2024-01-15',
      hour: '14:30:00',
      payment_method: 'credit',
      payment_date: '2024-01-15',
      has_payment: true,
      has_invoice: false,
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
          'without id',
          {
            date: '2024-01-15',
            hour: '14:30:00',
            payment_method: 'credit',
            payment_date: '2024-01-15',
            has_payment: true,
            has_invoice: false,
          },
        ],
        [
          'without date',
          {
            id: 1,
            hour: '14:30:00',
            payment_method: 'credit',
            payment_date: '2024-01-15',
            has_payment: true,
            has_invoice: false,
          },
        ],
        [
          'without hour',
          {
            id: 1,
            date: '2024-01-15',
            payment_method: 'credit',
            payment_date: '2024-01-15',
            has_payment: true,
            has_invoice: false,
          },
        ],
        [
          'without payment_method',
          {
            id: 1,
            date: '2024-01-15',
            hour: '14:30:00',
            payment_date: '2024-01-15',
            has_payment: true,
            has_invoice: false,
          },
        ],
        [
          'without payment_date',
          {
            id: 1,
            date: '2024-01-15',
            hour: '14:30:00',
            payment_method: 'credit',
            has_payment: true,
            has_invoice: false,
          },
        ],
        [
          'without has_payment',
          {
            id: 1,
            date: '2024-01-15',
            hour: '14:30:00',
            payment_method: 'credit',
            payment_date: '2024-01-15',
            has_invoice: false,
          },
        ],
        [
          'without has_invoice',
          {
            id: 1,
            date: '2024-01-15',
            hour: '14:30:00',
            payment_method: 'credit',
            payment_date: '2024-01-15',
            has_payment: true,
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
        ['non-number id', { ...validOrder, id: 'one' }],
        ['non-string date', { ...validOrder, date: 20240115 }],
        ['non-string hour', { ...validOrder, hour: 143000 }],
        ['non-boolean has_payment', { ...validOrder, has_payment: 'yes' }],
        ['non-boolean has_invoice', { ...validOrder, has_invoice: 1 }],
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
      dto.id = 1;
      dto.date = '2024-01-15';
      dto.hour = '14:30:00';
      dto.payment_method = 'credit';
      dto.payment_date = '2024-01-15';
      dto.has_payment = true;
      dto.has_invoice = false;
      expect(dto.id).toBe(1);
      expect(dto.has_payment).toBe(true);
    });
  });
});
