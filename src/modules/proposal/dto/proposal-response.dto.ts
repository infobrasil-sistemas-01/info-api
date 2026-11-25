import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProposalItemResponseDto {
  @ApiProperty({ example: 501, description: 'ID do item da proposta (IPR_NUMERO)' })
  IPR_NUMERO: number;

  @ApiProperty({ example: 105, description: 'Número da proposta (PRO_NUMERO)' })
  PRO_NUMERO: number;

  @ApiProperty({ example: '00000000000045', description: 'Código do produto (PRO_CODIGO)' })
  PRO_CODIGO: string;

  @ApiPropertyOptional({ example: 'PRODUTO EXEMPLO', description: 'Descrição do produto' })
  PRO_DESCRICAO?: string | null;

  @ApiPropertyOptional({ example: 'UN', description: 'Unidade do produto' })
  PRO_UNIDADE?: string | null;

  @ApiPropertyOptional({ example: '7891234560045', description: 'Código de barras do produto' })
  PRO_CODIGOBAR?: string | null;

  @ApiProperty({ example: 2, description: 'Quantidade (IPR_QTDE)' })
  IPR_QTDE: number;

  @ApiProperty({ example: 50, description: 'Preço unitário (IPR_PRECO)' })
  IPR_PRECO: number;

  @ApiProperty({ example: 100, description: 'Valor total bruto do item (IPR_TOTAL)' })
  IPR_TOTAL: number;

  @ApiPropertyOptional({ example: 0, description: 'Desconto em valor (IPR_DESCONTO)' })
  IPR_DESCONTO?: number | null;

  @ApiPropertyOptional({ example: 100, description: 'Valor líquido do item (IPR_LIQUIDO)' })
  IPR_LIQUIDO?: number | null;

  @ApiPropertyOptional({ example: 0, description: 'Percentual de desconto (IPR_PERCDESCONTO)' })
  IPR_PERCDESCONTO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PES_CODIGO' })
  PES_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'TEC_CODIGO' })
  TEC_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'IPR_QTDEENT' })
  IPR_QTDEENT?: number | null;

  @ApiPropertyOptional({ example: null, description: 'Informações adicionais do item (IPR_INFADICIONAIS)' })
  IPR_INFADICIONAIS?: string | null;

  @ApiPropertyOptional({ example: 1, description: 'Código da loja (LOJ_CODIGO)' })
  LOJ_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'IPR_NEGATIVO' })
  IPR_NEGATIVO?: string | null;

  @ApiPropertyOptional({ example: null, description: 'AMB_CODIGO' })
  AMB_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'IPR_PRCVENDADIA' })
  IPR_PRCVENDADIA?: number | null;

  @ApiPropertyOptional({ example: null, description: 'TAM_CODIGO' })
  TAM_CODIGO?: string | null;

  @ApiPropertyOptional({ example: null, description: 'COR_CODIGO' })
  COR_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRG_CODIGO' })
  PRG_CODIGO?: string | null;

  @ApiPropertyOptional({ example: null, description: 'IPR_ALTURA' })
  IPR_ALTURA?: number | null;

  @ApiPropertyOptional({ example: null, description: 'IPR_LARGURA' })
  IPR_LARGURA?: number | null;

  @ApiPropertyOptional({ example: null, description: 'IPR_QTDEUNT' })
  IPR_QTDEUNT?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRK_CODIGO' })
  PRK_CODIGO?: string | null;

  @ApiPropertyOptional({ example: '1', description: 'Tabela de preço (IPR_TABELAPRECO)' })
  IPR_TABELAPRECO?: string | null;

  @ApiPropertyOptional({ example: null, description: 'IPR_METRAGEMSUGERIDA' })
  IPR_METRAGEMSUGERIDA?: number | null;

  @ApiPropertyOptional({ example: null, description: 'IPR_QTDEMETRAGEMSUGERIDA' })
  IPR_QTDEMETRAGEMSUGERIDA?: number | null;

  @ApiPropertyOptional({ example: null, description: 'TRM_CODIGO' })
  TRM_CODIGO?: number | null;

  @ApiPropertyOptional({ example: 1, description: 'Ordem sequencial do item (IPR_ITEM)' })
  IPR_ITEM?: number | null;

  @ApiPropertyOptional({ example: 'N', description: 'Garante estoque S/N (IPR_GARANTEESTOQUE)' })
  IPR_GARANTEESTOQUE?: string | null;

  @ApiPropertyOptional({ example: null, description: 'Preço de custo (IPR_PRCCUSTO)' })
  IPR_PRCCUSTO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'Preço de compra (IPR_PRCCOMPRA)' })
  IPR_PRCCOMPRA?: number | null;

  @ApiPropertyOptional({ example: null, description: 'Margem lucro compra (IPR_MARGEMLUCROCOMPRA)' })
  IPR_MARGEMLUCROCOMPRA?: number | null;

  @ApiPropertyOptional({ example: null, description: 'Margem lucro custo (IPR_MARGEMLUCROCUSTO)' })
  IPR_MARGEMLUCROCUSTO?: number | null;

  @ApiPropertyOptional({ example: 0, description: 'Acréscimo em valor (IPR_ACRESCIMO)' })
  IPR_ACRESCIMO?: number | null;

  @ApiPropertyOptional({ example: 0, description: 'Percentual de acréscimo (IPR_PERCACRESC)' })
  IPR_PERCACRESC?: number | null;
}

export class ProposalResponseDto {
  @ApiProperty({ example: 105, description: 'Número da proposta (PRO_NUMERO)' })
  PRO_NUMERO: number;

  @ApiProperty({ example: 2, description: 'Código do funcionário/vendedor (FUN_CODIGO)' })
  FUN_CODIGO: number;

  @ApiPropertyOptional({ example: 'CARLOS VENDEDOR', description: 'Nome do funcionário' })
  FUN_NOME?: string | null;

  @ApiProperty({ example: 1, description: 'Código da situação (SIT_CODIGO)' })
  SIT_CODIGO: number;

  @ApiPropertyOptional({ example: 'ABERTA', description: 'Descrição da situação' })
  SIT_DESCRICAO?: string | null;

  @ApiProperty({ example: 1, description: 'Código da loja (LOJ_CODIGO)' })
  LOJ_CODIGO: number;

  @ApiPropertyOptional({ example: 'LOJA MATRIZ', description: 'Nome da loja' })
  LOJ_NOME?: string | null;

  @ApiPropertyOptional({ example: 'MATRIZ', description: 'Fantasia da loja' })
  LOJ_FANTASIA?: string | null;

  @ApiProperty({ example: 10, description: 'Código do cliente (CLI_CODIGO)' })
  CLI_CODIGO: number;

  @ApiPropertyOptional({ example: 'CLIENTE EXEMPLO LTDA', description: 'Nome do cliente' })
  CLI_NOME?: string | null;

  @ApiPropertyOptional({ example: 1, description: 'Código do usuário operador (USU_CODIGO)' })
  USU_CODIGO?: number | null;

  @ApiPropertyOptional({ example: 'admin', description: 'Apelido do usuário' })
  USU_APELIDO?: string | null;

  @ApiPropertyOptional({ example: 1, description: 'Código da forma de pagamento (FPG_CODIGO)' })
  FPG_CODIGO?: number | null;

  @ApiPropertyOptional({ example: 'Sr. João', description: 'Contato/Atenção (PRO_ATENCIOSAMENTE)' })
  PRO_ATENCIOSAMENTE?: string | null;

  @ApiPropertyOptional({ example: '10 DIAS', description: 'Prazo de entrega (PRO_PRAZO)' })
  PRO_PRAZO?: string | null;

  @ApiPropertyOptional({ example: '15 DIAS', description: 'Validade da proposta (PRO_VALIDADE)' })
  PRO_VALIDADE?: string | null;

  @ApiProperty({ example: '2026-11-25T00:00:00.000Z', description: 'Data da proposta (PRO_DATA)' })
  PRO_DATA: string;

  @ApiPropertyOptional({ example: '14:30:00', description: 'Hora da proposta (PRO_HORA)' })
  PRO_HORA?: string | null;

  @ApiPropertyOptional({ example: null, description: 'Data da baixa (PRO_DATABAIXA)' })
  PRO_DATABAIXA?: string | null;

  @ApiPropertyOptional({ example: 100, description: 'Total bruto (PRO_TOTALBRUTO)' })
  PRO_TOTALBRUTO?: number | null;

  @ApiPropertyOptional({ example: 0, description: 'Total desconto (PRO_TOTALDESC)' })
  PRO_TOTALDESC?: number | null;

  @ApiPropertyOptional({ example: 0, description: 'Percentual desconto (PRO_PERCDESC)' })
  PRO_PERCDESC?: number | null;

  @ApiPropertyOptional({ example: 100, description: 'Total líquido (PRO_TOTALLIQUIDO)' })
  PRO_TOTALLIQUIDO?: number | null;

  @ApiPropertyOptional({ example: 'Observação da proposta', description: 'Observações (PRO_OBS)' })
  PRO_OBS?: string | null;

  @ApiPropertyOptional({ example: 2, description: 'Quantidade total de itens (PRO_QUANT)' })
  PRO_QUANT?: number | null;

  @ApiPropertyOptional({ example: '30/60 DIAS', description: 'Condição de pagamento (PRO_CONDICAOPAG)' })
  PRO_CONDICAOPAG?: string | null;

  @ApiPropertyOptional({ example: 'N', description: 'Proposta convertida em venda S/N (PRO_GERADA)' })
  PRO_GERADA?: string | null;

  @ApiPropertyOptional({ example: 'CLIENTE FANTASIA', description: 'Nome fantasia do cliente (PRO_FANTCLI)' })
  PRO_FANTCLI?: string | null;

  @ApiPropertyOptional({ example: null, description: 'Número da venda gerada pelo sistema (VEN_NUMERO)' })
  VEN_NUMERO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRE_CODIGO' })
  PRE_CODIGO?: number | null;

  @ApiPropertyOptional({ example: '2', description: 'Tabela de preço padrão (PRO_PRECO)' })
  PRO_PRECO?: string | null;

  @ApiPropertyOptional({ example: null, description: 'Número do pedido do cliente (PRO_PEDCLIENTE)' })
  PRO_PEDCLIENTE?: number | null;

  @ApiPropertyOptional({ example: null, description: 'Código da transportadora (TRA_CODIGO)' })
  TRA_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'Motivo (PRO_MOTIVO)' })
  PRO_MOTIVO?: string | null;

  @ApiPropertyOptional({ example: '2', description: 'Status da proposta (PRO_STATUS)' })
  PRO_STATUS?: string | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALPP1' })
  PRO_TOTALPP1?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALPP2' })
  PRO_TOTALPP2?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALPP3' })
  PRO_TOTALPP3?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PP1_CODIGO' })
  PP1_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PP2_CODIGO' })
  PP2_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PP3_CODIGO' })
  PP3_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'FP1_CODIGO' })
  FP1_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'FP2_CODIGO' })
  FP2_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'FP3_CODIGO' })
  FP3_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_NUMORG' })
  PRO_NUMORG?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_DATABASE1' })
  PRO_DATABASE1?: string | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_DATABASE2' })
  PRO_DATABASE2?: string | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_DATABASE3' })
  PRO_DATABASE3?: string | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_HORABAIXA' })
  PRO_HORABAIXA?: string | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_PERCDESC1' })
  PRO_PERCDESC1?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_PERCDESC2' })
  PRO_PERCDESC2?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_PERCDESC3' })
  PRO_PERCDESC3?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALDESC1' })
  PRO_TOTALDESC1?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALDESC2' })
  PRO_TOTALDESC2?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALDESC3' })
  PRO_TOTALDESC3?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALPPA1' })
  PRO_TOTALPPA1?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALPPA2' })
  PRO_TOTALPPA2?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALPPA3' })
  PRO_TOTALPPA3?: number | null;

  @ApiPropertyOptional({ example: null, description: 'Informações adicionais (PRO_INFADICIONAIS)' })
  PRO_INFADICIONAIS?: string | null;

  @ApiPropertyOptional({ example: 0, description: 'Percentual de acréscimo (PRO_PERCACRESC)' })
  PRO_PERCACRESC?: number | null;

  @ApiPropertyOptional({ example: 0, description: 'Total de acréscimo (PRO_TOTALACRESC)' })
  PRO_TOTALACRESC?: number | null;

  @ApiPropertyOptional({ example: null, description: 'TCN_CODIGO' })
  TCN_CODIGO?: number | null;
}

export class ProposalDetailResponseDto extends ProposalResponseDto {
  @ApiProperty({
    type: [ProposalItemResponseDto],
    description: 'Itens da proposta (ITENSPRO)',
  })
  ITENS: ProposalItemResponseDto[];
}
