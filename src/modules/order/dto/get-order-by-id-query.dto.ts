import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const GetOrderByIdQuerySchema = z.object({
  storeId: z.coerce.number().int().optional(),
});

export class GetOrderByIdQueryDto extends ZodDto(GetOrderByIdQuerySchema) {
  @ApiPropertyOptional({ description: 'ID da loja (LOJ_CODIGO)' })
  storeId?: number;
}
