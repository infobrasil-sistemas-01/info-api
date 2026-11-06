import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const ProductionOrderQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).optional(),
  storeId: z.coerce.number().int().optional(),
  statusId: z.coerce.number().int().optional(),
  productCode: z.string().optional(),
  productionOrderNumber: z.coerce.number().int().optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido de data. Use YYYY-MM-DD')
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido de data. Use YYYY-MM-DD')
    .optional(),
  startDateBaixa: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido de data. Use YYYY-MM-DD')
    .optional(),
  endDateBaixa: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido de data. Use YYYY-MM-DD')
    .optional(),
});

export class ProductionOrderQueryDto extends ZodDto(
  ProductionOrderQuerySchema,
) {
  @ApiPropertyOptional({ description: 'Página atual', example: 1 })
  page?: number;

  @ApiPropertyOptional({ description: 'Itens por página', example: 10 })
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Código da loja (LOJ_CODIGO)',
    example: 1,
  })
  storeId?: number;

  @ApiPropertyOptional({
    description: 'Código da situação (SIT_CODIGO)',
    example: 1,
  })
  statusId?: number;

  @ApiPropertyOptional({
    description: 'Código do produto produzido (PRO_CODIGO)',
    example: '00000000000001',
  })
  productCode?: string;

  @ApiPropertyOptional({
    description: 'Número da ordem de produção (ORP_NUMERO)',
    example: 201,
  })
  productionOrderNumber?: number;

  @ApiPropertyOptional({
    description: 'Data de cadastro inicial (YYYY-MM-DD)',
    example: '2026-01-01',
  })
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data de cadastro final (YYYY-MM-DD)',
    example: '2026-01-31',
  })
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Data de baixa inicial (YYYY-MM-DD)',
    example: '2026-01-01',
  })
  startDateBaixa?: string;

  @ApiPropertyOptional({
    description: 'Data de baixa final (YYYY-MM-DD)',
    example: '2026-01-31',
  })
  endDateBaixa?: string;
}

export const GetProductionOrderByIdQuerySchema = z.object({
  storeId: z.coerce.number().int().optional(),
});

export class GetProductionOrderByIdQueryDto extends ZodDto(
  GetProductionOrderByIdQuerySchema,
) {
  @ApiPropertyOptional({
    description: 'Código da loja (LOJ_CODIGO)',
    example: 1,
  })
  storeId?: number;
}

