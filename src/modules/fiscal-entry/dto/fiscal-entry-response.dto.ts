import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FiscalEntryResponseDto {
  @ApiProperty({
    description: 'Número da entrada / ID (ETA_NUMERO)',
    example: 20452,
  })
  ETA_NUMERO: number;

  @ApiProperty({
    description: 'Data da entrada (ETA_DATA)',
    example: '2026-08-15',
  })
  ETA_DATA: string;

  @ApiPropertyOptional({
    description: 'Hora da entrada (ETA_HORA)',
    example: '14:30:00',
  })
  ETA_HORA?: string;

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
    description: 'Número da nota fiscal (ETA_NUMERONF)',
    example: '00012345',
  })
  ETA_NUMERONF?: string;

  @ApiPropertyOptional({
    description: 'Série da nota fiscal (ETA_SERIE)',
    example: '1',
  })
  ETA_SERIE?: string;

  @ApiPropertyOptional({
    description: 'Data de emissão da nota fiscal (ETA_DATAEMISSAONF)',
    example: '2026-08-14',
  })
  ETA_DATAEMISSAONF?: string;

  @ApiPropertyOptional({
    description: 'Chave de acesso da NF-e com 44 dígitos (ETA_CHAVE)',
    example: '23260812345678000195550010001234561001234567',
  })
  ETA_CHAVE?: string;

  @ApiPropertyOptional({
    description: 'Valor total da nota fiscal (ETA_VRTOTALNF)',
    example: 15420.5,
  })
  ETA_VRTOTALNF?: number;

  @ApiPropertyOptional({
    description: 'Valor total da entrada (ETA_TOTAL)',
    example: 15420.5,
  })
  ETA_TOTAL?: number;

  @ApiPropertyOptional({
    description: 'Quantidade total de itens (ETA_QUANTIDADE)',
    example: 120.0,
  })
  ETA_QUANTIDADE?: number;

  @ApiPropertyOptional({
    description: 'Código da situação (SIT_CODIGO)',
    example: 1,
  })
  SIT_CODIGO?: number;
}
