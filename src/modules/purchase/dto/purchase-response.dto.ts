import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PurchaseResponseDto {
  @ApiProperty({
    description: 'Número da entrada / ID (COM_NUMERO)',
    example: 10452,
  })
  COM_NUMERO: number;

  @ApiProperty({
    description: 'Data da entrada (COM_DATA)',
    example: '2026-08-15',
  })
  COM_DATA: string;

  @ApiPropertyOptional({
    description: 'Hora da entrada (COM_HORA)',
    example: '14:30:00',
  })
  COM_HORA?: string;

  @ApiProperty({
    description: 'Código da loja (LOJ_CODIGO)',
    example: 1,
  })
  LOJ_CODIGO: number;

  @ApiProperty({
    description: 'Código do fornecedor/credor (CRE_CODIGO)',
    example: 45,
  })
  CRE_CODIGO: number;

  @ApiPropertyOptional({
    description: 'Razão social do fornecedor (CRE_NOME)',
    example: 'DISTRIBUIDORA DE ALIMENTOS LTDA',
  })
  CRE_NOME?: string;

  @ApiPropertyOptional({
    description: 'Nome fantasia do fornecedor (CRE_FANTASIA)',
    example: 'DISTRIBUIDORA ALIMENTOS',
  })
  CRE_FANTASIA?: string;

  @ApiPropertyOptional({
    description: 'CNPJ do fornecedor (CRE_CNPJ)',
    example: '12.345.678/0001-90',
  })
  CRE_CNPJ?: string;

  @ApiPropertyOptional({
    description: 'Número da nota fiscal (COM_NUMERONF)',
    example: '00012345',
  })
  COM_NUMERONF?: string;

  @ApiPropertyOptional({
    description: 'Série da nota fiscal (COM_SERIE)',
    example: '1',
  })
  COM_SERIE?: string;

  @ApiPropertyOptional({
    description: 'Data de emissão da nota fiscal (COM_DATAEMISSAONF)',
    example: '2026-08-14',
  })
  COM_DATAEMISSAONF?: string;

  @ApiPropertyOptional({
    description: 'Chave de acesso da NF-e com 44 dígitos (COM_CHAVE)',
    example: '23260812345678000195550010001234561001234567',
  })
  COM_CHAVE?: string;

  @ApiPropertyOptional({
    description: 'Valor total da nota fiscal (COM_VRTOTALNF)',
    example: 15420.5,
  })
  COM_VRTOTALNF?: number;

  @ApiPropertyOptional({
    description: 'Valor total da compra (COM_TOTAL)',
    example: 15420.5,
  })
  COM_TOTAL?: number;

  @ApiPropertyOptional({
    description: 'Quantidade total de itens (COM_QUANTIDADE)',
    example: 120.0,
  })
  COM_QUANTIDADE?: number;

  @ApiPropertyOptional({
    description: 'Código da situação (SIT_CODIGO)',
    example: 1,
  })
  SIT_CODIGO?: number;

  // Novos campos adicionais da tabela COMPRAS (não-breaking changes)
  @ApiPropertyOptional({ description: 'Código do usuário/operador (USU_CODIGO)', example: 1 })
  USU_CODIGO?: number;

  @ApiPropertyOptional({ description: 'Código do funcionário/comprador (FUN_CODIGO)', example: 10 })
  FUN_CODIGO?: number;

  @ApiPropertyOptional({ description: 'Tipo da compra (COM_TIPO)', example: 'E' })
  COM_TIPO?: string;

  @ApiPropertyOptional({ description: 'Data da baixa (COM_DATABAIXA)', example: '2026-08-15' })
  COM_DATABAIXA?: string;

  @ApiPropertyOptional({ description: 'Valor de ICMS (COM_VRICMS)', example: 1800.5 })
  COM_VRICMS?: number;

  @ApiPropertyOptional({ description: 'Valor de frete da NF (COM_VRFRETENF)', example: 150.0 })
  COM_VRFRETENF?: number;

  @ApiPropertyOptional({ description: 'Valor de frete avulso (COM_VRFRETEAVULSO)', example: 0.0 })
  COM_VRFRETEAVULSO?: number;

  @ApiPropertyOptional({ description: 'Valor de IPI (COM_VRIPI)', example: 320.0 })
  COM_VRIPI?: number;

  @ApiPropertyOptional({ description: 'Base de cálculo do ICMS (COM_VRBASECALC)', example: 10000.0 })
  COM_VRBASECALC?: number;

  @ApiPropertyOptional({ description: 'ICMS Antecipado (COM_VRICMSANTECIPADO)', example: 0.0 })
  COM_VRICMSANTECIPADO?: number;

  @ApiPropertyOptional({ description: 'Valor de desconto (COM_VRDESCONTO)', example: 50.0 })
  COM_VRDESCONTO?: number;

  @ApiPropertyOptional({ description: 'Indicador a prazo (COM_PRAZO)', example: '2' })
  COM_PRAZO?: string;

  @ApiPropertyOptional({ description: 'Número do pedido de compra vinculado (PED_NUMERO)', example: 450 })
  PED_NUMERO?: number;

  @ApiPropertyOptional({ description: 'Outras despesas (COM_VROUTRASDESP)', example: 0.0 })
  COM_VROUTRASDESP?: number;

  @ApiPropertyOptional({ description: 'Valor do seguro (COM_VRSEGURO)', example: 0.0 })
  COM_VRSEGURO?: number;

  @ApiPropertyOptional({ description: 'Tipo do frete (COM_TIPOFRETE)', example: '9' })
  COM_TIPOFRETE?: string;

  @ApiPropertyOptional({ description: 'Desconto complementar (COM_VRDESCCOMPL)', example: 0.0 })
  COM_VRDESCCOMPL?: number;

  @ApiPropertyOptional({ description: 'ICMS Desonerado (COM_VRICMSDESON)', example: 0.0 })
  COM_VRICMSDESON?: number;

  @ApiPropertyOptional({ description: 'FCP ST (COM_VRFCPST)', example: 0.0 })
  COM_VRFCPST?: number;

  @ApiPropertyOptional({ description: 'Valor de II (COM_VRII)', example: 0.0 })
  COM_VRII?: number;

  @ApiPropertyOptional({ description: 'Complemento de ICMS (COM_VRCOMPLEMENTO)', example: 0.0 })
  COM_VRCOMPLEMENTO?: number;

  @ApiPropertyOptional({ description: 'Diferencial de ICMS (COM_VRDIF_ICMS)', example: 0.0 })
  COM_VRDIF_ICMS?: number;

  @ApiPropertyOptional({ description: 'Base de cálculo ICMS ST (COM_VRBASECALCSUBST)', example: 0.0 })
  COM_VRBASECALCSUBST?: number;

  @ApiPropertyOptional({ description: 'Valor ICMS ST (COM_VRICMSSUBST)', example: 0.0 })
  COM_VRICMSSUBST?: number;

  @ApiPropertyOptional({ description: 'Valor de bonificação (COM_VRBONIFICACAO)', example: 0.0 })
  COM_VRBONIFICACAO?: number;

  @ApiPropertyOptional({ description: 'Espécie do documento (COM_ESPECIE)', example: '2' })
  COM_ESPECIE?: string;

  @ApiPropertyOptional({ description: 'CFOP da entrada (NAF_CFOP)', example: 2102 })
  NAF_CFOP?: number;

  @ApiPropertyOptional({ description: 'Código da transportadora (TRA_CODIGO)', example: 3 })
  TRA_CODIGO?: number;

  @ApiPropertyOptional({ description: 'Nome da transportadora (TRA_NOME)', example: 'TRANSPORTADORA VELOZ LTDA' })
  TRA_NOME?: string;

  @ApiPropertyOptional({ description: 'Observações (COM_OBS1)', example: 'Entrada referente a suprimentos mensais' })
  COM_OBS1?: string;

  @ApiPropertyOptional({ description: 'Finalidade da compra (COM_FINALIDADE)', example: 1 })
  COM_FINALIDADE?: number;

  @ApiPropertyOptional({ description: 'Gerou registro de apoio (COM_GEROU_APOIO)', example: 'S' })
  COM_GEROU_APOIO?: string;

  @ApiPropertyOptional({ description: 'Status de manifesto do destinatário (COM_MANIFESTO)', example: 'N' })
  COM_MANIFESTO?: string;

  // Reforma Tributária (IBS / CBS)
  @ApiPropertyOptional({ description: 'Total base cálculo IBS/CBS (COM_TOTALBCIBSCBS)', example: 0.0 })
  COM_TOTALBCIBSCBS?: number;

  @ApiPropertyOptional({ description: 'Total CBS (COM_TOTALCBS)', example: 0.0 })
  COM_TOTALCBS?: number;

  @ApiPropertyOptional({ description: 'Total IBS UF (COM_TOTALUFIBS)', example: 0.0 })
  COM_TOTALUFIBS?: number;

  @ApiPropertyOptional({ description: 'Total IBS Município (COM_TOTALMUNIBS)', example: 0.0 })
  COM_TOTALMUNIBS?: number;

  @ApiPropertyOptional({ description: 'Total Imposto Seletivo (COM_TOTALIS)', example: 0.0 })
  COM_TOTALIS?: number;
}

export class PurchaseItemResponseDto {
  @ApiProperty({ description: 'Número identificador do item (ICP_NUMERO)', example: 1 })
  ICP_NUMERO: number;

  @ApiProperty({ description: 'Número da compra associada (COM_NUMERO)', example: 10452 })
  COM_NUMERO: number;

  @ApiProperty({ description: 'Código do produto (PRO_CODIGO)', example: '000000000101' })
  PRO_CODIGO: string;

  @ApiPropertyOptional({ description: 'Descrição do produto', example: 'PRODUTO TESTE ALIMENTICIO' })
  PRO_DESCRICAO?: string;

  @ApiPropertyOptional({ description: 'Unidade de medida', example: 'UN' })
  PRO_UNIDADE?: string;

  @ApiProperty({ description: 'Quantidade comprada (ICP_QTDE)', example: 10.0 })
  ICP_QTDE: number;

  @ApiPropertyOptional({ description: 'Preço unitário de compra (ICP_PRECO)', example: 25.5 })
  ICP_PRECO?: number;

  @ApiPropertyOptional({ description: 'Valor total do item (ICP_TOTAL)', example: 255.0 })
  ICP_TOTAL?: number;

  @ApiProperty({ description: 'Valor líquido do item (ICP_LIQUIDO)', example: 255.0 })
  ICP_LIQUIDO: number;

  @ApiProperty({ description: 'Valor total contábil (ICP_VLRTOTAL)', example: 255.0 })
  ICP_VLRTOTAL: number;

  @ApiPropertyOptional({ description: 'CFOP do item (NAF_CFOP)', example: 2102 })
  NAF_CFOP?: number;

  @ApiPropertyOptional({ description: 'Alíquota de ICMS (ICP_PERCICMS)', example: 18.0 })
  ICP_PERCICMS?: number;

  @ApiPropertyOptional({ description: 'Valor de ICMS (ICP_VLRICMS)', example: 45.9 })
  ICP_VLRICMS?: number;

  @ApiPropertyOptional({ description: 'Alíquota de IPI (ICP_PERCIPI)', example: 5.0 })
  ICP_PERCIPI?: number;

  @ApiPropertyOptional({ description: 'Valor de IPI (ICP_VLRIPI)', example: 12.75 })
  ICP_VLRIPI?: number;

  @ApiPropertyOptional({ description: 'Valor de frete rateado (ICP_VLRFRETE)', example: 5.0 })
  ICP_VLRFRETE?: number;

  @ApiPropertyOptional({ description: 'Valor de seguro rateado (ICP_VLRSEGURO)', example: 0.0 })
  ICP_VLRSEGURO?: number;

  @ApiPropertyOptional({ description: 'Valor de desconto rateado (ICP_VLRDESCONTO)', example: 0.0 })
  ICP_VLRDESCONTO?: number;

  @ApiPropertyOptional({ description: 'Outras despesas rateadas (ICP_VLROUTRAS)', example: 0.0 })
  ICP_VLROUTRAS?: number;

  @ApiPropertyOptional({ description: 'Data de validade do lote (ICP_DATAVAL)', example: '2027-12-31' })
  ICP_DATAVAL?: string;

  @ApiPropertyOptional({ description: 'Data de fabricação do lote (ICP_DATAFAB)', example: '2026-01-10' })
  ICP_DATAFAB?: string;

  @ApiPropertyOptional({ description: 'Número do lote (LOT_NUMERO)', example: 'LOTE-2026A' })
  LOT_NUMERO?: string;

  @ApiPropertyOptional({ description: 'Quantidade conferida no recebimento (ICP_QTDECONFERIDA)', example: 10.0 })
  ICP_QTDECONFERIDA?: number;

  @ApiPropertyOptional({ description: 'Código de tributação ICMS (ICM_CODIGO)', example: 0 })
  ICM_CODIGO?: number;

  @ApiPropertyOptional({ description: 'Código PIS (PIS_CODIGO)', example: 70 })
  PIS_CODIGO?: number;

  @ApiPropertyOptional({ description: 'Código COFINS (COF_CODIGO)', example: 70 })
  COF_CODIGO?: number;

  // Reforma Tributária
  @ApiPropertyOptional({ description: 'Base cálculo IBS/CBS (ICP_VRBCIBSCBS)', example: 255.0 })
  ICP_VRBCIBSCBS?: number;

  @ApiPropertyOptional({ description: 'Alíquota CBS (ICP_PERCCBS)', example: 0.0 })
  ICP_PERCCBS?: number;

  @ApiPropertyOptional({ description: 'Valor CBS (ICP_VRCBS)', example: 0.0 })
  ICP_VRCBS?: number;

  @ApiPropertyOptional({ description: 'Alíquota IBS UF (ICP_PERCIBSUF)', example: 0.0 })
  ICP_PERCIBSUF?: number;

  @ApiPropertyOptional({ description: 'Valor IBS UF (ICP_VRIBSUF)', example: 0.0 })
  ICP_VRIBSUF?: number;

  @ApiPropertyOptional({ description: 'Alíquota IBS Município (ICP_PERCIBSMUN)', example: 0.0 })
  ICP_PERCIBSMUN?: number;

  @ApiPropertyOptional({ description: 'Valor IBS Município (ICP_VRIBSMUN)', example: 0.0 })
  ICP_VRIBSMUN?: number;
}

export class PurchaseDetailResponseDto extends PurchaseResponseDto {
  @ApiProperty({
    type: [PurchaseItemResponseDto],
    description: 'Lista de itens vinculados à compra',
  })
  items: PurchaseItemResponseDto[];
}
