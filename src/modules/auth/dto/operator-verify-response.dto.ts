import { ApiProperty } from '@nestjs/swagger';

export class OperatorVerifyResponseDto {
  @ApiProperty({ description: 'Indica se as credenciais do operador são válidas', example: true })
  valid!: boolean;

  @ApiProperty({ description: 'Código identificador do usuário no ERP (USU_CODIGO)', example: 10 })
  usuCodigo!: number;

  @ApiProperty({ description: 'Código do funcionário vinculado (FUN_CODIGO)', example: 25, nullable: true })
  funCodigo!: number | null;

  @ApiProperty({ description: 'Código da filial/loja de atuação (LOJ_CODIGO)', example: 1 })
  storeId!: number;
}
