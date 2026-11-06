import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductionOrderResponseDto {
  @ApiProperty({
    example: 201,
    description: 'Número identificador da Ordem de Produção (ORP_NUMERO)',
  })
  ORP_NUMERO: number;

  @ApiProperty({
    example: 1,
    description: 'Código da situação da ordem (SIT_CODIGO)',
  })
  SIT_CODIGO: number;

  @ApiPropertyOptional({
    example: 'EM ANDAMENTO',
    description: 'Descrição da situação',
  })
  SIT_DESCRICAO?: string;

  @ApiProperty({
    example: 1,
    description: 'Código da loja/filial (LOJ_CODIGO)',
  })
  LOJ_CODIGO: number;

  @ApiPropertyOptional({
    example: 'LOJA MATRIZ',
    description: 'Razão social da loja',
  })
  LOJ_NOME?: string;

  @ApiPropertyOptional({
    example: 'MATRIZ',
    description: 'Nome fantasia da loja',
  })
  LOJ_FANTASIA?: string;

  @ApiProperty({
    example: 10,
    description: 'Código do usuário operador/criador (USU_CODIGO)',
  })
  USU_CODIGO: number;

  @ApiPropertyOptional({
    example: 'operador.joao',
    description: 'Apelido do usuário responsável',
  })
  USU_APELIDO?: string;

  @ApiProperty({
    example: '2026-03-15T00:00:00.000Z',
    description: 'Data de registro da ordem (ORP_DATA)',
  })
  ORP_DATA: string;

  @ApiPropertyOptional({
    example: '08:30:00',
    description: 'Hora de registro da ordem (ORP_HORA)',
  })
  ORP_HORA?: string;

  @ApiPropertyOptional({
    example: '2026-03-15T00:00:00.000Z',
    description: 'Data de início prevista ou real (ORP_DATAINICIO)',
  })
  ORP_DATAINICIO?: string;

  @ApiPropertyOptional({
    example: '2026-03-20T00:00:00.000Z',
    description: 'Data final prevista ou real (ORP_DATAFINAL)',
  })
  ORP_DATAFINAL?: string;

  @ApiProperty({
    example: '00000000000045',
    description: 'Código do produto acabado produzido (PRO_CODIGO)',
  })
  PRO_CODIGO: string;

  @ApiPropertyOptional({
    example: 'BOLO DE CHOCOLATE 1KG',
    description: 'Descrição do produto principal produzido',
  })
  PRO_DESCRICAO?: string;

  @ApiPropertyOptional({
    example: 'UN',
    description: 'Unidade de medida do produto principal',
  })
  PRO_UNIDADE?: string;

  @ApiPropertyOptional({
    example: '7891234560045',
    description: 'Código de barras do produto principal',
  })
  PRO_CODIGOBAR?: string;

  @ApiPropertyOptional({
    example: 2,
    description: 'Etapa / fase do processo produtivo (ETA_NUMERO)',
  })
  ETA_NUMERO?: number;

  @ApiPropertyOptional({
    example: 105,
    description: 'Identificador de composição / compra 1 (COM_NUMERO)',
  })
  COM_NUMERO?: number;

  @ApiPropertyOptional({
    example: 105,
    description: 'Identificador de composição / compra 2 (COM_NUMERO2)',
  })
  COM_NUMERO2?: number;

  @ApiPropertyOptional({
    example: 50.0,
    description: 'Quantidade planejada a ser produzida (ORP_QUANTIDADE)',
  })
  ORP_QUANTIDADE?: number;

  @ApiPropertyOptional({
    example: 48.0,
    description: 'Quantidade efetivamente acabada (ORP_QUANTIDADEACABADA)',
  })
  ORP_QUANTIDADEACABADA?: number;

  @ApiPropertyOptional({
    example: 720.5,
    description: 'Valor total acumulado da produção (ORP_TOTAL)',
  })
  ORP_TOTAL?: number;

  @ApiPropertyOptional({
    example: 'Produção lote especial de páscoa',
    description: 'Observações da ordem de produção (ORP_OBS)',
  })
  ORP_OBS?: string;

  @ApiPropertyOptional({
    example: '2026-03-20T00:00:00.000Z',
    description: 'Data em que a ordem foi baixada/finalizada (ORP_DATABAIXA)',
  })
  ORP_DATABAIXA?: string;

  @ApiPropertyOptional({
    example: '17:45:00',
    description: 'Hora da baixa da ordem (ORP_HORABAIXA)',
  })
  ORP_HORABAIXA?: string;

  @ApiPropertyOptional({
    example: 301,
    description: 'Número de saída / documento auxiliar (SDA_NUMERO)',
  })
  SDA_NUMERO?: number;
}

