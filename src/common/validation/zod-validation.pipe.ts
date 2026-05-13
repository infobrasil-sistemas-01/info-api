import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodError } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    // Verifica se o DTO possui um schema estático (padrao ZodDto)
    if (metatype && (metatype as any).schema) {
      try {
        const parsedValue = (metatype as any).schema.parse(value);
        return parsedValue;
      } catch (error) {
        const issues = error instanceof ZodError ? error.issues : [];
        if (issues.length > 0) {
          throw new BadRequestException({
            message: 'Validation failed',
            errors: issues.map((err) => ({
              path: err.path.join('.'),
              message: err.message,
            })),
          });
        }
        throw new BadRequestException('Validation failed');
      }
    }

    return value;
  }
}
