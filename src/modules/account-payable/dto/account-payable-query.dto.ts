import { ApiPropertyOptional } from '@nestjs/swagger';

export enum AccountPayableSituation {
  ABERTO = 'A',
  LIQUIDADO = 'L',
}

export class AccountPayableQueryDto {
  @ApiPropertyOptional({
    description: 'Página atual',
    default: 1,
    type: Number,
  })
  page?: number;

  @ApiPropertyOptional({
    description: 'Registros por página',
    default: 10,
    type: Number,
  })
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Código da loja (LOJ_CODIGO)',
    type: Number,
  })
  storeId?: number;

  @ApiPropertyOptional({
    description: 'Código do fornecedor/credor (CRE_CODIGO)',
    type: Number,
  })
  supplierId?: number;

  @ApiPropertyOptional({
    enum: AccountPayableSituation,
    description: 'Situação da conta (A - Aberto, L - Liquidado)',
  })
  situation?: AccountPayableSituation;

  @ApiPropertyOptional({
    description: 'Data de vencimento inicial (YYYY-MM-DD)',
    type: String,
  })
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data de vencimento final (YYYY-MM-DD)',
    type: String,
  })
  endDate?: string;
}
