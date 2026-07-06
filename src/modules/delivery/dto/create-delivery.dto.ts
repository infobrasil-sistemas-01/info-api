import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const CreateDeliveryItemSchema = z.object({
  IVD_NUMERO: z.number().int().min(1, 'Número do item de venda é obrigatório.'),
  PRO_CODIGO: z.string().min(1, 'Código do produto é obrigatório.').max(15),
  ETI_QTDE: z.number().min(0.001, 'Quantidade deve deve ser maior que 0.'),
  ETI_QTDECLIENTE: z.number().min(0).optional(),
  ETI_IMPRIMIR: z.enum(['S', 'N']).default('S'),
  USU_CODIGO: z.number().int().default(9999),
});

export class CreateDeliveryItemDto extends ZodDto(CreateDeliveryItemSchema) {
  @ApiProperty({
    description: 'Número do item de venda (IVD_NUMERO)',
    example: 50,
  })
  IVD_NUMERO: number;

  @ApiProperty({
    description: 'Código do produto (PRO_CODIGO)',
    example: 'PROD-123',
  })
  PRO_CODIGO: string;

  @ApiProperty({ description: 'Quantidade a entregar (ETI_QTDE)', example: 2 })
  ETI_QTDE: number;

  @ApiPropertyOptional({
    description: 'Quantidade do cliente (ETI_QTDECLIENTE)',
    example: 2,
  })
  ETI_QTDECLIENTE?: number;

  @ApiPropertyOptional({
    description: 'Imprimir item',
    example: 'S',
    enum: ['S', 'N'],
    default: 'S',
  })
  ETI_IMPRIMIR: 'S' | 'N';

  @ApiPropertyOptional({
    description: 'Código do usuário',
    example: 9999,
    default: 9999,
  })
  USU_CODIGO: number;
}

export const CreateDeliverySchema = z.object({
  VEN_NUMERO: z.number().int().min(1, 'Número da venda é obrigatório.'),
  PRE_CODIGO: z.number().int().optional(),
  SIT_CODIGO: z.number().int().default(1),
  USU_CODIGO: z.number().int().default(9999),
  ENT_DATA: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data deve ser YYYY-MM-DD')
    .optional(),
  ENT_HORA: z
    .string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, 'Formato de hora deve ser HH:MM:SS')
    .optional(),
  ENT_KILOMETRAGEM: z.number().min(0).optional(),
  VEI_PLACA: z.string().max(8).optional(),
  ENT_OBS: z.string().max(255).optional(),
  ENT_IMPRIMIR: z.enum(['S', 'N']).default('S'),
  AJU_CODIGO: z.number().int().optional(),
  TBS_CODIGO: z.number().int().optional(),
  AJA_CODIGO: z.number().int().optional(),
  ENT_LOTEENTREGA: z.number().int().optional(),
  SEP_CODIGO: z.number().int().optional(),
  ENT_LOTEPRODUTO: z.string().max(20).optional(),
  ENT_GERARROTAS: z.enum(['S', 'N']).default('N'),
  AJ2_CODIGO: z.number().int().optional(),
  items: z.array(CreateDeliveryItemSchema).optional(),
});

export class CreateDeliveryDto extends ZodDto(CreateDeliverySchema) {
  @ApiProperty({ description: 'Número da venda (VEN_NUMERO)', example: 12345 })
  VEN_NUMERO: number;

  @ApiPropertyOptional({
    description: 'Código do prestador (PRE_CODIGO)',
    example: 1,
  })
  PRE_CODIGO?: number;

  @ApiPropertyOptional({
    description: 'Código da situação (SIT_CODIGO)',
    example: 1,
    default: 1,
  })
  SIT_CODIGO: number;

  @ApiPropertyOptional({
    description: 'Código do usuário (USU_CODIGO)',
    example: 9999,
    default: 9999,
  })
  USU_CODIGO: number;

  @ApiPropertyOptional({
    description: 'Data da entrega (YYYY-MM-DD)',
    example: '2026-05-18',
  })
  ENT_DATA?: string;

  @ApiPropertyOptional({
    description: 'Hora da entrega (HH:MM:SS)',
    example: '14:30:00',
  })
  ENT_HORA?: string;

  @ApiPropertyOptional({
    description: 'Kilometragem da entrega',
    example: 120.5,
  })
  ENT_KILOMETRAGEM?: number;

  @ApiPropertyOptional({
    description: 'Placa do veículo (VEI_PLACA)',
    example: 'ABC-1234',
  })
  VEI_PLACA?: string;

  @ApiPropertyOptional({
    description: 'Observações da entrega',
    example: 'Entregar no período da tarde',
  })
  ENT_OBS?: string;

  @ApiPropertyOptional({
    description: 'Imprimir entrega',
    example: 'S',
    enum: ['S', 'N'],
    default: 'S',
  })
  ENT_IMPRIMIR: 'S' | 'N';

  @ApiPropertyOptional({
    description: 'Código do ajudante (AJU_CODIGO)',
    example: 10,
  })
  AJU_CODIGO?: number;

  @ApiPropertyOptional({
    description: 'Código da tabela (TBS_CODIGO)',
    example: 2,
  })
  TBS_CODIGO?: number;

  @ApiPropertyOptional({
    description: 'Código da agenda (AJA_CODIGO)',
    example: 3,
  })
  AJA_CODIGO?: number;

  @ApiPropertyOptional({
    description: 'Lote da entrega (ENT_LOTEENTREGA)',
    example: 5,
  })
  ENT_LOTEENTREGA?: number;

  @ApiPropertyOptional({
    description: 'Código do separador (SEP_CODIGO)',
    example: 4,
  })
  SEP_CODIGO?: number;

  @ApiPropertyOptional({
    description: 'Lote do produto (ENT_LOTEPRODUTO)',
    example: 'LOTE-99',
  })
  ENT_LOTEPRODUTO?: string;

  @ApiPropertyOptional({
    description: 'Gerar rotas para entrega',
    example: 'N',
    enum: ['S', 'N'],
    default: 'N',
  })
  ENT_GERARROTAS: 'S' | 'N';

  @ApiPropertyOptional({
    description: 'Código do segundo ajudante (AJ2_CODIGO)',
    example: 12,
  })
  AJ2_CODIGO?: number;

  @ApiPropertyOptional({
    type: [CreateDeliveryItemDto],
    description: 'Itens vinculados à entrega',
  })
  items?: CreateDeliveryItemDto[];
}
