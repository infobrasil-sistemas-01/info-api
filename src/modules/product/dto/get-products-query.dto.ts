import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const GetProductsQuerySchema = z.object({
  storeId: z.coerce.number().int(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
  priceTable: z.coerce.number().int().min(1).max(12).optional(),
  group: z.coerce.number().int().optional(),
  brand: z.coerce.number().int().optional(),
  minStock: z.coerce.number().optional(),
  search: z.string().optional(),
});

export class GetProductsQueryDto extends ZodDto(GetProductsQuerySchema) {
  @ApiProperty({ description: 'Código da loja para buscar os estoques dos produtos', example: 1 })
  storeId!: number;

  @ApiPropertyOptional({ description: 'Página atual', example: 1 })
  page?: number;

  @ApiPropertyOptional({ description: 'Itens por página', example: 10 })
  pageSize?: number;

  @ApiPropertyOptional({ description: 'Código da tabela de preço para buscar os preços dos produtos', example: 1 })
  priceTable?: number;

  @ApiPropertyOptional({ description: 'Código do grupo para filtrar produtos' })
  group?: number;

  @ApiPropertyOptional({ description: 'Código da marca para filtrar produtos' })
  brand?: number;

  @ApiPropertyOptional({ description: 'Quantidade mínima em estoque para filtrar produtos' })
  minStock?: number;

  @ApiPropertyOptional({ description: 'Termo de busca para filtrar produtos por descrição' })
  search?: string;
}
