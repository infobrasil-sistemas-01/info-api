import { ApiProperty } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const RespondFeatureRequestSchema = z.object({
  responseText: z
    .string()
    .min(2, 'A resposta deve conter ao menos 2 caracteres')
    .max(5000, 'A resposta não pode ultrapassar 5.000 caracteres'),
});

export class RespondFeatureRequestDto extends ZodDto(
  RespondFeatureRequestSchema,
) {
  @ApiProperty({
    example: 'Funcionalidade analisada e incluída no roadmap da versão 2.4.',
    description: 'Parecer ou resposta da equipe administrativa à solicitação',
  })
  responseText!: string;
}
