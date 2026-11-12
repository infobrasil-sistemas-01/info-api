import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StoreStockDto {
  @ApiProperty({ example: 1, description: 'Código da filial / loja' })
  LOJ_CODIGO: number;

  @ApiProperty({ example: 15.5, description: 'Estoque atual na loja' })
  EST_ATUAL: number;

  @ApiProperty({ example: 5.0, description: 'Estoque de apoio na loja' })
  EST_APOIO: number;
}

export class ProductStockResponseDto {
  @ApiProperty({ example: '101', description: 'Código do produto' })
  PRO_CODIGO: string | number;

  @ApiPropertyOptional({
    example: '7891234567890',
    description: 'Código de barras',
  })
  PRO_CODIGOBAR?: string | null;

  @ApiProperty({
    example: 'Produto Exemplo',
    description: 'Descrição do produto',
  })
  PRO_DESCRICAO: string;

  @ApiProperty({
    type: [StoreStockDto],
    description: 'Lista de saldos de estoque por loja cadastrada',
  })
  STOCKS: StoreStockDto[];
}

