import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { HealthService } from '../health/health.service';

@Injectable()
export class StatusService {
  private readonly logger = new Logger(StatusService.name);

  constructor(
    private readonly prisma: RegistryPrismaService,
    private readonly healthService: HealthService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async monitor() {
    let apiStatus = 'DOWN';
    let apiLatency = 0;
    let dbStatus = 'DOWN';
    let dbLatency = 0;

    const startTime = performance.now();
    let dbTime = 0;

    try {
      // Consome o Health Check oficial da API (Bypassing cache para medição real)
      const health = await this.healthService.check(true);
      
      // DB Status: Especificamente o status do Postgres retornado pelo health check
      dbStatus = health.databases.postgres.status === 'up' ? 'UP' : 'DOWN';
      dbTime = health.databases.postgres.responseTimeMs || 0;
      
      // API Status: Se o processo está rodando e o health check respondeu
      apiStatus = 'UP';
      
      // Calcula a latência da API como o "overhead" de processamento (Total - DB)
      const totalTime = performance.now() - startTime;
      apiLatency = Math.max(1, Math.round(totalTime - dbTime));
      dbLatency = dbTime;
      
    } catch (error) {
      this.logger.error(`Status check failed: ${error.message}`);
      apiStatus = 'DOWN';
      dbStatus = 'DOWN';
    }

    try {
      await this.prisma.statusLog.create({
        data: {
          apiStatus,
          apiLatency,
          dbStatus,
          dbLatency,
        },
      });
    } catch (e) {
      this.logger.error(`Failed to save status log: ${e.message}`);
    }

    this.logger.log(`Monitor check - API: ${apiStatus} (${apiLatency}ms) | DB: ${dbStatus} (${dbLatency}ms)`);
  }

  /**
   * Limpa logs mais antigos que 7 dias para evitar inchaço do banco de dados.
   * Roda todos os dias às 03:00 AM.
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanup() {
    this.logger.log('Starting status logs cleanup...');
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    try {
      const { count } = await this.prisma.statusLog.deleteMany({
        where: {
          timestamp: { lt: sevenDaysAgo },
        },
      });
      this.logger.log(`Cleanup finished. Removed ${count} old status logs.`);
    } catch (e) {
      this.logger.error(`Failed to cleanup status logs: ${e.message}`);
    }
  }

  async getLatestStatus() {
    try {
      return await this.prisma.statusLog.findFirst({
        orderBy: { timestamp: 'desc' },
      });
    } catch (e) {
      this.logger.error(`Error fetching latest status: ${e.message}`);
      return null;
    }
  }

  async getHistory(limit = 90) {
    try {
      const logs = await this.prisma.statusLog.findMany({
        take: limit,
        orderBy: { timestamp: 'desc' },
      });
      return logs.reverse();
    } catch (e) {
      this.logger.error(`Error fetching status history: ${e.message}`);
      return [];
    }
  }
}
