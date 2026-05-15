import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const GetEmployeesQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  pageSize: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
  situation: z.enum(['A', 'I']).optional(),
  storeId: z.coerce.number().min(1).optional(),
});

export class GetEmployeesQueryDto extends ZodDto(GetEmployeesQuerySchema) {
  @ApiPropertyOptional({ description: 'Página atual', example: 1 })
  page?: number;

  @ApiPropertyOptional({ description: 'Itens por página', example: 10 })
  pageSize?: number;

  @ApiPropertyOptional({ description: 'Busca por nome ou apelido (FUN_NOME, FUN_APELIDO)', example: 'João' })
  search?: string;

  @ApiPropertyOptional({ description: 'Situação do funcionário (FUN_SITUACAO)', enum: ['A', 'I'] })
  situation?: 'A' | 'I';

  @ApiPropertyOptional({ description: 'ID da loja (LOJ_CODIGO)', example: 1 })
  storeId?: number;
}
