import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const GetSuppliersQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  pageSize: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
  situation: z.enum(['A', 'I']).optional(),
  storeId: z.coerce.number().optional(),
});

export class GetSuppliersQueryDto extends ZodDto(GetSuppliersQuerySchema) {
  @ApiPropertyOptional({ description: 'Página atual', example: 1 })
  page?: number;

  @ApiPropertyOptional({ description: 'Itens por página', example: 10 })
  pageSize?: number;

  @ApiPropertyOptional({ description: 'Busca por nome ou fantasia' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Situação do fornecedor',
    enum: ['A', 'I'],
  })
  situation?: 'A' | 'I';

  @ApiPropertyOptional({ description: 'ID da loja' })
  storeId?: number;
}
