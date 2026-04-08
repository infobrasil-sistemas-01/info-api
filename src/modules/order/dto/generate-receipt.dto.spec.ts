import {
  GenerateReceiptDto,
  GenerateReceiptSchema,
} from './generate-receipt.dto';

describe('GenerateReceiptDto', () => {
  describe('GenerateReceiptSchema', () => {
    describe('email validation', () => {
      test.each([
        [
          'standard email',
          { email: 'customer@example.com' },
          'customer@example.com',
        ],
        [
          'subdomain email',
          { email: 'user@mail.example.com' },
          'user@mail.example.com',
        ],
      ])('should accept %s', (_, input, expectedEmail) => {
        const result = GenerateReceiptSchema.parse(input);
        expect(result.email).toBe(expectedEmail);
      });

      test.each([
        ['invalid format', { email: 'not-an-email' }],
        ['no @ symbol', { email: 'userexample.com' }],
        ['missing email', {}],
        ['empty string', { email: '' }],
      ])('should reject %s', (_, input) => {
        expect(() => GenerateReceiptSchema.parse(input)).toThrow();
      });
    });

    describe('cpf validation', () => {
      test.each([
        [
          'numeric cpf',
          { email: 'customer@example.com', cpf: '12345678909' },
          '12345678909',
        ],
        [
          'formatted cpf',
          { email: 'customer@example.com', cpf: '123.456.789-09' },
          '123.456.789-09',
        ],
        ['missing cpf', { email: 'customer@example.com' }, undefined],
        ['empty cpf', { email: 'customer@example.com', cpf: '' }, ''],
      ])('should parse cpf %s to %s', (_, input, expectedCpf) => {
        const result = GenerateReceiptSchema.parse(input);
        expect(result.cpf).toBe(expectedCpf);
      });
    });
  });

  describe('GenerateReceiptDto class', () => {
    it('should have static schema property', () => {
      expect(GenerateReceiptDto.schema).toBe(GenerateReceiptSchema);
    });

    it('should create instance with email and cpf', () => {
      const dto = new GenerateReceiptDto();
      dto.email = 'test@example.com';
      dto.cpf = '123';
      expect(dto.email).toBe('test@example.com');
      expect(dto.cpf).toBe('123');
    });

    it('should allow undefined cpf', () => {
      const dto = new GenerateReceiptDto();
      dto.email = 'test@example.com';
      expect(dto.cpf).toBeUndefined();
    });
  });
});
