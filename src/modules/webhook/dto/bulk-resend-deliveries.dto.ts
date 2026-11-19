import { ApiProperty } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const BulkResendDeliveriesSchema = z.object({
  deliveryIds: z
    .array(z.string().uuid('Cada ID de entrega deve ser um UUID válido'))
    .min(1, 'Selecione ao menos uma entrega para reenviar')
    .max(100, 'Limite máximo de 100 entregas por requisição de reenvio em massa'),
});

export class BulkResendDeliveriesDto extends ZodDto(BulkResendDeliveriesSchema) {
  @ApiProperty({
    type: [String],
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    description: 'Lista de IDs (UUID) das entregas de webhook a serem reenfileiradas',
  })
  deliveryIds!: string[];
}
