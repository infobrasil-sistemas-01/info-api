import { ApiProperty } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const CreateGroupSchema = z.object({
  GRU_DESCRICAO: z
    .string()
    .min(1, 'A descrição do grupo não pode ser vazia.')
    .max(40, 'A descrição do grupo deve ter no máximo 40 caracteres.'),
});

export class CreateGroupDto extends ZodDto(CreateGroupSchema) {
  @ApiProperty({ description: 'Descrição do grupo', example: 'Grupo Novo' })
  GRU_DESCRICAO: string;
}
