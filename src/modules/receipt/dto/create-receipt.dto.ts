import { ApiProperty } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import z from 'zod';

export const PostReceiptSchema = z.object({
  orderId: z.number(),
});

export class PostReceiptDto extends ZodDto(PostReceiptSchema) {
  @ApiProperty({
    description: 'ID do pedido para o qual o cupom fiscal será gerado',
  })
  orderId: number;
}
