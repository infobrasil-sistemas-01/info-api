import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const GetPurchaseItemsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
  pageSize: z.coerce.number().min(1).default(10).optional(),
  purchaseId: z.coerce.number().optional(),
  productId: z.string().optional(),
  supplierId: z.coerce.number().optional(),
  storeId: z.coerce.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  invoiceNumber: z.string().optional(),
  brandId: z.coerce.number().optional(),
  groupId: z.coerce.number().optional(),
  cfop: z.coerce.number().optional(),
});

export class GetPurchaseItemsQueryDto extends ZodDto(
  GetPurchaseItemsQuerySchema,
) {
  @ApiPropertyOptional({ description: 'Página atual', example: 1, default: 1 })
  page?: number;

  @ApiPropertyOptional({
    description: 'Itens por página',
    example: 10,
    default: 10,
  })
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Número da compra / entrada (COM_NUMERO)',
    example: 10452,
  })
  purchaseId?: number;

  @ApiPropertyOptional({
    description: 'Código do produto (PRO_CODIGO)',
    example: '000000000101',
  })
  productId?: string;

  @ApiPropertyOptional({
    description: 'Código do fornecedor/credor (CRE_CODIGO)',
    example: 45,
  })
  supplierId?: number;

  @ApiPropertyOptional({
    description: 'Código da loja (LOJ_CODIGO)',
    example: 1,
  })
  storeId?: number;

  @ApiPropertyOptional({
    description: 'Data inicial de entrada (YYYY-MM-DD)',
    example: '2026-08-01',
  })
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data final de entrada (YYYY-MM-DD)',
    example: '2026-08-31',
  })
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Número da nota fiscal (COM_NUMERONF)',
    example: '00012345',
  })
  invoiceNumber?: string;

  @ApiPropertyOptional({
    description: 'Código da marca (MAR_CODIGO)',
    example: 7,
  })
  brandId?: number;

  @ApiPropertyOptional({
    description: 'Código do grupo do produto (GRU_CODIGO)',
    example: 12,
  })
  groupId?: number;

  @ApiPropertyOptional({
    description: 'CFOP do item (NAF_CFOP)',
    example: 2102,
  })
  cfop?: number;
}
