import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService, HealthStatus } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * GET /api/v1/health
   *
   * Retorna o status geral da API e de suas dependências.
   * - status "ok"       → tudo operacional
   * - status "degraded" → API respondendo, mas alguma dependência está down
   * - status "error"    → falha crítica inesperada
   *
   * Responde 200 mesmo quando degradado para que load balancers não removam
   * a instância prematuramente. Monitore o campo `status` no body.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Health check da API',
    description:
      'Verifica o status da API e das dependências (PostgreSQL). ' +
      'Retorna 200 com `status: "ok"` quando tudo está operacional, ' +
      'ou `status: "degraded"` quando alguma dependência está indisponível.',
  })
  @ApiResponse({
    status: 200,
    description: 'Status da API',
    schema: {
      example: {
        status: 'ok',
        version: '1.1.2',
        uptime: 3600,
        timestamp: '2026-04-23T13:00:00.000Z',
        databases: {
          postgres: {
            status: 'up',
            responseTimeMs: 4,
          },
          firebird: {
            activePools: 2,
            cachedCredentials: 2,
            tenants: [
              { credentialsId: 'cred-abc', status: 'up', responseTimeMs: 12 },
              { credentialsId: 'cred-xyz', status: 'up', responseTimeMs: 9 },
            ],
          },
        },
      },
    },
  })
  async check(): Promise<HealthStatus> {
    return this.healthService.check();
  }
}
