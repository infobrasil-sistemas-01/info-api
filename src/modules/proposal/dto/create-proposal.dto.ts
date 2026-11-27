import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

const dateStrSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido de data. Use YYYY-MM-DD');

const timeStrSchema = z
  .string()
  .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Formato inválido de hora. Use HH:mm ou HH:mm:ss');

const priceTableSchema = z
  .union([
    z
      .number()
      .int('Tabela de preço deve ser um número inteiro')
      .min(1, 'Tabela de preço deve ser entre 1 e 12')
      .max(12, 'Tabela de preço deve ser entre 1 e 12'),
    z
      .string()
      .trim()
      .regex(/^(?:[1-9]|1[0-2])$/, 'Tabela de preço deve ser entre 1 e 12'),
  ])
  .transform((val) => String(val));

const proStatusSchema = z
  .union([
    z
      .number()
      .int('PRO_STATUS deve ser um número inteiro de 0 a 9')
      .min(0, 'PRO_STATUS deve ser entre 0 e 9')
      .max(9, 'PRO_STATUS deve ser entre 0 e 9'),
    z.string().trim().max(1, 'PRO_STATUS deve ter no máximo 1 caractere'),
  ])
  .transform((val) => String(val));

export const CreateProposalItemSchema = z.object({
  PRO_CODIGO: z.string().min(1, 'PRO_CODIGO é obrigatório').max(14),
  IPR_QTDE: z.number().positive('IPR_QTDE deve ser maior que zero'),
  IPR_PRECO: z.number().min(0).optional(),
  IPR_TOTAL: z.number().min(0).optional(),
  IPR_DESCONTO: z.number().min(0).optional().nullable(),
  IPR_LIQUIDO: z.number().min(0).optional().nullable(),
  IPR_PERCDESCONTO: z.number().min(0).optional().nullable(),
  PES_CODIGO: z.number().int().optional().nullable(),
  TEC_CODIGO: z.number().int().optional().nullable(),
  IPR_QTDEENT: z.number().min(0).optional().nullable(),
  IPR_INFADICIONAIS: z.string().max(100).optional().nullable(),
  LOJ_CODIGO: z.number().int().optional().nullable(),
  IPR_NEGATIVO: z.string().max(1).optional().nullable(),
  AMB_CODIGO: z.number().int().optional().nullable(),
  IPR_PRCVENDADIA: z.number().min(0).optional().nullable(),
  TAM_CODIGO: z.string().max(3).optional().nullable(),
  COR_CODIGO: z.number().int().optional().nullable(),
  PRG_CODIGO: z.string().max(14).optional().nullable(),
  IPR_ALTURA: z.number().min(0).optional().nullable(),
  IPR_LARGURA: z.number().min(0).optional().nullable(),
  IPR_QTDEUNT: z.number().min(0).optional().nullable(),
  PRK_CODIGO: z.string().max(14).optional().nullable(),
  IPR_TABELAPRECO: priceTableSchema.optional().nullable(),
  IPR_METRAGEMSUGERIDA: z.number().min(0).optional().nullable(),
  IPR_QTDEMETRAGEMSUGERIDA: z.number().min(0).optional().nullable(),
  TRM_CODIGO: z.number().int().optional().nullable(),
  IPR_ITEM: z.number().int().min(1).optional().nullable(),
  IPR_GARANTEESTOQUE: z.enum(['S', 'N']).optional().nullable(),
  IPR_PRCCUSTO: z.number().min(0).optional().nullable(),
  IPR_PRCCOMPRA: z.number().min(0).optional().nullable(),
  IPR_MARGEMLUCROCOMPRA: z.number().optional().nullable(),
  IPR_MARGEMLUCROCUSTO: z.number().optional().nullable(),
  IPR_ACRESCIMO: z.number().min(0).optional().nullable(),
  IPR_PERCACRESC: z.number().min(0).optional().nullable(),
});

export class CreateProposalItemDto extends ZodDto(CreateProposalItemSchema) {
  @ApiProperty({ example: '00000000000045', description: 'Código do produto (PRO_CODIGO)' })
  PRO_CODIGO: string;

  @ApiProperty({ example: 2, description: 'Quantidade (IPR_QTDE)' })
  IPR_QTDE: number;

  @ApiPropertyOptional({
    example: 50,
    description: 'Preço unitário (IPR_PRECO). Se omitido, será buscado da tabela ESTOQUE.',
  })
  IPR_PRECO?: number;

  @ApiPropertyOptional({
    example: 100,
    description: 'Total bruto do item (IPR_TOTAL). Se omitido, será calculado (IPR_QTDE * IPR_PRECO).',
  })
  IPR_TOTAL?: number;

  @ApiPropertyOptional({ example: 0, description: 'Desconto em valor (IPR_DESCONTO)' })
  IPR_DESCONTO?: number | null;

  @ApiPropertyOptional({
    example: 100,
    description: 'Valor líquido do item (IPR_LIQUIDO). Se omitido, será calculado automaticamente.',
  })
  IPR_LIQUIDO?: number | null;

  @ApiPropertyOptional({ example: 0, description: 'Percentual de desconto (IPR_PERCDESCONTO)' })
  IPR_PERCDESCONTO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PES_CODIGO' })
  PES_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'TEC_CODIGO' })
  TEC_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'IPR_QTDEENT' })
  IPR_QTDEENT?: number | null;

  @ApiPropertyOptional({ example: null, description: 'IPR_INFADICIONAIS' })
  IPR_INFADICIONAIS?: string | null;

  @ApiPropertyOptional({ example: 1, description: 'LOJ_CODIGO do item (se omitido, usa o da proposta)' })
  LOJ_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'IPR_NEGATIVO' })
  IPR_NEGATIVO?: string | null;

  @ApiPropertyOptional({ example: null, description: 'AMB_CODIGO' })
  AMB_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'IPR_PRCVENDADIA' })
  IPR_PRCVENDADIA?: number | null;

  @ApiPropertyOptional({ example: null, description: 'TAM_CODIGO' })
  TAM_CODIGO?: string | null;

  @ApiPropertyOptional({ example: null, description: 'COR_CODIGO' })
  COR_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRG_CODIGO' })
  PRG_CODIGO?: string | null;

  @ApiPropertyOptional({ example: null, description: 'IPR_ALTURA' })
  IPR_ALTURA?: number | null;

  @ApiPropertyOptional({ example: null, description: 'IPR_LARGURA' })
  IPR_LARGURA?: number | null;

  @ApiPropertyOptional({ example: null, description: 'IPR_QTDEUNT' })
  IPR_QTDEUNT?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRK_CODIGO' })
  PRK_CODIGO?: string | null;

  @ApiPropertyOptional({
    example: 1,
    description: 'Tabela de preço do item (1 a 12, padrão 1)',
    oneOf: [
      { type: 'integer', minimum: 1, maximum: 12 },
      { type: 'string', example: '1' },
    ],
  })
  IPR_TABELAPRECO?: string | null;

  @ApiPropertyOptional({ example: null, description: 'IPR_METRAGEMSUGERIDA' })
  IPR_METRAGEMSUGERIDA?: number | null;

  @ApiPropertyOptional({ example: null, description: 'IPR_QTDEMETRAGEMSUGERIDA' })
  IPR_QTDEMETRAGEMSUGERIDA?: number | null;

  @ApiPropertyOptional({ example: null, description: 'TRM_CODIGO' })
  TRM_CODIGO?: number | null;

  @ApiPropertyOptional({ example: 1, description: 'Número sequencial do item (IPR_ITEM)' })
  IPR_ITEM?: number | null;

  @ApiPropertyOptional({ example: 'N', description: 'Garante estoque S/N (IPR_GARANTEESTOQUE, padrão N)' })
  IPR_GARANTEESTOQUE?: 'S' | 'N' | null;

  @ApiPropertyOptional({ example: null, description: 'IPR_PRCCUSTO' })
  IPR_PRCCUSTO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'IPR_PRCCOMPRA' })
  IPR_PRCCOMPRA?: number | null;

  @ApiPropertyOptional({ example: null, description: 'IPR_MARGEMLUCROCOMPRA' })
  IPR_MARGEMLUCROCOMPRA?: number | null;

  @ApiPropertyOptional({ example: null, description: 'IPR_MARGEMLUCROCUSTO' })
  IPR_MARGEMLUCROCUSTO?: number | null;

  @ApiPropertyOptional({ example: 0, description: 'IPR_ACRESCIMO' })
  IPR_ACRESCIMO?: number | null;

  @ApiPropertyOptional({ example: 0, description: 'IPR_PERCACRESC' })
  IPR_PERCACRESC?: number | null;
}

export const CreateProposalSchema = z.object({
  FUN_CODIGO: z.number().int().positive('FUN_CODIGO é obrigatório'),
  SIT_CODIGO: z.number().int().positive('SIT_CODIGO é obrigatório'),
  LOJ_CODIGO: z.number().int().positive('LOJ_CODIGO é obrigatório').optional(),
  CLI_CODIGO: z.number().int().positive('CLI_CODIGO é obrigatório'),
  USU_CODIGO: z.number().int().positive().optional().nullable(),
  FPG_CODIGO: z.number().int().optional().nullable(),
  PRO_ATENCIOSAMENTE: z.string().max(40).optional().nullable(),
  PRO_PRAZO: z.string().max(40).optional().nullable(),
  PRO_VALIDADE: z.string().max(40).optional().nullable(),
  PRO_DATA: dateStrSchema.optional(),
  PRO_HORA: timeStrSchema.optional().nullable(),
  PRO_DATABAIXA: dateStrSchema.optional().nullable(),
  PRO_TOTALBRUTO: z.number().min(0).optional().nullable(),
  PRO_TOTALDESC: z.number().min(0).optional().nullable(),
  PRO_PERCDESC: z.number().min(0).optional().nullable(),
  PRO_TOTALLIQUIDO: z.number().min(0).optional().nullable(),
  PRO_OBS: z.string().optional().nullable(),
  PRO_QUANT: z.number().min(0).optional().nullable(),
  PRO_CONDICAOPAG: z.string().max(40).optional().nullable(),
  PRO_FANTCLI: z.string().max(40).optional().nullable(),
  PRE_CODIGO: z.number().int().optional().nullable(),
  PRO_PRECO: priceTableSchema.optional().nullable(),
  PRO_PEDCLIENTE: z.number().int().optional().nullable(),
  TRA_CODIGO: z.number().int().optional().nullable(),
  PRO_MOTIVO: z.string().max(100).optional().nullable(),
  PRO_STATUS: proStatusSchema.optional().nullable(),
  PRO_TOTALPP1: z.number().min(0).optional().nullable(),
  PRO_TOTALPP2: z.number().min(0).optional().nullable(),
  PRO_TOTALPP3: z.number().min(0).optional().nullable(),
  PP1_CODIGO: z.number().int().optional().nullable(),
  PP2_CODIGO: z.number().int().optional().nullable(),
  PP3_CODIGO: z.number().int().optional().nullable(),
  FP1_CODIGO: z.number().int().optional().nullable(),
  FP2_CODIGO: z.number().int().optional().nullable(),
  FP3_CODIGO: z.number().int().optional().nullable(),
  PRO_NUMORG: z.number().int().optional().nullable(),
  PRO_DATABASE1: dateStrSchema.optional().nullable(),
  PRO_DATABASE2: dateStrSchema.optional().nullable(),
  PRO_DATABASE3: dateStrSchema.optional().nullable(),
  PRO_HORABAIXA: timeStrSchema.optional().nullable(),
  PRO_PERCDESC1: z.number().min(0).optional().nullable(),
  PRO_PERCDESC2: z.number().min(0).optional().nullable(),
  PRO_PERCDESC3: z.number().min(0).optional().nullable(),
  PRO_TOTALDESC1: z.number().min(0).optional().nullable(),
  PRO_TOTALDESC2: z.number().min(0).optional().nullable(),
  PRO_TOTALDESC3: z.number().min(0).optional().nullable(),
  PRO_TOTALPPA1: z.number().min(0).optional().nullable(),
  PRO_TOTALPPA2: z.number().min(0).optional().nullable(),
  PRO_TOTALPPA3: z.number().min(0).optional().nullable(),
  PRO_INFADICIONAIS: z.string().optional().nullable(),
  PRO_PERCACRESC: z.number().min(0).optional().nullable(),
  PRO_TOTALACRESC: z.number().min(0).optional().nullable(),
  TCN_CODIGO: z.number().int().optional().nullable(),
  ITENS: z
    .array(CreateProposalItemSchema)
    .min(1, 'A proposta deve conter pelo menos 1 item em ITENS'),
});

export class CreateProposalDto extends ZodDto(CreateProposalSchema) {
  @ApiProperty({ example: 2, description: 'Código do funcionário/vendedor (FUN_CODIGO)' })
  FUN_CODIGO: number;

  @ApiProperty({ example: 1, description: 'Código da situação (SIT_CODIGO)' })
  SIT_CODIGO: number;

  @ApiPropertyOptional({ example: 1, description: 'Código da loja (LOJ_CODIGO). Para H2M é forçado pelo token.' })
  LOJ_CODIGO?: number;

  @ApiProperty({ example: 10, description: 'Código do cliente (CLI_CODIGO)' })
  CLI_CODIGO: number;

  @ApiPropertyOptional({ example: 1, description: 'Código do usuário operador (USU_CODIGO)' })
  USU_CODIGO?: number | null;

  @ApiPropertyOptional({ example: 1, description: 'Código da forma de pagamento (FPG_CODIGO)' })
  FPG_CODIGO?: number | null;

  @ApiPropertyOptional({ example: 'Sr. João', description: 'PRO_ATENCIOSAMENTE' })
  PRO_ATENCIOSAMENTE?: string | null;

  @ApiPropertyOptional({ example: '10 DIAS', description: 'PRO_PRAZO' })
  PRO_PRAZO?: string | null;

  @ApiPropertyOptional({ example: '15 DIAS', description: 'PRO_VALIDADE' })
  PRO_VALIDADE?: string | null;

  @ApiPropertyOptional({ example: '2026-11-25', description: 'Data da proposta (PRO_DATA, padrão hoje)' })
  PRO_DATA?: string;

  @ApiPropertyOptional({ example: '14:30:00', description: 'Hora da proposta (PRO_HORA, padrão agora)' })
  PRO_HORA?: string | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_DATABAIXA' })
  PRO_DATABAIXA?: string | null;

  @ApiPropertyOptional({ example: 100, description: 'PRO_TOTALBRUTO (calculado se omitido)' })
  PRO_TOTALBRUTO?: number | null;

  @ApiPropertyOptional({ example: 0, description: 'PRO_TOTALDESC (calculado se omitido)' })
  PRO_TOTALDESC?: number | null;

  @ApiPropertyOptional({ example: 0, description: 'PRO_PERCDESC' })
  PRO_PERCDESC?: number | null;

  @ApiPropertyOptional({ example: 100, description: 'PRO_TOTALLIQUIDO (calculado se omitido)' })
  PRO_TOTALLIQUIDO?: number | null;

  @ApiPropertyOptional({ example: 'Observação comercial', description: 'PRO_OBS' })
  PRO_OBS?: string | null;

  @ApiPropertyOptional({ example: 2, description: 'PRO_QUANT (calculado se omitido)' })
  PRO_QUANT?: number | null;

  @ApiPropertyOptional({ example: '30/60 DIAS', description: 'PRO_CONDICAOPAG' })
  PRO_CONDICAOPAG?: string | null;

  @ApiPropertyOptional({ example: 'CLIENTE FANTASIA', description: 'PRO_FANTCLI' })
  PRO_FANTCLI?: string | null;

  @ApiPropertyOptional({ example: null, description: 'PRE_CODIGO' })
  PRE_CODIGO?: number | null;

  @ApiPropertyOptional({
    example: 1,
    description: 'Tabela de preço padrão da proposta (1 a 12, padrão 1)',
    oneOf: [
      { type: 'integer', minimum: 1, maximum: 12 },
      { type: 'string', example: '1' },
    ],
  })
  PRO_PRECO?: string | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_PEDCLIENTE' })
  PRO_PEDCLIENTE?: number | null;

  @ApiPropertyOptional({ example: null, description: 'TRA_CODIGO' })
  TRA_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_MOTIVO' })
  PRO_MOTIVO?: string | null;

  @ApiPropertyOptional({
    example: 2,
    description: 'Status da proposta (PRO_STATUS, padrão 2)',
    oneOf: [
      { type: 'integer', minimum: 0, maximum: 9 },
      { type: 'string', example: '2' },
    ],
  })
  PRO_STATUS?: string | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALPP1' })
  PRO_TOTALPP1?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALPP2' })
  PRO_TOTALPP2?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALPP3' })
  PRO_TOTALPP3?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PP1_CODIGO' })
  PP1_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PP2_CODIGO' })
  PP2_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PP3_CODIGO' })
  PP3_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'FP1_CODIGO' })
  FP1_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'FP2_CODIGO' })
  FP2_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'FP3_CODIGO' })
  FP3_CODIGO?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_NUMORG' })
  PRO_NUMORG?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_DATABASE1' })
  PRO_DATABASE1?: string | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_DATABASE2' })
  PRO_DATABASE2?: string | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_DATABASE3' })
  PRO_DATABASE3?: string | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_HORABAIXA' })
  PRO_HORABAIXA?: string | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_PERCDESC1' })
  PRO_PERCDESC1?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_PERCDESC2' })
  PRO_PERCDESC2?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_PERCDESC3' })
  PRO_PERCDESC3?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALDESC1' })
  PRO_TOTALDESC1?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALDESC2' })
  PRO_TOTALDESC2?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALDESC3' })
  PRO_TOTALDESC3?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALPPA1' })
  PRO_TOTALPPA1?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALPPA2' })
  PRO_TOTALPPA2?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_TOTALPPA3' })
  PRO_TOTALPPA3?: number | null;

  @ApiPropertyOptional({ example: null, description: 'PRO_INFADICIONAIS' })
  PRO_INFADICIONAIS?: string | null;

  @ApiPropertyOptional({ example: 0, description: 'PRO_PERCACRESC' })
  PRO_PERCACRESC?: number | null;

  @ApiPropertyOptional({ example: 0, description: 'PRO_TOTALACRESC' })
  PRO_TOTALACRESC?: number | null;

  @ApiPropertyOptional({ example: null, description: 'TCN_CODIGO' })
  TCN_CODIGO?: number | null;

  @ApiProperty({
    type: [CreateProposalItemDto],
    description: 'Lista de itens da proposta (ITENSPRO)',
  })
  ITENS: CreateProposalItemDto[];
}
