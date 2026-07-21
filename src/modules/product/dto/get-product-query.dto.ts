import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const GetProductQuerySchema = z.object({
  priceTable: z.coerce.number().int().min(1).max(12).optional(),
  storeId: z.coerce.number().int().optional(),
});

export class GetProductQueryDto extends ZodDto(GetProductQuerySchema) {
  @ApiPropertyOptional({
    description: 'Código da tabela de preço para buscar os preços dos produtos',
    example: 1,
  })
  priceTable?: number;

  @ApiPropertyOptional({
    description: 'Código da loja para buscar os estoques dos produtos',
    example: 1,
  })
  storeId?: number;
}
