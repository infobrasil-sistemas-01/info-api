import { PostReceiptDto, PostReceiptSchema } from './create-receipt.dto';

describe('PostReceiptDto', () => {
  describe('PostReceiptSchema', () => {
    describe('orderId validation', () => {
      test.each`
        input                  | expected
        ${{ orderId: 1 }}      | ${1}
        ${{ orderId: 999999 }} | ${999999}
        ${{ orderId: 0 }}      | ${0}
        ${{ orderId: -1 }}     | ${-1}
        ${{ orderId: 1.5 }}    | ${1.5}
      `('should accept orderId $input', ({ input, expected }) => {
        const result = PostReceiptSchema.parse(input);
        expect(result.orderId).toBe(expected);
      });

      test.each`
        input
        ${{}}
        ${{ orderId: 'one' }}
      `('should reject invalid orderId $input', ({ input }) => {
        expect(() => PostReceiptSchema.parse(input)).toThrow();
      });
    });
  });

  describe('PostReceiptDto class', () => {
    test.each`
      description            | value
      ${'has static schema'} | ${PostReceiptSchema}
      ${'creates instance'}  | ${123}
    `('should $description', ({ value }) => {
      if (typeof value === 'object' && 'parse' in value) {
        expect(PostReceiptDto.schema).toBe(value);
      } else {
        const dto = new PostReceiptDto();
        dto.orderId = value;
        expect(dto.orderId).toBe(value);
      }
    });
  });
});
