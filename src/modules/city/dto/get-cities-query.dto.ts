import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const GetCitiesQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  pageSize: z.coerce.number().min(1).optional(),
  search: z.string().optional(),
  stateId: z.coerce.number().int().optional(),
});

export class GetCitiesQueryDto extends ZodDto(GetCitiesQuerySchema) {
  @ApiPropertyOptional({ description: 'Página atual', example: 1, default: 1 })
  page?: number;

  @ApiPropertyOptional({
    description: 'Quantidade de registros por página',
    example: 100,
    default: 100,
  })
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Termo de busca textual para filtrar pelo nome do município',
    example: 'FORTALEZA',
  })
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrar pelo código do estado (EST_CODIGO)',
    example: 23,
  })
  stateId?: number;
}
