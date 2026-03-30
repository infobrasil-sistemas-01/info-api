import type { z } from 'zod';

export function ZodDto<TSchema extends z.ZodType<any, any, any>>(
  schema: TSchema,
) {
  abstract class ZodDtoClass {
    static schema = schema;
  }

  return ZodDtoClass as unknown as {
    new (): z.infer<TSchema>;
    schema: TSchema;
  };
}
