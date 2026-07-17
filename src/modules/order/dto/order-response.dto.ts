import { ApiProperty } from '@nestjs/swagger';

export class OrderResponseDto {
  @ApiProperty({ example: 12345, description: 'Número da venda' })
  VEN_NUMERO: number;

  @ApiProperty({ example: 1, description: 'Código da situação da venda' })
  SIT_CODIGO: number;

  @ApiProperty({ example: 'WEB-12345', description: 'Número da venda no site' })
  VEN_NUMSITE: string;

  @ApiProperty({ example: 1, description: 'Código da loja' })
  LOJ_CODIGO: number;

  @ApiProperty({ example: 1, description: 'Código do funcionário' })
  FUN_CODIGO: number;

  @ApiProperty({
    example: 'Funcionário Exemplo',
    description: 'Nome do funcionário',
  })
  FUN_NOME: string;

  @ApiProperty({ example: 'E', description: 'Tipo da venda' })
  VEN_TIPO: string;

  @ApiProperty({
    example: '2024-05-10T00:00:00.000Z',
    description: 'Data da venda',
  })
  VEN_DATA: string;

  @ApiProperty({ example: '14:30:00', description: 'Hora da venda' })
  VEN_HORA: string;

  @ApiProperty({ example: 1, description: 'Código da forma de pagamento' })
  FP1_CODIGO: number;

  @ApiProperty({
    example: 'Dinheiro',
    description: 'Descrição da forma de pagamento',
  })
  fpg_descricao: string;

  @ApiProperty({ example: 1, description: 'Código do plano de pagamento' })
  pp1_codigo: number;

  @ApiProperty({
    example: 'A Vista',
    description: 'Descrição do plano de pagamento',
  })
  plp_descricao: string;

  @ApiProperty({ example: 250.5, description: 'Valor total líquido' })
  ven_totalliquido: number;

  @ApiProperty({ example: 123, description: 'Código do cliente' })
  CLI_CODIGO: number;

  @ApiProperty({ example: 'Cliente Exemplo', description: 'Nome do cliente' })
  CLI_NOME: string;
}

export class OrderItemResponseDto {
  @ApiProperty({ example: 101, description: 'Código do produto' })
  PRO_CODIGO: number;

  @ApiProperty({ example: 'Produto de Teste', description: 'Descrição do produto' })
  PRO_DESCRICAO: string;

  @ApiProperty({ example: 1.5, description: 'Peso do produto' })
  PRO_PESO: number;

  @ApiProperty({ example: 150.0, description: 'Preço unitário do item' })
  IVD_PRECO: number;

  @ApiProperty({ example: 2, description: 'Quantidade vendida' })
  IVD_QTDE: number;

  @ApiProperty({ example: 300.0, description: 'Valor total bruto do item' })
  IVD_TOTAL: number;

  @ApiProperty({ example: 0.0, description: 'Desconto aplicado no item' })
  IVD_DESCONTO: number;

  @ApiProperty({ example: 300.0, description: 'Valor líquido do item' })
  IVD_LIQUIDO: number;

  @ApiProperty({ example: '3', description: 'Código da modalidade de entrega' })
  TRM_CODIGO: string;

  @ApiProperty({ example: 'ENTREGA', description: 'Descrição da modalidade de entrega' })
  TRM_DESCRICAO: string;
}

export class OrderDetailResponseDto extends OrderResponseDto {
  @ApiProperty({ example: '1', description: 'Preço da venda' })
  VEN_PRECO: string;

  @ApiProperty({ example: 300.0, description: 'Valor total bruto' })
  VEN_TOTALBRUTO: number;

  @ApiProperty({ example: 49.5, description: 'Valor total de desconto' })
  VEN_TOTALDESC: number;

  @ApiProperty({ example: 250.5, description: 'Valor total líquido' })
  VEN_TOTALLIQUIDO: number;

  @ApiProperty({ example: 2, description: 'Quantidade total de itens' })
  VEN_QUANT: number;

  @ApiProperty({ example: '2026-07-20T00:00:00.000Z', description: 'Data de entrega' })
  VEN_ENTREGA: string;

  @ApiProperty({ example: '2026-07-22T00:00:00.000Z', description: 'Data de montagem' })
  VEN_MONTAGEM: string;

  @ApiProperty({ example: 1, description: 'Código da transportadora' })
  TRA_CODIGO: number;

  @ApiProperty({ example: 'Transportadora Exemplo', description: 'Nome da transportadora' })
  TRA_NOME: string;

  @ApiProperty({ example: 15.0, description: 'Valor do frete/entrega' })
  VEN_VALORENT: number;

  @ApiProperty({ example: '2026-07-23T00:00:00.000Z', description: 'Data da montagem agendada' })
  MON_DATA: string;

  @ApiProperty({ example: 3.0, description: 'Peso total calculado do pedido' })
  PESO: number;

  @ApiProperty({ example: 'Dinheiro', description: 'Descrição da forma de pagamento' })
  FPG_DESCRICAO: string;

  @ApiProperty({ example: 1, description: 'Código do plano de pagamento' })
  PP1_CODIGO: number;

  @ApiProperty({ example: 'A Vista', description: 'Descrição do plano de pagamento' })
  PLP_DESCRICAO: string;

  @ApiProperty({ type: [OrderItemResponseDto], description: 'Itens do pedido' })
  items: OrderItemResponseDto[];
}
