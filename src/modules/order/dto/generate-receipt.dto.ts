import { ApiProperty } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import z from 'zod';

export const GenerateReceiptSchema = z.object({
  email: z.email(),
  cpf: z.string().optional(),
});

export class GenerateReceiptDto extends ZodDto(GenerateReceiptSchema) {
  @ApiProperty({
    description: 'Email do cliente para envio do cupom fiscal',
    example: 'cliente@exemplo.com.br',
  })
  email!: string;

  @ApiProperty({
    description: 'CPF do cliente (opcional, para fins fiscais)',
    example: '12345678901',
    required: false,
  })
  cpf?: string;
}
