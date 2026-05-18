import { ApiProperty } from '@nestjs/swagger';

export class PlanLimitsDto {
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

export class PlanUsageDto {
  @ApiProperty({ description: 'Requisições feitas no último minuto', example: 5 })
  reqsMinute!: number;

  @ApiProperty({ description: 'Requisições feitas no mês corrente', example: 1200 })
  reqsMonth!: number;

  @ApiProperty({ description: 'Porcentagem de uso do limite por minuto', example: 5.0 })
  minutePercentage!: number;

  @ApiProperty({ description: 'Porcentagem de uso do limite mensal', example: 8.0 })
  monthPercentage!: number;
}

export class UserStatsResponseDto {
  @ApiProperty({ description: 'Limites permitidos no plano do usuário', type: PlanLimitsDto })
  limits!: PlanLimitsDto;

  @ApiProperty({ description: 'Métricas de consumo e utilização', type: PlanUsageDto })
  usage!: PlanUsageDto;
}
