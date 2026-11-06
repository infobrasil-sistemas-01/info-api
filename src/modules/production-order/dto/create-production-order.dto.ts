import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const CreateProductionOrderItemSchema = z.object({
  productCode: z
    .string()
    .min(1, 'Código do produto/insumo é obrigatório')
    .max(14, 'Código do produto/insumo deve ter no máximo 14 caracteres'),
  quantity: z
    .number()
    .positive('A quantidade do insumo deve ser maior que zero'),
});

export class CreateProductionOrderItemDto extends ZodDto(
  CreateProductionOrderItemSchema,
) {
  @ApiProperty({
    description: 'Código do produto/insumo consumido (PRO_CODIGO)',
    example: '00000000000012',
  })
  productCode: string;

  @ApiProperty({
    description: 'Quantidade consumida do insumo (OPI_QTDE)',
    example: 10.5,
  })
  quantity: number;
}

export const CreateProductionOrderSchema = z.object({
  productCode: z
    .string()
    .min(1, 'Código do produto final produzido é obrigatório')
    .max(
      14,
      'Código do produto final produzido deve ter no máximo 14 caracteres',
    ),
  quantity: z
    .number()
    .positive('A quantidade a produzir deve ser maior que zero'),
  storeId: z.coerce.number().int().positive().optional(),
  userId: z.coerce.number().int().positive().optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido de data. Use YYYY-MM-DD')
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido de data. Use YYYY-MM-DD')
    .optional(),
  obs: z
    .string()
    .max(200, 'Observações devem ter no máximo 200 caracteres')
    .optional(),
  items: z
    .array(CreateProductionOrderItemSchema)
    .min(1, 'A ordem de produção deve conter pelo menos 1 insumo'),
});

export class CreateProductionOrderDto extends ZodDto(
  CreateProductionOrderSchema,
) {
  @ApiProperty({
    description: 'Código do produto final a ser produzido (PRO_CODIGO)',
    example: '00000000000045',
  })
  productCode: string;

  @ApiProperty({
    description: 'Quantidade total a ser produzida (ORP_QUANTIDADE)',
    example: 50.0,
  })
  quantity: number;

  @ApiPropertyOptional({
    description:
      'Código da loja/filial (LOJ_CODIGO). Em autenticação M2M, usa este valor ou herda do token. Em H2M, herda do token.',
    example: 1,
  })
  storeId?: number;

  @ApiPropertyOptional({
    description:
      'Código do usuário operador (USU_CODIGO). Obrigatório/utilizado para M2M.',
    example: 10,
  })
  userId?: number;

  @ApiPropertyOptional({
    description: 'Data de início prevista da produção (YYYY-MM-DD)',
    example: '2026-04-01',
  })
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data de término prevista da produção (YYYY-MM-DD)',
    example: '2026-04-05',
  })
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Observações gerais da ordem de produção (ORP_OBS)',
    example: 'Lote especial de teste',
  })
  obs?: string;

  @ApiProperty({
    description: 'Lista de insumos/componentes consumidos na produção',
    type: [CreateProductionOrderItemDto],
  })
  items: CreateProductionOrderItemDto[];
}

