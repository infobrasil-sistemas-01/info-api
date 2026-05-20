import { ApiProperty } from '@nestjs/swagger';

export class PaymentMethodResponseDto {
  @ApiProperty({ example: 1, description: 'Código da forma de pagamento' })
  FPG_CODIGO: number;

  @ApiProperty({
    example: 'Dinheiro',
    description: 'Descrição da forma de pagamento',
  })
  FPG_DESCRICAO: string;
}
