import { ApiProperty } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const CreateFeatureRequestSchema = z.object({
  requestText: z
    .string()
    .min(5, 'A solicitação deve conter ao menos 5 caracteres')
    .max(5000, 'A solicitação não pode ultrapassar 5.000 caracteres'),
});

export class CreateFeatureRequestDto extends ZodDto(
  CreateFeatureRequestSchema,
) {
  @ApiProperty({
    example: 'Gostaria de solicitar a integração com a rota de listagem de devoluções.',
    description: 'Texto detalhado da funcionalidade ou melhoria solicitada',
  })
  requestText!: string;
}
