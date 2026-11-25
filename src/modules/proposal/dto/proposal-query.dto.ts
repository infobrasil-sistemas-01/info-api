import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const ProposalQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).optional(),
  storeId: z.coerce.number().int().optional(),
  statusId: z.coerce.number().int().optional(),
  clientId: z.coerce.number().int().optional(),
  sellerId: z.coerce.number().int().optional(),
  proposalNumber: z.coerce.number().int().optional(),
  proGerada: z.enum(['S', 'N']).optional(),
  proStatus: z.string().max(1).optional(),
  startDate: z
    .string()
    .regex(dateRegex, 'Formato inválido de data. Use YYYY-MM-DD')
    .optional(),
  endDate: z
    .string()
    .regex(dateRegex, 'Formato inválido de data. Use YYYY-MM-DD')
    .optional(),
});

export class ProposalQueryDto extends ZodDto(ProposalQuerySchema) {
  @ApiPropertyOptional({ description: 'Página atual', example: 1 })
  page?: number;

  @ApiPropertyOptional({ description: 'Itens por página', example: 10 })
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Código da loja (LOJ_CODIGO)',
    example: 1,
  })
  storeId?: number;

  @ApiPropertyOptional({
    description: 'Código da situação (SIT_CODIGO)',
    example: 1,
  })
  statusId?: number;

  @ApiPropertyOptional({
    description: 'Código do cliente (CLI_CODIGO)',
    example: 10,
  })
  clientId?: number;

  @ApiPropertyOptional({
    description: 'Código do funcionário/vendedor (FUN_CODIGO)',
    example: 2,
  })
  sellerId?: number;

  @ApiPropertyOptional({
    description: 'Número da proposta (PRO_NUMERO)',
    example: 105,
  })
  proposalNumber?: number;

  @ApiPropertyOptional({
    description: 'Indica se a proposta já gerou venda (PRO_GERADA: S ou N)',
    enum: ['S', 'N'],
    example: 'N',
  })
  proGerada?: 'S' | 'N';

  @ApiPropertyOptional({
    description: 'Status interno da proposta (PRO_STATUS)',
    example: '2',
  })
  proStatus?: string;

  @ApiPropertyOptional({
    description: 'Data inicial da proposta (PRO_DATA >= YYYY-MM-DD)',
    example: '2026-01-01',
  })
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data final da proposta (PRO_DATA <= YYYY-MM-DD)',
    example: '2026-01-31',
  })
  endDate?: string;
}

export const GetProposalByIdQuerySchema = z.object({
  storeId: z.coerce.number().int().optional(),
});

export class GetProposalByIdQueryDto extends ZodDto(GetProposalByIdQuerySchema) {
  @ApiPropertyOptional({
    description: 'Código da loja (LOJ_CODIGO)',
    example: 1,
  })
  storeId?: number;
}
