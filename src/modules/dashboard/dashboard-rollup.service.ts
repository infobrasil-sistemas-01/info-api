import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';

@Injectable()
export class DashboardRollupService implements OnModuleInit {
  private readonly logger = new Logger(DashboardRollupService.name);

  constructor(private readonly prisma: RegistryPrismaService) {}

  async onModuleInit() {
    // Executa uma sincronização inicial de rollups no startup sem bloquear o Nest
    setTimeout(() => {
      this.syncHistoricalRollups().catch((err) => {
        this.logger.error(`Failed initial historical rollups sync: ${err.message}`);
      });
    }, 5000);
  }

  /**
   * Cron a cada 5 minutos para atualizar os buckets da última janela de 48 horas.
   * Graças aos índices em created_at, a query executa em < 15ms.
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async updateRecentRollups() {
    try {
      await this.refreshRollupsWindow(48);
    } catch (error) {
      this.logger.error(`Error updating recent rollups: ${error.message}`);
    }
  }

  /**
   * Atualiza ou insere agregações horárias consolidadas.
   * @param hoursBack Janela em horas para consolidar (ex: 48h ou 720h)
   */
  async refreshRollupsWindow(hoursBack: number) {
    const query = `
      INSERT INTO dashboard_hourly_rollups (
        id,
        bucket,
        total_requests,
        success_count,
        client_error_count,
        server_error_count,
        rate_limit_count,
        avg_duration_ms,
        p95_duration_ms,
        created_at,
        updated_at
      )
      SELECT
        gen_random_uuid()::text as id,
        DATE_TRUNC('hour', created_at) as bucket,
        COUNT(id)::int as total_requests,
        COUNT(id) FILTER (WHERE status >= 200 AND status < 300)::int as success_count,
        COUNT(id) FILTER (WHERE status >= 400 AND status < 500 AND status <> 429)::int as client_error_count,
        COUNT(id) FILTER (WHERE status >= 500)::int as server_error_count,
        COUNT(id) FILTER (WHERE status = 429)::int as rate_limit_count,
        ROUND(COALESCE(AVG(duration_ms), 0)::numeric, 2)::float as avg_duration_ms,
        ROUND(COALESCE(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration_ms), 0)::numeric, 2)::float as p95_duration_ms,
        NOW() as created_at,
        NOW() as updated_at
      FROM request_logs
      WHERE created_at >= NOW() - INTERVAL '${Math.max(1, hoursBack)} hours'
        AND path NOT LIKE '/api/v1/dashboard%'
        AND path NOT LIKE '/api/v1/newsletter%'
      GROUP BY DATE_TRUNC('hour', created_at)
      ON CONFLICT (bucket) DO UPDATE SET
        total_requests = EXCLUDED.total_requests,
        success_count = EXCLUDED.success_count,
        client_error_count = EXCLUDED.client_error_count,
        server_error_count = EXCLUDED.server_error_count,
        rate_limit_count = EXCLUDED.rate_limit_count,
        avg_duration_ms = EXCLUDED.avg_duration_ms,
        p95_duration_ms = EXCLUDED.p95_duration_ms,
        updated_at = NOW();
    `;

    await this.prisma.$executeRawUnsafe(query);
  }

  /**
   * Sincroniza os últimos 30 dias (720 horas) na inicialização
   */
  async syncHistoricalRollups() {
    this.logger.log('Starting historical dashboard rollups sync (last 30 days)...');
    const startTime = Date.now();
    await this.refreshRollupsWindow(720);
    this.logger.log(`Historical rollups sync completed in ${Date.now() - startTime}ms.`);
  }
}
