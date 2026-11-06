import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductionOrderItemResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Identificador do item da ordem de produção (OPI_NUMERO)',
  })
  OPI_NUMERO: number;

  @ApiProperty({
    example: 201,
    description: 'Número da ordem de produção vinculada (ORP_NUMERO)',
  })
  ORP_NUMERO: number;

  @ApiProperty({
    example: '00000000000012',
    description: 'Código do produto/insumo consumido (PRO_CODIGO)',
  })
  PRO_CODIGO: string;

  @ApiPropertyOptional({
    example: '7891234560012',
    description: 'Código de barras do insumo',
  })
  PRO_CODIGOBAR?: string;

  @ApiPropertyOptional({
    example: 'FARINHA DE TRIGO ESPECIAL 1KG',
    description: 'Descrição do insumo consumido',
  })
  PRO_DESCRICAO?: string;

  @ApiPropertyOptional({
    example: 'KG',
    description: 'Unidade de medida do insumo',
  })
  PRO_UNIDADE?: string;

  @ApiPropertyOptional({
    example: 'REF-FAR-01',
    description: 'Referência do insumo',
  })
  PRO_REFERENCIA?: string;

  @ApiPropertyOptional({
    example: 5,
    description: 'Código da marca do insumo (MAR_CODIGO)',
  })
  MAR_CODIGO?: number;

  @ApiPropertyOptional({
    example: 'DONA BENTA',
    description: 'Descrição da marca do insumo',
  })
  MAR_DESCRICAO?: string;

  @ApiPropertyOptional({
    example: 3,
    description: 'Código do grupo do insumo (GRU_CODIGO)',
  })
  GRU_CODIGO?: number;

  @ApiPropertyOptional({
    example: 'MATÉRIA PRIMA',
    description: 'Descrição do grupo do insumo',
  })
  GRU_DESCRICAO?: string;

  @ApiPropertyOptional({
    example: 4.5,
    description: 'Preço/custo unitário do insumo (OPI_PRECO)',
  })
  OPI_PRECO?: number;

  @ApiPropertyOptional({
    example: 20.0,
    description: 'Quantidade consumida/utilizada (OPI_QTDE)',
  })
  OPI_QTDE?: number;

  @ApiPropertyOptional({
    example: 90.0,
    description: 'Valor total do insumo consumido (OPI_TOTAL)',
  })
  OPI_TOTAL?: number;
}

