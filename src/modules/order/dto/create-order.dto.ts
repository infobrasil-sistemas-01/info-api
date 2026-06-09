import { ZodDto } from 'src/common/validation/zod-dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import z from 'zod';
import { SoldProductDto, SoldProductSchema } from './sold-product.dto';

export const PostOrderSchema = z.object({
  id: z.number(),
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
  has_payment: z.boolean(), // Indica se existe pagamento confirmado
  has_invoice: z.boolean(), // Indica se existe nota fiscal
  products_sold: z.array(SoldProductSchema).optional(), // Lista de produtos vendidos
});

export class PostOrderDto extends ZodDto(PostOrderSchema) {
  @ApiProperty({ description: 'ID do pedido' })
  id!: number;

  @ApiPropertyOptional({ description: 'ID do cliente (opcional)' })
  client_id?: number;

  @ApiPropertyOptional({ description: 'ID do prestador de serviços (opcional)' })
  provider_id?: number;

  @ApiPropertyOptional({ description: 'ID do funcionário (opcional)' })
  employee_id?: number;

  @ApiPropertyOptional({ description: 'ID do usuário (opcional)' })
  user_id?: number;

  @ApiPropertyOptional({ description: 'ID da loja (opcional)' })
  store_id?: number;

  @ApiPropertyOptional({ description: 'ID da tabela de preços (opcional)' })
  price_table_id?: number;

  @ApiProperty({ description: 'Data do pedido' })
  date!: string;

  @ApiProperty({ description: 'Hora do pedido' })
  hour!: string;

  @ApiPropertyOptional({ description: 'Valor de acréscimo/taxa' })
  taxes?: number;

  @ApiPropertyOptional({ description: 'Valor de desconto' })
  discount?: number;

  @ApiPropertyOptional({ description: 'Informações adicionais da loja' })
  store_note?: string;

  @ApiPropertyOptional({ description: 'Taxa do meio de pagamento' })
  payment_method_rate?: number;

  @ApiPropertyOptional({
    description:
      'Quantidade de parcelas (apenas para meios de pagamento com parcelamento)',
  })
  installment?: number;

  @ApiProperty({ description: 'Meio de pagamento' })
  payment_method!: string;

  @ApiPropertyOptional({ description: 'Código do plano de pagamento' })
  payment_plan_code?: number;

  @ApiProperty({ description: 'Data de pagamento' })
  payment_date!: string;

  @ApiPropertyOptional({ description: 'Juros do pedido' })
  interest?: number;

  @ApiProperty({ description: 'Indica se existe pagamento confirmado' })
  has_payment!: boolean;

  @ApiProperty({ description: 'Indica se existe nota fiscal' })
  has_invoice!: boolean;

  @ApiPropertyOptional({
    description: 'Lista de produtos vendidos',
    type: [SoldProductDto],
  })
  products_sold?: SoldProductDto[];
}
