import { ApiProperty } from '@nestjs/swagger';

export class OrderResponseDto {
  @ApiProperty({ example: 12345, description: 'Número da venda' })
  VEN_NUMERO: number;

  @ApiProperty({ example: 'WEB-12345', description: 'Número da venda no site' })
  VEN_NUMSITE: string;

  @ApiProperty({ example: 1, description: 'Código da loja' })
  LOJ_CODIGO: number;

  @ApiProperty({ example: 'E', description: 'Tipo da venda' })
  VEN_TIPO: string;

  @ApiProperty({ example: '2024-05-10T00:00:00.000Z', description: 'Data da venda' })
  VEN_DATA: string;

  @ApiProperty({ example: '14:30:00', description: 'Hora da venda' })
  VEN_HORA: string;

  @ApiProperty({ example: 1, description: 'Código da forma de pagamento' })
  FP1_CODIGO: number;

  @ApiProperty({ example: 'Dinheiro', description: 'Descrição da forma de pagamento' })
  fpg_descricao: string;

  @ApiProperty({ example: 1, description: 'Código do plano de pagamento' })
  pp1_codigo: number;

  @ApiProperty({ example: 'A Vista', description: 'Descrição do plano de pagamento' })
  plp_descricao: string;

  @ApiProperty({ example: 250.50, description: 'Valor total líquido' })
  ven_totalliquido: number;

  @ApiProperty({ example: 123, description: 'Código do cliente' })
  CLI_CODIGO: number;

  @ApiProperty({ example: 'Cliente Exemplo', description: 'Nome do cliente' })
  CLI_NOME: string;
}

export class OrderItemResponseDto {
  @ApiProperty({ example: 1, description: 'Sequência do item' })
  ITE_SEQUENCIA: number;

  @ApiProperty({ example: 101, description: 'Código do produto' })
  PRO_CODIGO: number;

  @ApiProperty({ example: 2, description: 'Quantidade' })
  ITE_QUANT: number;

  @ApiProperty({ example: 150.00, description: 'Preço unitário' })
  ITE_PRECO: number;
}

export class OrderDetailResponseDto extends OrderResponseDto {
  @ApiProperty({ example: '1', description: 'Preço da venda' })
  VEN_PRECO: string;

  @ApiProperty({ example: 300.00, description: 'Valor total bruto' })
  VEN_TOTALBRUTO: number;

  @ApiProperty({ example: 49.50, description: 'Valor total de desconto' })
  ven_totaldesc: number;

  @ApiProperty({ example: 2, description: 'Quantidade total de itens' })
  ven_quant: number;

  @ApiProperty({ type: [OrderItemResponseDto], description: 'Itens do pedido' })
  items: OrderItemResponseDto[];
}
