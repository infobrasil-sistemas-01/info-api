import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const GetDeliveryByIdQuerySchema = z.object({
  storeId: z.coerce.number().int().optional(),
});

export class GetDeliveryByIdQueryDto extends ZodDto(
  GetDeliveryByIdQuerySchema,
) {
  @ApiPropertyOptional({
    description: 'Código da loja para buscar os estoques dos produtos',
    example: 1,
  })
  storeId?: number;
}
