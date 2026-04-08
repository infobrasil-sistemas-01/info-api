import { paginationQuerySchema, PaginationQuery } from './pagination.schema';

describe('paginationQuerySchema', () => {
  describe('page parameter', () => {
    test.each`
      input            | expected
      ${{ page: 1 }}   | ${1}
      ${{ page: '5' }} | ${5}
      ${{}}            | ${1}
    `('should parse page $input to $expected', ({ input, expected }) => {
      const result = paginationQuerySchema.parse(input);
      expect(result.page).toBe(expected);
    });

    test.each`
      input
      ${{ page: 0 }}
      ${{ page: -1 }}
      ${{ page: 1.5 }}
    `('should reject invalid page $input', ({ input }) => {
      expect(() => paginationQuerySchema.parse(input)).toThrow();
    });
  });

  describe('pageSize parameter', () => {
    test.each`
      input                 | expected
      ${{ pageSize: 20 }}   | ${20}
      ${{ pageSize: '10' }} | ${10}
      ${{}}                 | ${20}
    `('should parse pageSize $input to $expected', ({ input, expected }) => {
      const result = paginationQuerySchema.parse(input);
      expect(result.pageSize).toBe(expected);
    });

    test.each`
      input
      ${{ pageSize: 0 }}
      ${{ pageSize: 51 }}
    `('should reject invalid pageSize $input', ({ input }) => {
      expect(() => paginationQuerySchema.parse(input)).toThrow();
    });
  });

  describe('both parameters together', () => {
    test.each`
      input                            | pageResult | pageSizeResult
      ${{ page: 3, pageSize: 25 }}     | ${3}       | ${25}
      ${{ page: '2', pageSize: '15' }} | ${2}       | ${15}
    `(
      'should parse $input to page=$pageResult, pageSize=$pageSizeResult',
      ({ input, pageResult, pageSizeResult }) => {
        const result = paginationQuerySchema.parse(input);
        expect(result.page).toBe(pageResult);
        expect(result.pageSize).toBe(pageSizeResult);
      },
    );
  });
});
