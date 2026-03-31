import { ZodDto } from 'src/common/validation/zod-dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import z from 'zod';

export const SoldProductSchema = z.object({
  product_id: z.number(),
  quantity: z.number(),
  original_price: z.number(),
  variant_id: z.number().optional(),
});

export class SoldProductDto extends ZodDto(SoldProductSchema) {
  @ApiProperty({ description: 'ID do produto' })
  product_id: number;

  @ApiProperty({ description: 'Quantidade vendida' })
  quantity: number;

  @ApiProperty({ description: 'Preço original' })
  original_price: number;

  @ApiPropertyOptional({ description: 'ID da variante do produto' })
  variant_id?: number;
}
