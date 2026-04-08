import { SoldProductDto, SoldProductSchema } from './sold-product.dto';

describe('SoldProductDto', () => {
  describe('SoldProductSchema', () => {
    describe('product_id validation', () => {
      test.each`
        input                             | expected
        ${{ product_id: 1, quantity: 5 }} | ${1}
      `('should accept valid product_id $input', ({ input, expected }) => {
        const result = SoldProductSchema.parse(input);
        expect(result.product_id).toBe(expected);
      });

      test.each`
        input
        ${{ quantity: 5 }}
        ${{ product_id: 'abc', quantity: 5 }}
      `('should reject invalid product_id $input', ({ input }) => {
        expect(() => SoldProductSchema.parse(input)).toThrow();
      });
    });

    describe('quantity validation', () => {
      test.each`
        input                                | expected
        ${{ product_id: 1, quantity: 1 }}    | ${1}
        ${{ product_id: 1, quantity: 1000 }} | ${1000}
      `('should accept quantity $quantity', ({ input, expected }) => {
        const result = SoldProductSchema.parse(input);
        expect(result.quantity).toBe(expected);
      });

      test.each`
        input
        ${{ product_id: 1, quantity: 0 }}
        ${{ product_id: 1, quantity: -1 }}
        ${{ product_id: 1 }}
        ${{ product_id: 1, quantity: 'five' }}
      `('should reject invalid quantity $input', ({ input }) => {
        expect(() => SoldProductSchema.parse(input)).toThrow();
      });
    });

    describe('variant_id validation', () => {
      test.each`
        input                                             | expected
        ${{ product_id: 1, quantity: 5, variant_id: 10 }} | ${10}
        ${{ product_id: 1, quantity: 5, variant_id: 0 }}  | ${0}
        ${{ product_id: 1, quantity: 5 }}                 | ${undefined}
      `('should parse variant_id correctly', ({ input, expected }) => {
        const result = SoldProductSchema.parse(input);
        expect(result.variant_id).toBe(expected);
      });

      test.each`
        input
        ${{ product_id: 1, quantity: 5, variant_id: 'ten' }}
      `('should reject invalid variant_id $input', ({ input }) => {
        expect(() => SoldProductSchema.parse(input)).toThrow();
      });
    });
  });

  describe('SoldProductDto class', () => {
    test.each`
      description                           | value
      ${'has static schema property'}       | ${SoldProductSchema}
      ${'creates instance with valid data'} | ${{ product_id: 1, quantity: 5, variant_id: 10 }}
    `('should $description', ({ value }) => {
      if (typeof value === 'object' && 'parse' in value) {
        expect(SoldProductDto.schema).toBe(value);
      } else {
        const dto = new SoldProductDto();
        Object.assign(dto, value);
        expect(dto.product_id).toBe(value.product_id);
        expect(dto.quantity).toBe(value.quantity);
        expect(dto.variant_id).toBe(value.variant_id);
      }
    });
  });
});
