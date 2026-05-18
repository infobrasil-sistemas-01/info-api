import { ApiProperty } from '@nestjs/swagger';

export class StatusLogDto {
  @ApiProperty({ description: 'ID do log de status', example: 'd3b07384-d113-49c5-a506-6997a9f60bc8' })
  id!: string;

  @ApiProperty({ description: 'Status da API (UP/DOWN)', example: 'UP' })
  apiStatus!: string;

  @ApiProperty({ description: 'Latência da API em milissegundos', example: 12 })
  apiLatency!: number;

  @ApiProperty({ description: 'Status do Banco de Dados (UP/DOWN)', example: 'UP' })
  dbStatus!: string;

  @ApiProperty({ description: 'Latência do Banco de Dados em milissegundos', example: 3 })
  dbLatency!: number;

  @ApiProperty({ description: 'Data/Hora em que o status foi capturado', example: '2026-05-18T16:20:00.000Z' })
  timestamp!: Date;
}

export class StatusDataResponseDto {
  @ApiProperty({ description: 'Status mais recente capturado', type: StatusLogDto, nullable: true })
  current!: StatusLogDto | null;

  @ApiProperty({ description: 'Histórico de status capturados', type: [StatusLogDto] })
  history!: StatusLogDto[];
}

export class MyConnectionStatusResponseDto {
  @ApiProperty({ description: 'Status da API (UP/DOWN)', example: 'UP' })
  api!: string;

  @ApiProperty({ description: 'Latência da API em milissegundos', example: 5 })
  apiLatency!: number;

  @ApiProperty({ description: 'Status do Banco de Dados Postgres (UP/DOWN)', example: 'UP' })
  postgres!: string;

  @ApiProperty({ description: 'Latência do Banco de Dados Postgres em milissegundos', example: 2 })
  postgresLatency!: number;

  @ApiProperty({ description: 'Status do Banco de Dados Firebird (Tenant) (UP/DOWN)', example: 'UP' })
  tenant!: string;

  @ApiProperty({ description: 'Latência do Banco de Dados Firebird (Tenant) em milissegundos', example: 45 })
  tenantLatency!: number;
}
