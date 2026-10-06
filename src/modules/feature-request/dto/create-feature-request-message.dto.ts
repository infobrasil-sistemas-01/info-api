import { ApiProperty } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const CreateFeatureRequestMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'A mensagem não pode ser vazia')
    .max(5000, 'A mensagem não pode ultrapassar 5.000 caracteres'),
});

export class CreateFeatureRequestMessageDto extends ZodDto(
  CreateFeatureRequestMessageSchema,
) {
  @ApiProperty({
    example: 'Poderiam confirmar se esse endpoint também atenderá a devoluções de troca rápida?',
    description: 'Texto da mensagem enviada na conversa do ticket',
  })
  message!: string;
}
