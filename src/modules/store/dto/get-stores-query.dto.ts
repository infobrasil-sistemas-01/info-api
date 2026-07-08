import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const GetStoresQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
  storeId: z.coerce.number().int().optional(),
  storeCnpj: z.string().optional(),
});

export class GetStoresQueryDto extends ZodDto(GetStoresQuerySchema) {
  @ApiPropertyOptional({ description: 'Página atual', example: 1 })
  page?: number;

  @ApiPropertyOptional({ description: 'Itens por página', example: 10 })
  pageSize?: number;

  @ApiPropertyOptional({ description: 'Código da loja para filtrar' })
  storeId?: number;

  @ApiPropertyOptional({ description: 'CNPJ da loja para filtrar' })
  storeCnpj?: string;
}
