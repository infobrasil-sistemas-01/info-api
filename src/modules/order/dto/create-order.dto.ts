import { ZodDto } from 'src/common/validation/zod-dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import z from 'zod';
import { SoldProductDto, SoldProductSchema } from './sold-product.dto';

export const PostOrderSchema = z.object({
  id: z.number(),
  date: z.string(),
  hour: z.string(),
  taxes: z.number().optional(), // Valor de acréscimo/taxa
  discount: z.number().optional(), // Valor de desconto
  store_note: z.string().optional(), // Informações adicionais da loja
  payment_method_rate: z.number().optional(), // Taxa do meio de pagamento
  installment: z.number().optional(), // Quantidade de parcelas
  payment_method: z.string(), // Meio de pagamento
  payment_date: z.string(), // Data de pagamento
  interest: z.number().optional(), // Juros do pedido
  has_payment: z.boolean(), // Indica se existe pagamento confirmado
  has_invoice: z.boolean(), // Indica se existe nota fiscal
  products_sold: z.array(SoldProductSchema).optional(), // Lista de produtos vendidos
});

export class PostOrderDto extends ZodDto(PostOrderSchema) {
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
  payment_method: string;

  @ApiProperty({ description: 'Data de pagamento' })
  payment_date: string;

  @ApiPropertyOptional({ description: 'Juros do pedido' })
  interest?: number;

  @ApiProperty({ description: 'Indica se existe pagamento confirmado' })
  has_payment: boolean;

  @ApiProperty({ description: 'Indica se existe nota fiscal' })
  has_invoice: boolean;

  @ApiPropertyOptional({
    description: 'Lista de produtos vendidos',
    type: [SoldProductDto],
  })
  products_sold?: SoldProductDto[];
}
