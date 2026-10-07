import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdjustmentResponseDto {
  @ApiProperty({ example: 105, description: 'Número do acerto (ACE_NUMERO)' })
  ACE_NUMERO: number;

  @ApiProperty({ example: 1, description: 'Código da situação (SIT_CODIGO)' })
  SIT_CODIGO: number;

  @ApiPropertyOptional({
    example: 'FINALIZADO',
    description: 'Descrição da situação',
  })
  SIT_DESCRICAO?: string;

  @ApiProperty({ example: 1, description: 'Código da loja (LOJ_CODIGO)' })
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
    example: 1,
    description: 'Código do usuário responsável (USU_CODIGO)',
  })
  USU_CODIGO: number;

  @ApiPropertyOptional({
    example: 'ADMINISTRADOR',
    description: 'Nome do usuário',
  })
  USU_NOME?: string;

  @ApiPropertyOptional({ example: 'admin', description: 'Apelido do usuário' })
  USU_APELIDO?: string;

  @ApiProperty({
    example: '2026-02-10T00:00:00.000Z',
    description: 'Data do acerto (ACE_DATA)',
  })
  ACE_DATA: string;

  @ApiPropertyOptional({
    example: '14:30:00',
    description: 'Hora do acerto (ACE_HORA)',
  })
  ACE_HORA?: string;

  @ApiPropertyOptional({
    example: '2026-02-10T00:00:00.000Z',
    description: 'Data da baixa do acerto',
  })
  ACE_DATABAIXA?: string;

  @ApiPropertyOptional({
    example: '14:35:00',
    description: 'Hora da baixa do acerto',
  })
  ACE_HORABAIXA?: string;

  @ApiPropertyOptional({
    example: 'Acerto de inventário',
    description: 'Observação 1',
  })
  ACE_OBS1?: string;

  @ApiPropertyOptional({
    example: 'Setor de bebidas',
    description: 'Observação 2',
  })
  ACE_OBS2?: string;

  @ApiPropertyOptional({ example: 350.5, description: 'Valor total do acerto' })
  ACE_TOTAL?: number;

  @ApiPropertyOptional({
    example: 25.0,
    description: 'Quantidade total de peças ajustadas',
  })
  ACE_QUANTIDADE?: number;

  @ApiPropertyOptional({
    example: '2026-02-10T00:00:00.000Z',
    description: 'Data de alteração',
  })
  ACE_DATAALTERACAO?: string;

  @ApiProperty({ example: '1', description: 'Tipo do acerto (ACE_TIPO)' })
  ACE_TIPO: string;

  @ApiPropertyOptional({
    example: 'N',
    description: 'Indica se gerou documento fiscal (S/N)',
  })
  ACE_GEROUFISCO?: string;

  @ApiPropertyOptional({
    example: 12345,
    description: 'Número da nota fiscal associada (NTF_NUMERO)',
  })
  NTF_NUMERO?: number;
}
