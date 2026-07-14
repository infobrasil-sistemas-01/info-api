import { z } from 'zod';
import './zod-error-map';

describe('zod-error-map', () => {
  it('should translate invalid_type (required field) to pt-BR', () => {
    const schema = z.object({
      name: z.string(),
    });

    const result = schema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Tipo inválido: esperado string, recebido undefined',
      );
    }
  });

  it('should translate invalid_type (wrong type) to pt-BR', () => {
    const schema = z.object({
      age: z.number(),
    });

    const result = schema.safeParse({ age: 'thirty' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Tipo inválido: esperado número, recebido string',
      );
    }
  });

  it('should translate too_small for string length', () => {
    const schema = z.string().min(5);
    const result = schema.safeParse('abc');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Muito pequeno: esperado que string tivesse >=5 caracteres',
      );
    }
  });

  it('should translate too_big for numbers', () => {
    const schema = z.number().max(10);
    const result = schema.safeParse(15);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Muito grande: esperado que number fosse <=10',
      );
    }
  });
});
