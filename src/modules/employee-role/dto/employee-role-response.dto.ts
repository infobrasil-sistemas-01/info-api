import { ApiProperty } from '@nestjs/swagger';

export class EmployeeRoleResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Código da função/cargo (FCA_CODIGO)',
  })
  FCA_CODIGO: number;

  @ApiProperty({
    example: 'Vendedor',
    description: 'Nome da função/cargo (FCA_NOME)',
  })
  FCA_NOME: string;
}
