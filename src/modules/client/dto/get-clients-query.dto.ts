import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const GetClientsQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  pageSize: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
  situation: z.enum(['A', 'I']).optional(),
  birthdate: z.string().optional(),
});

export class GetClientsQueryDto extends ZodDto(GetClientsQuerySchema) {
  @ApiPropertyOptional({ description: 'Página atual', example: 1 })
  page?: number;

  @ApiPropertyOptional({ description: 'Itens por página', example: 10 })
  pageSize?: number;

  @ApiPropertyOptional({ description: 'Busca por nome ou fantasia' })
  search?: string;

  @ApiPropertyOptional({ description: 'Situação do cliente', enum: ['A', 'I'] })
  situation?: 'A' | 'I';

  @ApiPropertyOptional({ description: 'Data de nascimento (AAAA-MM-DD)' })
  birthdate?: string;
}
