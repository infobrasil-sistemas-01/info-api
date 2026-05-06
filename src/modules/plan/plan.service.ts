import { Injectable } from '@nestjs/common';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';

export interface PlanLimits {
  reqMin: number;
  reqMonth: number;
  maxPageSize: number;
  maxDateRangeDays: number;
}

@Injectable()
export class PlanService {
  // Limites padrão do plano Free (conforme imagem)
  private readonly DEFAULT_FREE_LIMITS: PlanLimits = {
    reqMin: 30,
    reqMonth: 10000,
    maxPageSize: 100,
    maxDateRangeDays: 7,
  };

  constructor(private readonly prisma: RegistryPrismaService) {}

  async getUserLimits(userId: string): Promise<PlanLimits> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { plan: true },
    });

    if (!user || !user.plan) {
      return this.DEFAULT_FREE_LIMITS;
    }

    return {
      reqMin: user.plan.reqMin,
      reqMonth: user.plan.reqMonth,
      maxPageSize: user.plan.maxPageSize,
      maxDateRangeDays: user.plan.maxDateRangeDays,
    };
  }

  async logRequest(userId: string, method: string, path: string, status: number, ip?: string) {
    await this.prisma.requestLog.create({
      data: {
        userId,
        method,
        path,
        status,
        ip,
      },
    });
  }

  async getRequestCount(userId: string, timeframe: 'minute' | 'month'): Promise<number> {
    const now = new Date();
    let startDate: Date;

    if (timeframe === 'minute') {
      startDate = new Date(now.getTime() - 60 * 1000);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return this.prisma.requestLog.count({
      where: {
        userId,
        createdAt: { gte: startDate },
      },
    });
  }

  async getUserStats(userId: string) {
    const limits = await this.getUserLimits(userId);
    const reqsMinute = await this.getRequestCount(userId, 'minute');
    const reqsMonth = await this.getRequestCount(userId, 'month');

    return {
      limits,
      usage: {
        reqsMinute,
        reqsMonth,
        minutePercentage: Math.min(100, (reqsMinute / limits.reqMin) * 100),
        monthPercentage: Math.min(100, (reqsMonth / limits.reqMonth) * 100),
      },
    };
  }
}
