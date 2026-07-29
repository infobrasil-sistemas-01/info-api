import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemEnrichedResponseDto {
  @ApiProperty({ example: 12345, description: 'Número da venda' })
  VEN_NUMERO: number;

  @ApiProperty({
    example: '2024-05-10T00:00:00.000Z',
    description: 'Data da venda',
  })
  VEN_DATA: string;

  @ApiProperty({ example: 101, description: 'Código do produto' })
  PRO_CODIGO: number;

  @ApiProperty({
    example: 'Produto Exemplo',
    description: 'Descrição do produto',
  })
  PRO_DESCRICAO: string;

  @ApiProperty({ example: 2, description: 'Quantidade' })
  IVD_QTDE: number;

  @ApiProperty({ example: 150.0, description: 'Preço unitário' })
  IVD_PRECO: number;

  @ApiProperty({ example: 300.0, description: 'Valor total' })
  IVD_TOTAL: number;

  @ApiProperty({ example: 0, description: 'Valor de desconto' })
  IVD_DESCONTO: number;

  @ApiProperty({ example: 300.0, description: 'Valor líquido' })
  IVD_LIQUIDO: number;

  @ApiProperty({ example: 7, description: 'Código da marca' })
  MAR_CODIGO: number;

  @ApiProperty({ example: 'Marca Exemplo', description: 'Descrição da marca' })
  MAR_DESCRICAO: string;

  @ApiProperty({ example: 12, description: 'Código do grupo' })
  GRU_CODIGO: number;

  @ApiProperty({ example: 'Grupo Exemplo', description: 'Descrição do grupo' })
  GRU_DESCRICAO: string;

  @ApiPropertyOptional({ example: 1, description: 'Código do ambiente' })
  AMB_CODIGO?: number;

  @ApiPropertyOptional({
    example: 'COZINHA',
    description: 'Descrição do ambiente',
  })
  AMB_DESCRICAO?: string;

  @ApiPropertyOptional({
    example: 'VENDA',
    description: 'Operação do item',
  })
  IVD_OPERACAO?: string;

  @ApiPropertyOptional({ example: 'N', description: 'Item entregue (S/N)' })
  IVD_ENTREGUE?: string;
}
