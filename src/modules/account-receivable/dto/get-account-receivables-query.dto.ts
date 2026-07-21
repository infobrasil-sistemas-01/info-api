import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const GetAccountReceivablesQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  pageSize: z.coerce.number().min(1).max(100).optional(),
  storeId: z.coerce.number().optional(),
  clientId: z.coerce.number().optional(),
  arId: z.coerce.number().optional(),
  situation: z.enum(['A', 'L']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export class GetAccountReceivablesQueryDto extends ZodDto(
  GetAccountReceivablesQuerySchema,
) {
  @ApiPropertyOptional({ description: 'Página atual', example: 1 })
  page?: number;

  @ApiPropertyOptional({ description: 'Itens por página', example: 10 })
  pageSize?: number;

  @ApiPropertyOptional({ description: 'ID da loja (LOJ_CODIGO)' })
  storeId?: number;

  @ApiPropertyOptional({ description: 'ID do cliente (CLI_CODIGO)' })
  clientId?: number;

  @ApiPropertyOptional({ description: 'ID da conta a receber (REC_NUMERO)' })
  arId?: number;

  @ApiPropertyOptional({
    description: 'Situação da conta a receber (A - Aberto, L - Liquidado)',
    enum: ['A', 'L'],
  })
  situation?: 'A' | 'L';

  @ApiPropertyOptional({
    description: 'Data de vencimento inicial (YYYY-MM-DD)',
  })
  startDate?: string;

  @ApiPropertyOptional({ description: 'Data de vencimento final (YYYY-MM-DD)' })
  endDate?: string;
}
