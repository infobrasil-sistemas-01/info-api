import { ZodValidationPipe } from './zod-validation.pipe';
import { z } from 'zod';
import { BadRequestException } from '@nestjs/common';

describe('ZodValidationPipe', () => {
  let pipe: ZodValidationPipe;

  const TestSchema = z.object({
    name: z.string(),
    age: z.coerce.number().optional(),
  });

  class TestDto {
    static schema = TestSchema;
  }

  beforeEach(() => {
    pipe = new ZodValidationPipe();
  });

  it('should pass validation and return parsed value when inputs are correct', () => {
    const value = { name: 'John Doe', age: '30' };
    const metadata = { type: 'body', metatype: TestDto } as any;

    const result = pipe.transform(value, metadata);

    expect(result).toEqual({ name: 'John Doe', age: 30 });
  });

  it('should ignore and strip extra fields when metadata.type is body', () => {
    const value = { name: 'John Doe', age: '30', extraField: 'should be stripped' };
    const metadata = { type: 'body', metatype: TestDto } as any;

    const result = pipe.transform(value, metadata);

    expect(result).toEqual({ name: 'John Doe', age: 30 });
  });

  it('should throw BadRequestException when validation fails on required fields', () => {
    const value = { age: '30' }; // missing required 'name'
    const metadata = { type: 'body', metatype: TestDto } as any;

    expect(() => pipe.transform(value, metadata)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException with custom message for unrecognized keys when metadata.type is query', () => {
    const value = { name: 'John Doe', pagina: '2', limite: '10' };
    const metadata = { type: 'query', metatype: TestDto } as any;

    try {
      pipe.transform(value, metadata);
      fail('Should have thrown BadRequestException');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      const response = (error as BadRequestException).getResponse() as any;
      expect(response.message).toBe('Validation failed');
      expect(response.errors).toEqual([
        {
          path: 'pagina',
          message:
            "O parâmetro 'pagina' não existe nesta consulta. Por favor, consulte a documentação da API para verificar os parâmetros válidos (e evite usar o Google Tradutor).",
        },
        {
          path: 'limite',
          message:
            "O parâmetro 'limite' não existe nesta consulta. Por favor, consulte a documentação da API para verificar os parâmetros válidos (e evite usar o Google Tradutor).",
        },
      ]);
    }
  });

  it('should bypass validation and return original value if metatype does not have static schema', () => {
    const value = { someField: 'any value' };
    const metadata = { type: 'body', metatype: class NonZodDto {} } as any;

    const result = pipe.transform(value, metadata);

    expect(result).toBe(value);
  });
});
