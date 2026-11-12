import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const GetProductStockQuerySchema = z.object({
  storeId: z.coerce.number().int().optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).optional(),
  search: z.string().optional(),
  startDateAlteracao: z.string().optional(),
  endDateAlteracao: z.string().optional(),
});

export class GetProductStockQueryDto extends ZodDto(
  GetProductStockQuerySchema,
) {
  @ApiPropertyOptional({
    description:
      'Código da loja para filtrar apenas estoques da loja especificada (opcional; se omitido, retorna todas as lojas)',
    example: 1,
  })
  storeId?: number;

  @ApiPropertyOptional({ description: 'Página atual (padrão: 1)', example: 1 })
  page?: number;

  @ApiPropertyOptional({
    description: 'Itens por página (padrão: 50)',
    example: 50,
  })
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Termo de busca para filtrar produtos por descrição',
    example: 'Arroz',
  })
  search?: string;

  @ApiPropertyOptional({
    description: 'Data inicial para filtrar produtos por data de alteração (YYYY-MM-DD)',
    example: '2026-01-01',
  })
  startDateAlteracao?: string;

  @ApiPropertyOptional({
    description: 'Data final para filtrar produtos por data de alteração (YYYY-MM-DD)',
    example: '2026-12-31',
  })
  endDateAlteracao?: string;
}

