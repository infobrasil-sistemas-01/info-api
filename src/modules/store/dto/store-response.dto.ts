import { ApiProperty } from '@nestjs/swagger';

export class StoreResponseDto {
  @ApiProperty({ example: 1, description: 'Código da loja (LOJ_CODIGO)' })
  LOJ_CODIGO: number;

  @ApiProperty({ example: 'LOJA MATRIZ', description: 'Razão social da loja' })
  LOJ_NOME: string;

  @ApiProperty({
    example: 'INFO BRASIL - FILIAL 1',
    description: 'Nome fantasia da loja',
  })
  LOJ_FANTASIA: string;

  @ApiProperty({
    example: '12345678000199',
    description: 'CNPJ da loja (somente números)',
  })
  LOJ_CNPJ: string;
}
