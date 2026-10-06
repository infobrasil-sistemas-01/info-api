import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const ResolveFeatureRequestSchema = z.object({
  closingMessage: z
    .string()
    .trim()
    .max(5000, 'A mensagem de encerramento não pode ultrapassar 5.000 caracteres')
    .optional(),
});

export class ResolveFeatureRequestDto extends ZodDto(
  ResolveFeatureRequestSchema,
) {
  @ApiPropertyOptional({
    example: 'Funcionalidade entregue na release v1.16.30 e disponível em produção.',
    description: 'Mensagem final de encerramento/resolução do ticket',
  })
  closingMessage?: string;
}
