import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ example: 101, description: 'Código do produto' })
  PRO_CODIGO: number;

  @ApiProperty({ example: '7891234567890', description: 'Código de barras' })
  PRO_CODIGOBAR: string;

  @ApiProperty({ example: 'Produto Exemplo', description: 'Descrição do produto' })
  PRO_DESCRICAO: string;

  @ApiProperty({ example: 1, description: 'Código da marca' })
  MAR_CODIGO: number;

  @ApiProperty({ example: 'Marca Exemplo', description: 'Descrição da marca' })
  MAR_DESCRICAO: string;

  @ApiProperty({ example: 1, description: 'Código do grupo' })
  GRU_CODIGO: number;

  @ApiProperty({ example: 'Grupo Exemplo', description: 'Descrição do grupo' })
  GRU_DESCRICAO: string;

  @ApiProperty({ example: 50, description: 'Estoque atual' })
  EST_ATUAL: number;

  @ApiProperty({ example: 50, description: 'Estoque de apoio' })
  EST_APOIO: number;

  @ApiProperty({ example: 19.99, description: 'Preço 1' })
  PRECO: number;

  @ApiProperty({ example: 17.50, description: 'Preço 2' })
  PRECO2: number;
}

export class ProductDetailResponseDto {
  @ApiProperty({ example: 101, description: 'Código do produto' })
  PRO_CODIGO: number;

  @ApiProperty({ example: '7891234567890', description: 'Código de barras' })
  PRO_CODIGOBAR: string;

  @ApiProperty({ example: 10.00, description: 'Preço de compra' })
  PRO_PRCCOMPRA: number;

  @ApiProperty({ example: 12.50, description: 'Preço de custo' })
  PRO_PRCCUSTO: number;

  @ApiProperty({ example: 11.00, description: 'Preço de compra fiscal' })
  PRO_PRCCOMPRAFISCAL: number;

  @ApiProperty({ example: 13.00, description: 'Custo fiscal' })
  PRO_CUSTOFISCAL: number;

  @ApiProperty({ example: 19.99, description: 'Preço 1' })
  PRO_PRECO1: number;
}

export class ProductBarcodeResponseDto {
  @ApiProperty({ example: 101, description: 'Código do produto' })
  PRO_CODIGO: number;

  @ApiProperty({ example: '7891234567890', description: 'Código de barras' })
  PRO_CODIGOBAR: string;

  @ApiProperty({ example: 'Produto Exemplo', description: 'Descrição do produto' })
  PRO_DESCRICAO: string;

  @ApiProperty({ example: 1, description: 'Código da marca' })
  MAR_CODIGO: number;

  @ApiProperty({ example: 'Marca Exemplo', description: 'Descrição da marca' })
  MAR_DESCRICAO: string;

  @ApiProperty({ example: 1, description: 'Código do grupo' })
  GRU_CODIGO: number;

  @ApiProperty({ example: 'Grupo Exemplo', description: 'Descrição do grupo' })
  GRU_DESCRICAO: string;

  @ApiProperty({ example: 50, description: 'Estoque total' })
  ESTOQUE: number;

  @ApiProperty({ example: 19.99, description: 'Preço 1' })
  PRECO: number;

  @ApiProperty({ example: 17.50, description: 'Preço 2' })
  PRECO2: number;
}

export class ProductBrandResponseDto {
  @ApiProperty({ example: 1, description: 'Código da marca' })
  MAR_CODIGO: number;

  @ApiProperty({ example: 'Marca Exemplo', description: 'Descrição da marca' })
  MAR_DESCRICAO: string;
}

export class ProductGroupResponseDto {
  @ApiProperty({ example: 1, description: 'Código do grupo' })
  GRU_CODIGO: number;

  @ApiProperty({ example: 'Grupo Exemplo', description: 'Descrição do grupo' })
  GRU_DESCRICAO: string;
}
