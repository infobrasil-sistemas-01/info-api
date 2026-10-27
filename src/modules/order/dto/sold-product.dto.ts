import { ZodDto } from 'src/common/validation/zod-dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import z from 'zod';

export const SoldProductSchema = z.object({
  product_id: z.number(),
  quantity: z.number().gt(0, 'Quantity must be greater than 0'),
  variant_id: z.number().optional(),
});

export class SoldProductDto extends ZodDto(SoldProductSchema) {
  @ApiProperty({ description: 'ID do produto', example: 101 })
  product_id: number;

  @ApiProperty({ description: 'Quantidade vendida', example: 2 })
  quantity: number;

  @ApiPropertyOptional({
    description: 'ID da variante do produto',
    example: 1,
  })
  variant_id?: number;
}
