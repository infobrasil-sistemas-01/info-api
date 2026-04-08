import { ZodDto } from './zod-dto';
import { z } from 'zod';

describe('ZodDto', () => {
  const TestSchema = z.object({
    name: z.string(),
    age: z.number(),
  });

  class TestDto extends ZodDto(TestSchema) {
    name: string;
    age: number;
  }

  describe('schema property', () => {
    test.each`
      description                            | schema
      ${'has static schema referencing zod'} | ${TestSchema}
    `('should $description', ({ schema }) => {
      expect(TestDto.schema).toBe(schema);
    });
  });

  describe('instantiation', () => {
    test.each`
      name      | age
      ${'John'} | ${30}
      ${'Jane'} | ${25}
    `('should create instance with name=$name, age=$age', ({ name, age }) => {
      const dto = new TestDto();
      dto.name = name;
      dto.age = age;
      expect(dto.name).toBe(name);
      expect(dto.age).toBe(age);
    });
  });

  describe('type inference', () => {
    test.each`
      description                      | data
      ${'valid data parses correctly'} | ${{ name: 'John', age: 30 }}
      ${'invalid string fails'}        | ${{ name: 123, age: 25 }}
    `('should handle $description', ({ data }) => {
      if (typeof data.name === 'string') {
        const result = TestSchema.parse(data);
        expect(result.name).toBe(data.name);
      } else {
        expect(() => TestSchema.parse(data)).toThrow();
      }
    });
  });
});
