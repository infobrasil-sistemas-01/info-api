import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdjustmentItemResponseDto {
  @ApiProperty({ example: 1, description: 'Número sequencial do item de acerto (IAC_NUMERO)' })
  IAC_NUMERO: number;

  @ApiProperty({ example: 101, description: 'Número do acerto pai (ACE_NUMERO)' })
  ACE_NUMERO: number;

  @ApiProperty({ example: '00000000000001', description: 'Código do produto (PRO_CODIGO)' })
  PRO_CODIGO: string;

  @ApiPropertyOptional({ example: '7891234567890', description: 'Código de barras do produto' })
  PRO_CODIGOBAR?: string;

  @ApiPropertyOptional({ example: 'PRODUTO TESTE ABC', description: 'Descrição do produto' })
  PRO_DESCRICAO?: string;

  @ApiPropertyOptional({ example: 'UN', description: 'Unidade de medida do produto' })
  PRO_UNIDADE?: string;

  @ApiPropertyOptional({ example: 'REF-123', description: 'Referência do produto' })
  PRO_REFERENCIA?: string;

  @ApiPropertyOptional({ example: 1, description: 'Código da marca' })
  MAR_CODIGO?: number;

  @ApiPropertyOptional({ example: 'MARCA EXEMPLO', description: 'Descrição da marca' })
  MAR_DESCRICAO?: string;

  @ApiPropertyOptional({ example: 2, description: 'Código do grupo' })
  GRU_CODIGO?: number;

  @ApiPropertyOptional({ example: 'GRUPO EXEMPLO', description: 'Descrição do grupo' })
  GRU_DESCRICAO?: string;

  @ApiProperty({ example: 10.0, description: 'Quantidade ajustada (IAC_QTDE)' })
  IAC_QTDE: number;

  @ApiPropertyOptional({ example: 15.5, description: 'Preço unitário no acerto (IAC_PRECO)' })
  IAC_PRECO?: number;

  @ApiPropertyOptional({ example: 155.0, description: 'Valor total do item (IAC_TOTAL)' })
  IAC_TOTAL?: number;

  @ApiPropertyOptional({ example: 'E', description: 'Tipo do acerto do item: E=Entrada, S=Saída (IAC_TIPOACE)' })
  IAC_TIPOACE?: string;

  @ApiPropertyOptional({ example: 12.0, description: 'Quantidade contada em inventário (IAC_QTDECONTADA)' })
  IAC_QTDECONTADA?: number;

  @ApiPropertyOptional({ example: 2.0, description: 'Estoque no momento do acerto (IAC_ESTATUAL)' })
  IAC_ESTATUAL?: number;

  @ApiPropertyOptional({ example: 'Inventário rotativo', description: 'Motivo do acerto (IAC_MOTIVO)' })
  IAC_MOTIVO?: string;

  @ApiPropertyOptional({ example: 'G', description: 'Código do tamanho (TAM_CODIGO)' })
  TAM_CODIGO?: string;

  @ApiPropertyOptional({ example: 1, description: 'Código da cor (COR_CODIGO)' })
  COR_CODIGO?: number;

  @ApiPropertyOptional({ example: '00000000000001', description: 'Código da grade (PRG_CODIGO)' })
  PRG_CODIGO?: string;

  @ApiPropertyOptional({ example: 0, description: 'Quantidade em grade (IAC_QTDEGRADE)' })
  IAC_QTDEGRADE?: number;
}
