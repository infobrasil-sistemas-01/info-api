import { ApiProperty } from '@nestjs/swagger';

export class AccountPayableSummaryResponseDto {
  @ApiProperty({ example: 100, description: 'Número do documento de conta a pagar' })
  PAG_NUMERO: number;

  @ApiProperty({ example: 50, description: 'Código do credor' })
  CRE_CODIGO: number;

  @ApiProperty({ example: 'Credor Teste', description: 'Nome do credor' })
  CRE_NOME: string;

  @ApiProperty({ example: 1500.50, description: 'Valor da conta' })
  PAG_VALOR: number;

  @ApiProperty({ example: 'A', description: 'Situação (A - Aberto, L - Liquidado)' })
  PAG_SITUACAO: string;

  @ApiProperty({ example: '2024-12-31T00:00:00.000Z', description: 'Data de vencimento' })
  PAG_DATAVENC: string;
}

export class AccountPayableDetailResponseDto extends AccountPayableSummaryResponseDto {
  @ApiProperty({ example: 1, description: 'Código da loja' })
  LOJ_CODIGO: number;

  @ApiProperty({ example: 10, description: 'Código do centro de custo', required: false })
  CEN_CODIGO?: number;

  @ApiProperty({ example: 5, description: 'Código da forma de pagamento' })
  FPG_CODIGO: number;

  @ApiProperty({ example: '12345-6', description: 'Conta bancária', required: false })
  BAN_CONTA?: string;

  @ApiProperty({ example: 'NF 123', description: 'Documento original', required: false })
  PAG_DOCUMENTO?: string;

  @ApiProperty({ example: 0, description: 'Valor pago por conta', required: false })
  PAG_PORCONTA?: number;

  @ApiProperty({ example: 'Pagamento referente à compra X', description: 'Histórico da conta', required: false })
  PAG_HISTORICO?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Data do movimento' })
  PAG_DATAMOV: string;

  @ApiProperty({ example: '2024-12-31T00:00:00.000Z', description: 'Data do pagamento', required: false })
  PAG_DATAPAG?: string;

  @ApiProperty({ example: 0, description: 'Valor pago via tesouraria', required: false })
  PAG_VALORTESOURARIA?: number;

  @ApiProperty({ example: 1500.50, description: 'Valor pago via banco', required: false })
  PAG_VALORBANCO?: number;

  @ApiProperty({ example: 1500.50, description: 'Valor total' })
  PAG_TOTAL: number;
}
