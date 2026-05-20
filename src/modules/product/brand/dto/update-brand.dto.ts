import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const UpdateBrandSchema = z.object({
  MAR_DESCRICAO: z
    .string()
    .min(1, 'A descrição da marca não pode ser vazia.')
    .max(40, 'A descrição da marca deve ter no máximo 40 caracteres.')
    .optional(),
});

export class UpdateBrandDto extends ZodDto(UpdateBrandSchema) {
  @ApiPropertyOptional({
    description: 'Descrição da marca',
    example: 'Marca Atualizada',
  })
  MAR_DESCRICAO?: string;
}
