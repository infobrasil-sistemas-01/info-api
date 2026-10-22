import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AbcCurvePeriodDto {
  @ApiProperty({ example: '2026-01-22', description: 'Data inicial apurada' })
  startDate: string;

  @ApiProperty({ example: '2026-10-22', description: 'Data final apurada' })
  endDate: string;
}

export class AbcCurveSummaryDto {
  @ApiProperty({
    example: 57.0,
    description: 'Quantidade física total de itens vendidos no período apurado',
  })
  totalQuantity: number;

  @ApiProperty({
    example: 27275.88,
    description: 'Valor financeiro total faturado no período apurado',
  })
  totalValue: number;

  @ApiProperty({
    example: 6,
    description: 'Quantidade total de entidades apuradas nesta dimensão',
  })
  entityCount: number;
}

export class AbcCurvePaginationDto {
  @ApiProperty({ example: 1, description: 'Página atual' })
  page: number;

  @ApiProperty({ example: 50, description: 'Quantidade de registros por página' })
  pageSize: number;

  @ApiProperty({ example: 1, description: 'Total de páginas' })
  totalPages: number;

  @ApiProperty({ example: 6, description: 'Total geral de registros encontrados' })
  totalItems: number;
}

export class AbcCurveItemDto {
  @ApiProperty({ example: 1, description: 'Posição na ordenação / ranking' })
  position: number;

  @ApiProperty({
    example: 41,
    description:
      'Código identificador da entidade no ERP (Vendedor, Loja, Grupo, Marca, Cliente ou Produto)',
  })
  code: number;

  @ApiProperty({
    example: 'ALISSON - HOMOBR',
    description: 'Nome ou descrição textual da entidade apurada',
  })
  name: string;

  @ApiProperty({
    example: 1.0,
    description: 'Quantidade física acumulada vendida no período',
  })
  soldQuantity: number;

  @ApiProperty({
    example: 100.0,
    description: 'Valor financeiro líquido total faturado pela entidade no período',
  })
  soldValue: number;

  @ApiProperty({
    example: 1.75,
    description: 'Percentual da quantidade desta entidade em relação ao total (% Qtd)',
  })
  quantityPercent: number;

  @ApiProperty({
    example: 0.37,
    description: 'Percentual do valor desta entidade em relação ao total (% Valor)',
  })
  valuePercent: number;

  @ApiProperty({
    example: 0.37,
    description: 'Percentual acumulado progressivo do faturamento (% Acum)',
  })
  cumulativePercent: number;

  @ApiProperty({
    example: 'A',
    description: 'Classificação na Curva ABC (A: até 70%, B: 70-90%, C: 90-100%)',
    enum: ['A', 'B', 'C'],
  })
  classification: 'A' | 'B' | 'C';
}

export class AbcCurveResponseDto {
  @ApiProperty({
    example: 'SELLER',
    description: 'Dimensão de agrupamento apurada',
    enum: ['SELLER', 'STORE', 'GROUP', 'BRAND', 'CUSTOMER', 'PRODUCT'],
  })
  dimension: string;

  @ApiProperty({
    type: AbcCurvePeriodDto,
    description: 'Período filtrado na consulta',
  })
  period: AbcCurvePeriodDto;

  @ApiProperty({
    type: AbcCurveSummaryDto,
    description: 'Totais consolidados do período',
  })
  summary: AbcCurveSummaryDto;

  @ApiPropertyOptional({
    type: AbcCurvePaginationDto,
    description: 'Metadados de paginação (presente quando page e pageSize são aplicados)',
  })
  pagination?: AbcCurvePaginationDto;

  @ApiProperty({
    type: [AbcCurveItemDto],
    description: 'Linhas detalhadas da Curva ABC ordenadas conforme solicitado',
  })
  items: AbcCurveItemDto[];
}
