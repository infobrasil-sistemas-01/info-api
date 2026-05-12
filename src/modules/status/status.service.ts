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

    const startTime = Date.now();

    try {
      // Consome o Health Check oficial da API
      const health = await this.healthService.check();
      
      // API Status: Se o processo está rodando e o health check respondeu
      apiStatus = 'UP';
      apiLatency = Date.now() - startTime;
      
      // DB Status: Especificamente o status do Postgres retornado pelo health check
      dbStatus = health.databases.postgres.status === 'up' ? 'UP' : 'DOWN';
      dbLatency = health.databases.postgres.responseTimeMs || 0;
      
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
