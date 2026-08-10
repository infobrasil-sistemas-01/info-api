import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const CallCenterQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  pageSize: z.coerce.number().min(1).max(100).optional(),
  clientId: z.coerce.number().optional(),
  userId: z.coerce.number().optional(),
  status: z.string().max(1).optional(),
  storeId: z.coerce.number().optional(),
  sellerId: z.coerce.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export class CallCenterQueryDto extends ZodDto(CallCenterQuerySchema) {
  @ApiPropertyOptional({
    description: 'Página atual',
    default: 1,
    type: Number,
  })
  page?: number;

  @ApiPropertyOptional({
    description: 'Registros por página',
    default: 100,
    type: Number,
  })
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Código do cliente (CLI_CODIGO)',
    type: Number,
  })
  clientId?: number;

  @ApiPropertyOptional({
    description: 'Código do usuário (USU_CODIGO)',
    type: Number,
  })
  userId?: number;

  @ApiPropertyOptional({
    description: 'Status do call center (CAL_STATUS - ex: P, F)',
    type: String,
  })
  status?: string;

  @ApiPropertyOptional({
    description: 'Código da loja (LOJ_CODIGO)',
    type: Number,
  })
  storeId?: number;

  @ApiPropertyOptional({
    description: 'Número do vendedor/representante (VEN_NUMERO)',
    type: Number,
  })
  sellerId?: number;

  @ApiPropertyOptional({
    description: 'Data de atendimento inicial (YYYY-MM-DD)',
    type: String,
  })
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data de atendimento final (YYYY-MM-DD)',
    type: String,
  })
  endDate?: string;
}
