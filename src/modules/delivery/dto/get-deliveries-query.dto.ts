import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const GetDeliveriesQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  pageSize: z.coerce.number().min(1).max(100).optional(),
  storeId: z.coerce.number().min(1).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato deve ser YYYY-MM-DD').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato deve ser YYYY-MM-DD').optional(),
  situation: z.coerce.number().optional(),
  vehiclePlate: z.string().max(8).optional(),
  providerId: z.coerce.number().optional(),
});

export class GetDeliveriesQueryDto extends ZodDto(GetDeliveriesQuerySchema) {
  @ApiPropertyOptional({ description: 'Página atual', example: 1 })
  page?: number;

  @ApiPropertyOptional({ description: 'Itens por página', example: 10 })
  pageSize?: number;

  @ApiPropertyOptional({ description: 'ID da loja (LOJ_CODIGO)', example: 1 })
  storeId?: number;

  @ApiPropertyOptional({ description: 'Data inicial (YYYY-MM-DD)', example: '2026-05-01' })
  startDate?: string;

  @ApiPropertyOptional({ description: 'Data final (YYYY-MM-DD)', example: '2026-05-31' })
  endDate?: string;

  @ApiPropertyOptional({ description: 'Código da situação (SIT_CODIGO)', example: 1 })
  situation?: number;

  @ApiPropertyOptional({ description: 'Placa do veículo (VEI_PLACA)', example: 'ABC-1234' })
  vehiclePlate?: string;

  @ApiPropertyOptional({ description: 'Código do prestador (PRE_CODIGO)', example: 1 })
  providerId?: number;
}
