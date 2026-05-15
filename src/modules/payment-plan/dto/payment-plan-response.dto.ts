import { ApiProperty } from '@nestjs/swagger';

export class PaymentPlanResponseDto {
  @ApiProperty({ example: 1, description: 'Código do plano de pagamento' })
  PLP_CODIGO: number;

  @ApiProperty({ example: '30 DIAS', description: 'Descrição do plano de pagamento' })
  PLP_DESCRICAO: string;
}
