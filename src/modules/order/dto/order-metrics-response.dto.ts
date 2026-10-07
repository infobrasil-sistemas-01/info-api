import { ApiProperty } from '@nestjs/swagger';

export class OrderMetricsResponseDto {
  @ApiProperty({
    example: 100,
    description: 'Total de pedidos baixados/concluídos no período',
  })
  totalOrders: number;

  @ApiProperty({
    example: 224597.99,
    description: 'Faturamento total líquido de pedidos baixados no período',
  })
  billing: number;

  @ApiProperty({
    example: 2245.98,
    description:
      'Ticket médio por pedido baixado no período (billing / totalOrders)',
  })
  averageTicket: number;

  @ApiProperty({
    example: 22,
    description:
      'Total de pedidos em aberto (pendentes ou aprovados) no período',
  })
  openOrders: number;
}
