import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const GetOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
  storeId: z.coerce.number().int().optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido de data. Use YYYY-MM-DD')
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido de data. Use YYYY-MM-DD')
    .optional(),
  clientId: z.coerce.number().int().optional(),
  employeeId: z.coerce.number().int().optional(),
});

export class GetOrdersQueryDto extends ZodDto(GetOrdersQuerySchema) {
  @ApiPropertyOptional({ description: 'Página atual', example: 1 })
  page?: number;

  @ApiPropertyOptional({ description: 'Itens por página', example: 10 })
  pageSize?: number;

  @ApiPropertyOptional({ description: 'ID da loja (LOJ_CODIGO)' })
  storeId?: number;

  @ApiPropertyOptional({ description: 'Data inicial (YYYY-MM-DD)' })
  startDate?: string;

  @ApiPropertyOptional({ description: 'Data final (YYYY-MM-DD)' })
  endDate?: string;

  @ApiPropertyOptional({ description: 'ID do cliente (CLI_CODIGO)' })
  clientId?: number;

  @ApiPropertyOptional({ description: 'ID do funcionário (FUN_CODIGO)' })
  employeeId?: number;
}
