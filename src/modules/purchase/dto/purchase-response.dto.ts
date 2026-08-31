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
}
