import { ZodDto } from 'src/common/validation/zod-dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import z from 'zod';
import { SoldProductDto, SoldProductSchema } from './sold-product.dto';

export const PostOrderSchema = z.object({
  store_id: z.number().optional(),
  client_id: z.number().optional(),
  provider_id: z.number().optional(),
  employee_id: z.number().optional(),
  user_id: z.number().optional(),
  price_table_id: z
    .number()
    .min(1, { message: 'A tabela de preços deve ser entre 1 e 12.' })
    .max(12, { message: 'A tabela de preços deve ser entre 1 e 12.' })
    .optional(),
  date: z.string(),
  hour: z.string(),
  taxes: z.number().optional(), // Valor de acréscimo/taxa
  discount: z.number().optional(), // Valor de desconto
  store_note: z.string().optional(), // Informações adicionais da loja
  payment_method_rate: z.number().optional(), // Taxa do meio de pagamento
  installment: z.number().optional(), // Quantidade de parcelas
  payment_method: z.string(), // Meio de pagamento
  payment_plan_code: z.number().optional(), // Código do plano de pagamento
  payment_date: z.string(), // Data de pagamento
  interest: z.number().optional(), // Juros do pedido
  products_sold: z.array(SoldProductSchema).optional(), // Lista de produtos vendidos
});

export class PostOrderDto extends ZodDto(PostOrderSchema) {
  @ApiPropertyOptional({ description: 'ID do cliente (opcional)', example: 1001 })
  client_id?: number;

  @ApiPropertyOptional({
    description: 'ID do prestador de serviços (opcional)',
    example: 1,
  })
  provider_id?: number;

  @ApiPropertyOptional({
    description:
      'Código do funcionário/vendedor (FUN_CODIGO). Obrigatório para integrações M2M/parceiros e deve corresponder ao funcionário vinculado ao operador (user_id). Em autenticação de operador (H2M), assume automaticamente o funcionário autenticado.',
    example: 10,
  })
  employee_id?: number;

  @ApiPropertyOptional({
    description:
      'Código do usuário/operador (USU_CODIGO). Obrigatório para integrações M2M/parceiros. Em autenticação de operador (H2M), assume automaticamente o usuário autenticado ou deve ser idêntico ao mesmo.',
    example: 9999,
  })
  user_id?: number;

  @ApiPropertyOptional({ description: 'ID da loja (opcional)', example: 1 })
  store_id?: number;

  @ApiPropertyOptional({ description: 'ID da tabela de preços (opcional)', example: 1 })
  price_table_id?: number;

  @ApiProperty({ description: 'Data do pedido (YYYY-MM-DD)', example: '2026-10-27' })
  date!: string;

  @ApiProperty({ description: 'Hora do pedido (HH:MM:SS)', example: '14:30:00' })
  hour!: string;

  @ApiPropertyOptional({ description: 'Valor de acréscimo/taxa', example: 5.5 })
  taxes?: number;

  @ApiPropertyOptional({ description: 'Valor de desconto', example: 10.0 })
  discount?: number;

  @ApiPropertyOptional({ description: 'Informações adicionais da loja', example: 'Entregar no período da tarde' })
  store_note?: string;

  @ApiPropertyOptional({ description: 'Taxa do meio de pagamento', example: 1.99 })
  payment_method_rate?: number;

  @ApiPropertyOptional({
    description:
      'Quantidade de parcelas (apenas para meios de pagamento com parcelamento)',
    example: 1,
  })
  installment?: number;

  @ApiProperty({ description: 'Meio de pagamento', example: 'PIX' })
  payment_method!: string;

  @ApiPropertyOptional({ description: 'Código do plano de pagamento', example: 1 })
  payment_plan_code?: number;

  @ApiProperty({ description: 'Data de pagamento (YYYY-MM-DD)', example: '2026-10-27' })
  payment_date!: string;

  @ApiPropertyOptional({ description: 'Juros do pedido', example: 0 })
  interest?: number;

  @ApiPropertyOptional({
    description: 'Lista de produtos vendidos',
    type: [SoldProductDto],
    example: [
      {
        product_id: 101,
        quantity: 2,
        variant_id: 1,
      },
    ],
  })
  products_sold?: SoldProductDto[];
}
