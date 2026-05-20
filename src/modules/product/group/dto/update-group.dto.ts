import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const UpdateGroupSchema = z.object({
  GRU_DESCRICAO: z
    .string()
    .min(1, 'A descrição do grupo não pode ser vazia.')
    .max(40, 'A descrição do grupo deve ter no máximo 40 caracteres.')
    .optional(),
});

export class UpdateGroupDto extends ZodDto(UpdateGroupSchema) {
  @ApiPropertyOptional({
    description: 'Descrição do grupo',
    example: 'Grupo Atualizado',
  })
  GRU_DESCRICAO?: string;
}
