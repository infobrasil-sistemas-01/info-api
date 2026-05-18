import { ApiProperty } from '@nestjs/swagger';

export class PlanResponseDto {
  @ApiProperty({ description: 'ID do plano', example: 'd3b07384-d113-49c5-a506-6997a9f60bc8' })
  id!: string;

  @ApiProperty({ description: 'Nome do plano', example: 'Bronze' })
  name!: string;

  @ApiProperty({ description: 'Limite de requisições por minuto', example: 100 })
  reqMin!: number;

  @ApiProperty({ description: 'Limite de requisições por mês', example: 15000 })
  reqMonth!: number;

  @ApiProperty({ description: 'Tamanho máximo de página permitido', example: 50 })
  maxPageSize!: number;

  @ApiProperty({ description: 'Intervalo máximo de dias para filtros de data', example: 30 })
  maxDateRangeDays!: number;
}
