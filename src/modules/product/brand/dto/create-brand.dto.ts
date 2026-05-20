import { ApiProperty } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const CreateBrandSchema = z.object({
  MAR_DESCRICAO: z
    .string()
    .min(1, 'A descrição da marca é obrigatória.')
    .max(40, 'A descrição da marca deve ter no máximo 40 caracteres.'),
});

export class CreateBrandDto extends ZodDto(CreateBrandSchema) {
  @ApiProperty({ description: 'Descrição da marca', example: 'Marca Exemplo' })
  MAR_DESCRICAO: string;
}
