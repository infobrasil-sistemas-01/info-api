import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const GetOrderMetricsQuerySchema = z
  .object({
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido de data. Use YYYY-MM-DD'),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido de data. Use YYYY-MM-DD'),
    storeId: z.coerce.number().int().optional(),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message:
      'A data final (endDate) deve ser maior ou igual à data inicial (startDate)',
    path: ['endDate'],
  });

export class GetOrderMetricsQueryDto extends ZodDto(
  GetOrderMetricsQuerySchema,
) {
  @ApiProperty({
    description: 'Data inicial (YYYY-MM-DD)',
    example: '2026-09-01',
  })
  startDate: string;

  @ApiProperty({
    description: 'Data final (YYYY-MM-DD)',
    example: '2026-09-30',
  })
  endDate: string;

  @ApiPropertyOptional({
    description: 'ID da loja (LOJ_CODIGO)',
    example: 1,
  })
  storeId?: number;
}
