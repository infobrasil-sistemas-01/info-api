import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CityResponseDto {
  @ApiProperty({
    description: 'Código IBGE do município',
    example: 2304400,
  })
  MUN_CODIGO: number;

  @ApiProperty({
    description: 'Nome do município',
    example: 'FORTALEZA',
  })
  MUN_NOME: string;

  @ApiPropertyOptional({
    description: 'Código do estado (UF)',
    example: 23,
  })
  EST_CODIGO?: number | null;
}
