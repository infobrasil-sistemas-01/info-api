import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const ProductionOrderItemSchema = z
  .object({
    product_id: z.union([z.string(), z.number()]).optional(),
    product_code: z.union([z.string(), z.number()]).optional(),
    productCode: z.union([z.string(), z.number()]).optional(),
    quantity: z
      .number()
      .positive('A quantidade do insumo deve ser maior que zero'),
  })
  .refine(
    (data) =>
      data.product_id !== undefined ||
      data.product_code !== undefined ||
      data.productCode !== undefined,
    {
      message: 'O campo product_id (ou product_code) é obrigatório no insumo',
    },
  );

export class ProductionOrderItemDto extends ZodDto(ProductionOrderItemSchema) {
  @ApiProperty({
    description: 'ID ou código do produto/insumo consumido (PRO_CODIGO)',
    example: 101,
  })
  product_id!: string | number;

  @ApiProperty({
    description: 'Quantidade consumida do insumo (OPI_QTDE)',
    example: 10.5,
  })
  quantity!: number;
}

// Aliases para retrocompatibilidade
export const CreateProductionOrderItemSchema = ProductionOrderItemSchema;
export class CreateProductionOrderItemDto extends ProductionOrderItemDto {}

export const PostProductionOrderSchema = z
  .object({
    product_id: z.union([z.string(), z.number()]).optional(),
    product_code: z.union([z.string(), z.number()]).optional(),
    productCode: z.union([z.string(), z.number()]).optional(),
    quantity: z
      .number()
      .positive('A quantidade a produzir deve ser maior que zero'),
    store_id: z.coerce.number().int().positive().optional(),
    storeId: z.coerce.number().int().positive().optional(),
    user_id: z.coerce.number().int().positive().optional(),
    userId: z.coerce.number().int().positive().optional(),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido de data. Use YYYY-MM-DD')
      .optional(),
    start_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido de data. Use YYYY-MM-DD')
      .optional(),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido de data. Use YYYY-MM-DD')
      .optional(),
    end_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido de data. Use YYYY-MM-DD')
      .optional(),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido de data. Use YYYY-MM-DD')
      .optional(),
    store_note: z
      .string()
      .max(200, 'Observações devem ter no máximo 200 caracteres')
      .optional(),
    obs: z
      .string()
      .max(200, 'Observações devem ter no máximo 200 caracteres')
      .optional(),
    items: z
      .array(ProductionOrderItemSchema)
      .min(1, 'A ordem de produção deve conter pelo menos 1 insumo'),
  })
  .refine(
    (data) =>
      data.product_id !== undefined ||
      data.product_code !== undefined ||
      data.productCode !== undefined,
    {
      message: 'O campo product_id (ou product_code) é obrigatório',
    },
  );

export class PostProductionOrderDto extends ZodDto(PostProductionOrderSchema) {
  @ApiProperty({
    description: 'ID ou código do produto final a ser produzido (PRO_CODIGO)',
    example: 45,
  })
  product_id!: string | number;

  @ApiProperty({
    description: 'Quantidade total a ser produzida (ORP_QUANTIDADE)',
    example: 50.0,
  })
  quantity!: number;

  @ApiPropertyOptional({
    description:
      'Código da loja/filial (LOJ_CODIGO). Em autenticação M2M, usa este valor ou herda do token. Em H2M, herda do token.',
    example: 1,
  })
  store_id?: number;

  @ApiPropertyOptional({
    description:
      'Código do usuário operador (USU_CODIGO). Obrigatório/utilizado para M2M.',
    example: 10,
  })
  user_id?: number;

  @ApiPropertyOptional({
    description: 'Data de início prevista da produção (YYYY-MM-DD)',
    example: '2026-04-01',
  })
  start_date?: string;

  @ApiPropertyOptional({
    description: 'Data de término prevista da produção (YYYY-MM-DD)',
    example: '2026-04-05',
  })
  end_date?: string;

  @ApiPropertyOptional({
    description: 'Informações adicionais/observações da ordem',
    example: 'Lote especial de teste',
  })
  store_note?: string;

  @ApiProperty({
    description: 'Lista de insumos/produtos consumidos na produção',
    type: [ProductionOrderItemDto],
    example: [
      {
        product_id: 12,
        quantity: 10.5,
      },
    ],
  })
  items!: ProductionOrderItemDto[];
}

// Aliases para retrocompatibilidade
export const CreateProductionOrderSchema = PostProductionOrderSchema;
export class CreateProductionOrderDto extends PostProductionOrderDto {}
