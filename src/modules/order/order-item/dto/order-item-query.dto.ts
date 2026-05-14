import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const GetOrderItemsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
  pageSize: z.coerce.number().min(1).default(50).optional(),
  orderId: z.coerce.number().optional(),
  productId: z.coerce.number().optional(),
  brandId: z.coerce.number().optional(),
  groupId: z.coerce.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export class GetOrderItemsQueryDto extends ZodDto(GetOrderItemsQuerySchema) {
  @ApiPropertyOptional({ description: 'Página atual', example: 1, default: 1 })
  page?: number;

  @ApiPropertyOptional({ description: 'Itens por página', example: 10, default: 10 })
  pageSize?: number;

  @ApiPropertyOptional({ description: 'ID da venda (VEN_NUMERO)' })
  orderId?: number;

  @ApiPropertyOptional({ description: 'ID do produto (PRO_CODIGO)' })
  productId?: number;

  @ApiPropertyOptional({ description: 'ID da marca (MAR_CODIGO)' })
  brandId?: number;

  @ApiPropertyOptional({ description: 'ID do grupo (GRU_CODIGO)' })
  groupId?: number;

  @ApiPropertyOptional({ description: 'Data inicial (YYYY-MM-DD)' })
  startDate?: string;

  @ApiPropertyOptional({ description: 'Data final (YYYY-MM-DD)' })
  endDate?: string;
}
