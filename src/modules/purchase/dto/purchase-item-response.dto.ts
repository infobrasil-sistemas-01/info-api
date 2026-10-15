import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PurchaseItemEnrichedResponseDto {
  @ApiProperty({ description: 'Número do item (ICP_NUMERO)', example: 1 })
  ICP_NUMERO: number;

  @ApiProperty({ description: 'Número da compra associada (COM_NUMERO)', example: 10452 })
  COM_NUMERO: number;

  @ApiPropertyOptional({ description: 'Data da compra/entrada (COM_DATA)', example: '2026-08-15' })
  COM_DATA?: string;

  @ApiPropertyOptional({ description: 'Código da loja (LOJ_CODIGO)', example: 1 })
  LOJ_CODIGO?: number;

  @ApiPropertyOptional({ description: 'Número da nota fiscal (COM_NUMERONF)', example: '00012345' })
  COM_NUMERONF?: string;

  @ApiPropertyOptional({ description: 'Código do fornecedor/credor (CRE_CODIGO)', example: 45 })
  CRE_CODIGO?: number;

  @ApiPropertyOptional({ description: 'Razão social do fornecedor (CRE_NOME)', example: 'DISTRIBUIDORA DE ALIMENTOS LTDA' })
  CRE_NOME?: string;

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

  @ApiPropertyOptional({ description: 'Valor total bruto (ICP_TOTAL)', example: 255.0 })
  ICP_TOTAL?: number;

  @ApiPropertyOptional({ description: 'Valor de desconto (ICP_VLRDESCONTO)', example: 0.0 })
  ICP_VLRDESCONTO?: number;

  @ApiProperty({ description: 'Valor líquido (ICP_LIQUIDO)', example: 255.0 })
  ICP_LIQUIDO: number;

  @ApiProperty({ description: 'Valor total contábil (ICP_VLRTOTAL)', example: 255.0 })
  ICP_VLRTOTAL: number;

  @ApiPropertyOptional({ description: 'CFOP (NAF_CFOP)', example: 2102 })
  NAF_CFOP?: number;

  @ApiPropertyOptional({ description: 'Código da marca (MAR_CODIGO)', example: 7 })
  MAR_CODIGO?: number;

  @ApiPropertyOptional({ description: 'Descrição da marca (MAR_DESCRICAO)', example: 'MARCA EXEMPLO' })
  MAR_DESCRICAO?: string;

  @ApiPropertyOptional({ description: 'Código do grupo (GRU_CODIGO)', example: 12 })
  GRU_CODIGO?: number;

  @ApiPropertyOptional({ description: 'Descrição do grupo (GRU_DESCRICAO)', example: 'GRUPO EXEMPLO' })
  GRU_DESCRICAO?: string;

  @ApiPropertyOptional({ description: 'Alíquota de ICMS (ICP_PERCICMS)', example: 18.0 })
  ICP_PERCICMS?: number;

  @ApiPropertyOptional({ description: 'Valor de ICMS (ICP_VLRICMS)', example: 45.9 })
  ICP_VLRICMS?: number;

  @ApiPropertyOptional({ description: 'Alíquota de IPI (ICP_PERCIPI)', example: 5.0 })
  ICP_PERCIPI?: number;

  @ApiPropertyOptional({ description: 'Valor de IPI (ICP_VLRIPI)', example: 12.75 })
  ICP_VLRIPI?: number;

  @ApiPropertyOptional({ description: 'Número do lote (LOT_NUMERO)', example: 'LOTE-2026A' })
  LOT_NUMERO?: string;

  @ApiPropertyOptional({ description: 'Data de validade do lote (ICP_DATAVAL)', example: '2027-12-31' })
  ICP_DATAVAL?: string;

  @ApiPropertyOptional({ description: 'Data de fabricação do lote (ICP_DATAFAB)', example: '2026-01-10' })
  ICP_DATAFAB?: string;

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

  @ApiPropertyOptional({ description: 'Código do tamanho (TAM_CODIGO)', example: 'P' })
  TAM_CODIGO?: string;

  @ApiPropertyOptional({ description: 'Descrição do tamanho (TAM_DESCRICAO)', example: 'PEQUENO' })
  TAM_DESCRICAO?: string;

  @ApiPropertyOptional({ description: 'Código da cor (COR_CODIGO)', example: 3 })
  COR_CODIGO?: number;

  @ApiPropertyOptional({ description: 'Descrição da cor (COR_DESCRICAO)', example: 'AMARELO' })
  COR_DESCRICAO?: string;

  @ApiPropertyOptional({ description: 'Código da grade (PRG_CODIGO)', example: '000000000101' })
  PRG_CODIGO?: string;
}
