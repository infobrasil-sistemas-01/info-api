import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderResponseDto {
  @ApiProperty({ example: 12345, description: 'Número da venda' })
  VEN_NUMERO: number;

  @ApiProperty({ example: 1, description: 'Código da situação da venda' })
  SIT_CODIGO: number;

  @ApiProperty({ example: 'WEB-12345', description: 'Número da venda no site' })
  VEN_NUMSITE: string;

  @ApiProperty({ example: 1, description: 'Código da loja' })
  LOJ_CODIGO: number;

  @ApiPropertyOptional({ example: 1, description: 'Código do funcionário' })
  FUN_CODIGO?: number;

  @ApiPropertyOptional({ example: 1, description: 'Código do funcionário (minúsculo)' })
  fun_codigo?: number;

  @ApiPropertyOptional({
    example: 'Funcionário Exemplo',
    description: 'Nome do funcionário',
  })
  FUN_NOME?: string;

  @ApiPropertyOptional({
    example: 'Funcionário Exemplo',
    description: 'Nome do funcionário (minúsculo)',
  })
  fun_nome?: string;

  @ApiPropertyOptional({ example: 1, description: 'Código do usuário/operador' })
  USU_CODIGO?: number;

  @ApiPropertyOptional({ example: 1, description: 'Código do usuário/operador (minúsculo)' })
  usu_codigo?: number;

  @ApiPropertyOptional({ example: 'INFO-MOBILE', description: 'Apelido do usuário/operador' })
  USU_APELIDO?: string;

  @ApiPropertyOptional({ example: 'INFO-MOBILE', description: 'Apelido do usuário/operador (minúsculo)' })
  usu_apelido?: string;

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

  @ApiPropertyOptional({
    example: 'Dinheiro',
    description: 'Descrição da forma de pagamento',
  })
  fpg_descricao?: string;

  @ApiPropertyOptional({
    example: 'Dinheiro',
    description: 'Descrição da forma de pagamento (maiúsculo)',
  })
  FPG_DESCRICAO?: string;

  @ApiPropertyOptional({ example: 1, description: 'Código do plano de pagamento' })
  pp1_codigo?: number;

  @ApiPropertyOptional({ example: 1, description: 'Código do plano de pagamento (maiúsculo)' })
  PP1_CODIGO?: number;

  @ApiPropertyOptional({
    example: 'A Vista',
    description: 'Descrição do plano de pagamento',
  })
  plp_descricao?: string;

  @ApiPropertyOptional({
    example: 'A Vista',
    description: 'Descrição do plano de pagamento (maiúsculo)',
  })
  PLP_DESCRICAO?: string;

  @ApiPropertyOptional({ example: 250.5, description: 'Valor total líquido' })
  ven_totalliquido?: number;

  @ApiPropertyOptional({ example: 250.5, description: 'Valor total líquido (maiúsculo)' })
  VEN_TOTALLIQUIDO?: number;

  @ApiPropertyOptional({ example: 123, description: 'Código do cliente' })
  CLI_CODIGO?: number;

  @ApiPropertyOptional({ example: 123, description: 'Código do cliente (minúsculo)' })
  cli_codigo?: number;

  @ApiPropertyOptional({ example: 'Cliente Exemplo', description: 'Nome do cliente' })
  CLI_NOME?: string;

  @ApiPropertyOptional({ example: 'Cliente Exemplo', description: 'Nome do cliente (minúsculo)' })
  cli_nome?: string;
}

export class OrderItemResponseDto {
  @ApiProperty({ example: 101, description: 'Código do produto' })
  PRO_CODIGO: number;

  @ApiProperty({
    example: 'Produto de Teste',
    description: 'Descrição do produto',
  })
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

  @ApiProperty({
    example: 'ENTREGA',
    description: 'Descrição da modalidade de entrega',
  })
  TRM_DESCRICAO: string;

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

export class OrderDetailResponseDto extends OrderResponseDto {
  @ApiPropertyOptional({ example: '1', description: 'Preço da venda' })
  VEN_PRECO?: string;

  @ApiPropertyOptional({ example: 300.0, description: 'Valor total bruto' })
  VEN_TOTALBRUTO?: number;

  @ApiPropertyOptional({ example: 49.5, description: 'Valor total de desconto' })
  VEN_TOTALDESC?: number;

  @ApiPropertyOptional({ example: 0.0, description: 'Valor pendente da venda' })
  VEN_VALORPENDENTE?: number;

  @ApiPropertyOptional({ example: 0.0, description: 'Valor dos encargos' })
  VEN_VALORENC?: number;

  @ApiPropertyOptional({
    example: '2026-08-01T00:00:00.000Z',
    description: 'Data de previsão de entrega',
  })
  VEN_DTPREVISAOENT?: string;

  @ApiPropertyOptional({ example: 'R', description: 'Origem/Canal do DAV' })
  VEN_ORIGEMDAV?: string;

  @ApiPropertyOptional({ example: 2, description: 'Quantidade total de itens' })
  VEN_QUANT?: number;

  @ApiPropertyOptional({
    example: '2026-07-20T00:00:00.000Z',
    description: 'Data de entrega',
  })
  VEN_ENTREGA?: string;

  @ApiPropertyOptional({
    example: '2026-07-22T00:00:00.000Z',
    description: 'Data de montagem',
  })
  VEN_MONTAGEM?: string;

  @ApiPropertyOptional({ example: 1, description: 'Código da transportadora' })
  TRA_CODIGO?: number;

  @ApiPropertyOptional({
    example: 'Transportadora Exemplo',
    description: 'Nome da transportadora',
  })
  TRA_NOME?: string;

  @ApiPropertyOptional({ example: 15.0, description: 'Valor do frete/entrega' })
  VEN_VALORENT?: number;

  @ApiPropertyOptional({
    example: '2026-07-23T00:00:00.000Z',
    description: 'Data da montagem agendada',
  })
  MON_DATA?: string;

  @ApiPropertyOptional({ example: 3.0, description: 'Peso total calculado do pedido' })
  PESO?: number;

  @ApiProperty({ type: [OrderItemResponseDto], description: 'Itens do pedido' })
  items: OrderItemResponseDto[];
}
