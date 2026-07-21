import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodError } from 'zod';
import './zod-error-map';

export class ZodValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { metatype, type } = metadata;

    // Verifica se o DTO possui um schema estático (padrao ZodDto)
    if (metatype && (metatype as any).schema) {
      try {
        let schema = (metatype as any).schema;

        // Se for um parâmetro de query, força a validação strict para rejeitar chaves extras
        if (type === 'query' && typeof schema.strict === 'function') {
          schema = schema.strict();
        }

        const parsedValue = schema.parse(value);
        return parsedValue;
      } catch (error) {
        const issues = error instanceof ZodError ? error.issues : [];
        if (issues.length > 0) {
          throw new BadRequestException({
            message: 'Validation failed',
            errors: issues.flatMap((err) => {
              if (err.code === 'unrecognized_keys') {
                const unrecognizedKeys = (err as any).keys || [];
                return unrecognizedKeys.map((key: string) => ({
                  path: key,
                  message: `O parâmetro '${key}' não existe nesta consulta. Por favor, consulte a documentação da API para verificar os parâmetros válidos (e evite usar o Google Tradutor).`,
                }));
              }
              return {
                path: err.path.join('.'),
                message: err.message,
              };
            }),
          });
        }
        throw new BadRequestException('Validation failed');
      }
    }

    return value;
  }
}
