import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CallCenterResponseDto {
  @ApiProperty({ description: 'Número do atendimento (CAL_NUMERO)' })
  CAL_NUMERO: number;

  @ApiProperty({ description: 'Código do cliente (CLI_CODIGO)' })
  CLI_CODIGO: number;

  @ApiProperty({ description: 'Código do usuário (USU_CODIGO)' })
  USU_CODIGO: number;

  @ApiProperty({ description: 'Data do atendimento (CAL_DATA)' })
  CAL_DATA: string;

  @ApiProperty({ description: 'Hora do atendimento (CAL_HORA)' })
  CAL_HORA: string;

  @ApiProperty({ description: 'Status do atendimento (CAL_STATUS)' })
  CAL_STATUS: string;

  @ApiPropertyOptional({ description: 'Contato (CAL_CONTATO)' })
  CAL_CONTATO?: string;

  @ApiPropertyOptional({ description: 'Data da próxima ligação (CAL_DATAPROXLIGACAO)' })
  CAL_DATAPROXLIGACAO?: string;

  @ApiPropertyOptional({ description: 'Hora da próxima ligação (CAL_HORAPROXLIGACAO)' })
  CAL_HORAPROXLIGACAO?: string;

  @ApiPropertyOptional({ description: 'Depoimento (CAL_DEPOIMENTO)' })
  CAL_DEPOIMENTO?: string;

  @ApiPropertyOptional({ description: 'Relatório do atendimento (CAL_RELATORIO)' })
  CAL_RELATORIO?: string;

  @ApiPropertyOptional({ description: 'Data de baixa (CAL_DATABAIXA)' })
  CAL_DATABAIXA?: string;

  @ApiPropertyOptional({ description: 'Hora de baixa (CAL_HORABAIXA)' })
  CAL_HORABAIXA?: string;

  @ApiPropertyOptional({ description: 'Número do vendedor (VEN_NUMERO)' })
  VEN_NUMERO?: number;

  @ApiPropertyOptional({ description: 'Número do passaporte/pacote (PAS_NUMERO)' })
  PAS_NUMERO?: number;

  @ApiProperty({ description: 'Código da forma de atendimento (FAT_CODIGO)' })
  FAT_CODIGO: number;

  @ApiPropertyOptional({ description: 'Descrição da forma de atendimento (FAT_DESCRICAO)' })
  FAT_DESCRICAO?: string;

  @ApiPropertyOptional({ description: 'Código do tópico (TOP_CODIGO)' })
  TOP_CODIGO?: number;

  @ApiPropertyOptional({ description: 'Descrição do tópico (TOP_DESCRICAO)' })
  TOP_DESCRICAO?: string;

  @ApiPropertyOptional({ description: 'Código da aplicação (APL_CODIGO)' })
  APL_CODIGO?: number;

  @ApiPropertyOptional({ description: 'Descrição da aplicação (APL_DESCRICAO)' })
  APL_DESCRICAO?: string;

  @ApiPropertyOptional({ description: 'Identificação da loja (CAL_LOJA)' })
  CAL_LOJA?: string;

  @ApiPropertyOptional({ description: 'Indicador de bloqueado (CAL_BLOQUEADO)' })
  CAL_BLOQUEADO?: string;

  @ApiPropertyOptional({ description: 'Código da loja (LOJ_CODIGO)' })
  LOJ_CODIGO?: number;

  @ApiPropertyOptional({ description: 'E-mail enviado (CAL_EMAILENVIADO)' })
  CAL_EMAILENVIADO?: string;

  @ApiPropertyOptional({ description: 'Outras informações (CAL_OUTRASINFO)' })
  CAL_OUTRASINFO?: string;
}
