import { ApiProperty } from '@nestjs/swagger';

export class DeliveryResponseDto {
  @ApiProperty({ example: 12345, description: 'Número da venda (VEN_NUMERO)' })
  VEN_NUMERO: number;

  @ApiProperty({ example: 100, description: 'Número da entrega (ENT_NUMERO)' })
  ENT_NUMERO: number;

  @ApiProperty({ example: 1, description: 'Código do prestador (PRE_CODIGO)' })
  PRE_CODIGO: number;

  @ApiProperty({
    example: 'Prestador Exemplo',
    description: 'Nome do prestador (PRE_NOME)',
  })
  PRE_NOME: string;

  @ApiProperty({ example: 1, description: 'Código da situação (SIT_CODIGO)' })
  SIT_CODIGO: number;

  @ApiProperty({ example: 9999, description: 'Código do usuário (USU_CODIGO)' })
  USU_CODIGO: number;

  @ApiProperty({
    example: '2026-05-18',
    description: 'Data da entrega (ENT_DATA)',
  })
  ENT_DATA: string;

  @ApiProperty({
    example: '14:30:00',
    description: 'Hora da entrega (ENT_HORA)',
  })
  ENT_HORA: string;

  @ApiProperty({
    example: 120.5,
    description: 'Kilometragem da entrega (ENT_KILOMETRAGEM)',
  })
  ENT_KILOMETRAGEM: number;

  @ApiProperty({
    example: 'ABC-1234',
    description: 'Placa do veículo (VEI_PLACA)',
  })
  VEI_PLACA: string;

  @ApiProperty({
    example: '2026-05-18',
    description: 'Data da baixa da entrega (ENT_DATABAIXA)',
  })
  ENT_DATABAIXA: string;

  @ApiProperty({ example: 5, description: 'Lote da entrega (ENT_LOTEENTREGA)' })
  ENT_LOTEENTREGA: number;
}

export class DeliveryItemResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Número do item da entrega (ETI_NUMERO)',
  })
  ETI_NUMERO: number;

  @ApiProperty({
    example: 50,
    description: 'Número do item de venda (IVD_NUMERO)',
  })
  IVD_NUMERO: number;

  @ApiProperty({ example: 12345, description: 'Número da venda (VEN_NUMERO)' })
  VEN_NUMERO: number;

  @ApiProperty({
    example: 'PROD-123',
    description: 'Código do produto (PRO_CODIGO)',
  })
  PRO_CODIGO: string;

  @ApiProperty({
    example: 'Produto de Teste',
    description: 'Descrição do produto (PRO_DESCRICAO)',
  })
  PRO_DESCRICAO: string;

  @ApiProperty({ example: 9999, description: 'Código do usuário (USU_CODIGO)' })
  USU_CODIGO: number;

  @ApiProperty({
    example: '2026-05-18',
    description: 'Data do item (ETI_DATA)',
  })
  ETI_DATA: string;

  @ApiProperty({ example: '14:30:00', description: 'Hora do item (ETI_HORA)' })
  ETI_HORA: string;

  @ApiProperty({ example: 2, description: 'Quantidade do item (ETI_QTDE)' })
  ETI_QTDE: number;

  @ApiProperty({ example: 'N', description: 'Imprimir item (ETI_IMPRIMIR)' })
  ETI_IMPRIMIR: string;

  @ApiProperty({
    example: 2,
    description: 'Quantidade do cliente (ETI_QTDECLIENTE)',
  })
  ETI_QTDECLIENTE: number;
}

export class DeliveryDetailResponseDto extends DeliveryResponseDto {
  @ApiProperty({
    example: 'Entregar no período da tarde',
    description: 'Observações da entrega (ENT_OBS)',
  })
  ENT_OBS: string;

  @ApiProperty({ example: 'S', description: 'Imprimir entrega (ENT_IMPRIMIR)' })
  ENT_IMPRIMIR: string;

  @ApiProperty({ example: 10, description: 'Código do ajuste (AJU_CODIGO)' })
  AJU_CODIGO: number;

  @ApiProperty({ example: 2, description: 'Código da tabela (TBS_CODIGO)' })
  TBS_CODIGO: number;

  @ApiProperty({ example: 3, description: 'Código da agenda (AJA_CODIGO)' })
  AJA_CODIGO: number;

  @ApiProperty({ example: 4, description: 'Código do separador (SEP_CODIGO)' })
  SEP_CODIGO: number;

  @ApiProperty({
    example: 'LOTE-99',
    description: 'Lote do produto (ENT_LOTEPRODUTO)',
  })
  ENT_LOTEPRODUTO: string;

  @ApiProperty({
    example: 9999,
    description: 'Usuário de baixa da entrega (USU_CODIGOBXA)',
  })
  USU_CODIGOBXA: number;

  @ApiProperty({
    example: 'S',
    description: 'Gerar rotas para entrega (ENT_GERARROTAS)',
  })
  ENT_GERARROTAS: string;

  @ApiProperty({
    example: 12,
    description: 'Código do segundo ajuste (AJ2_CODIGO)',
  })
  AJ2_CODIGO: number;

  @ApiProperty({
    example: 'Volvo FH 540',
    description: 'Modelo do veículo (VEI_MODELO)',
  })
  VEI_MODELO: string;

  @ApiProperty({
    type: [DeliveryItemResponseDto],
    description: 'Itens da entrega',
  })
  items: DeliveryItemResponseDto[];
}
