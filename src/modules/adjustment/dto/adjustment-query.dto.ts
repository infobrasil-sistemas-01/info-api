import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const AdjustmentQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).optional(),
  storeId: z.coerce.number().int().optional(),
  statusId: z.coerce.number().int().optional(),
  type: z.string().optional(),
  userId: z.coerce.number().int().optional(),
  adjustmentNumber: z.coerce.number().int().optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido de data. Use YYYY-MM-DD')
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido de data. Use YYYY-MM-DD')
    .optional(),
});

export class AdjustmentQueryDto extends ZodDto(AdjustmentQuerySchema) {
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
    description: 'Tipo de acerto (ACE_TIPO)',
    example: '1',
  })
  type?: string;

  @ApiPropertyOptional({
    description: 'Código do usuário (USU_CODIGO)',
    example: 1,
  })
  userId?: number;

  @ApiPropertyOptional({
    description: 'Número do acerto (ACE_NUMERO)',
    example: 105,
  })
  adjustmentNumber?: number;

  @ApiPropertyOptional({
    description: 'Data inicial (YYYY-MM-DD)',
    example: '2026-01-01',
  })
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data final (YYYY-MM-DD)',
    example: '2026-01-31',
  })
  endDate?: string;
}

export const GetAdjustmentByIdQuerySchema = z.object({
  storeId: z.coerce.number().int().optional(),
});

export class GetAdjustmentByIdQueryDto extends ZodDto(
  GetAdjustmentByIdQuerySchema,
) {
  @ApiPropertyOptional({
    description: 'Código da loja (LOJ_CODIGO)',
    example: 1,
  })
  storeId?: number;
}
