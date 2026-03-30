import { ZodDto } from 'src/common/validation/zod-dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import z from 'zod';
import { SoldProductSchema } from './sold-product.dto';

export const PostOrderSchema = z.object({
  status: z.string(),
  id: z.number(),
  date: z.string(),
  hour: z.string(),
  taxes: z.number().optional(), // Valor de acréscimo/taxa
  discount: z.number().optional(), // Valor de desconto
  shipment: z.string().optional(), // Tipo de frete
  shipment_value: z.number().optional(), // Valor do frete
  store_note: z.string().optional(), // Informações adicionais da loja
  customer_note: z.string().optional(), // Informações adicionais do cliente
  payment_method_rate: z.number().optional(), // Taxa do meio de pagamento
  installment: z.number().optional(), // Quantidade de parcelas
  delivery_time: z.string().optional(), // Tempo de entrega
  payment_method: z.string().nullable(), // Meio de pagamento
  total: z.number(), // Valor total do pedido
  payment_date: z.string(), // Data de pagamento
  interest: z.number().optional(), // Juros do pedido
  estimated_delivery_date: z.string().optional(), // Data estimada de entrega
  has_payment: z.boolean(), // Indica se existe pagamento confirmado
  has_invoice: z.boolean(), // Indica se existe nota fiscal
  products_sold: z.array(SoldProductSchema).optional(), // Lista de produtos vendidos
});

export class PostOrderDto extends ZodDto(PostOrderSchema) {
  @ApiProperty({ description: 'Status do pedido' })
  status: string;

  @ApiProperty({ description: 'ID do pedido' })
  id: number;

  @ApiProperty({ description: 'Data do pedido' })
  date: string;

  @ApiProperty({ description: 'Hora do pedido' })
  hour: string;

  @ApiPropertyOptional({ description: 'Valor de acréscimo/taxa' })
  taxes?: number;

  @ApiPropertyOptional({ description: 'Valor de desconto' })
  discount?: number;

  @ApiPropertyOptional({ description: 'Tipo de frete' })
  shipment?: string;

  @ApiPropertyOptional({ description: 'Valor do frete' })
  shipment_value?: number;

  @ApiPropertyOptional({ description: 'Informações adicionais da loja' })
  store_note?: string;

  @ApiPropertyOptional({ description: 'Informações adicionais do cliente' })
  customer_note?: string;

  @ApiPropertyOptional({ description: 'Taxa do meio de pagamento' })
  payment_method_rate?: number;

  @ApiPropertyOptional({ description: 'Quantidade de parcelas' })
  installment?: number;

  @ApiPropertyOptional({ description: 'Tempo de entrega' })
  delivery_time?: string;

  @ApiProperty({ description: 'Meio de pagamento', nullable: true })
  payment_method: string | null;

  @ApiProperty({ description: 'Valor total do pedido' })
  total: number;

  @ApiProperty({ description: 'Data de pagamento' })
  payment_date: string;

  @ApiPropertyOptional({ description: 'Juros do pedido' })
  interest?: number;

  @ApiPropertyOptional({ description: 'Data estimada de entrega' })
  estimated_delivery_date?: string;

  @ApiProperty({ description: 'Indica se existe pagamento confirmado' })
  has_payment: boolean;

  @ApiProperty({ description: 'Indica se existe nota fiscal' })
  has_invoice: boolean;

  @ApiPropertyOptional({
    description: 'Lista de produtos vendidos',
    type: [Object],
  })
  products_sold?: any[];
}
