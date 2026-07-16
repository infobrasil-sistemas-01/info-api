import { Injectable } from '@nestjs/common';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: RegistryPrismaService) {}

  async getSummary(startDate: Date, endDate: Date, userId?: string) {
    const whereClause: any = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      NOT: [
        { path: { startsWith: '/api/v1/dashboard' } },
        { path: { startsWith: '/api/v1/newsletter' } },
      ],
    };
    if (userId) {
      whereClause.userId = userId;
    }

    const totalRequests = await this.prisma.requestLog.count({
      where: whereClause,
    });

    const activeUsersResult = await this.prisma.requestLog.groupBy({
      by: ['userId'],
      where: whereClause,
    });
    const activeUsers = activeUsersResult.length;

    const successRequests = await this.prisma.requestLog.count({
      where: {
        ...whereClause,
        status: {
          gte: 200,
          lt: 300,
        },
      },
    });

    const successRate =
      totalRequests > 0 ? (successRequests / totalRequests) * 100 : 100;

    const rateLimitHits = await this.prisma.requestLog.count({
      where: {
        ...whereClause,
        status: 429,
      },
    });

    const latencyResult = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration_ms)::float as "p95"
       FROM request_logs
       WHERE created_at >= $1 AND created_at <= $2
         ${userId ? 'AND user_id = $3' : ''}
         AND path NOT LIKE '/api/v1/dashboard%'
         AND path NOT LIKE '/api/v1/newsletter%'`,
      ...[startDate, endDate, ...(userId ? [userId] : [])],
    );
    const p95Latency = (latencyResult && latencyResult[0]) ? latencyResult[0].p95 || 0 : 0;

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const currentRpm = await this.prisma.requestLog.count({
      where: {
        createdAt: {
          gte: oneMinuteAgo,
        },
        NOT: [
          { path: { startsWith: '/api/v1/dashboard' } },
          { path: { startsWith: '/api/v1/newsletter' } },
        ],
        ...(userId ? { userId } : {}),
      },
    });

    const diffMinutes = Math.max(1, (endDate.getTime() - startDate.getTime()) / (1000 * 60));
    const averageRpm = Number((totalRequests / diffMinutes).toFixed(2));

    return {
      totalRequests,
      activeUsers,
      successRate,
      rateLimitHits,
      p95Latency: Math.round(p95Latency),
      currentRpm,
      averageRpm,
    };
  }

  async getTopUsers(startDate: Date, endDate: Date, limit = 10) {
    const query = `
      SELECT
        rl.user_id as "userId",
        u.user as "username",
        u.email as "email",
        u.status as "status",
        p.name as "planName",
        COALESCE(p.req_min, 30)::int as "planReqMin",
        COALESCE(p.req_month, 10000)::int as "planReqMonth",
        COUNT(rl.id)::int as "totalRequests",
        ROUND((SUM(CASE WHEN rl.status >= 400 THEN 1 ELSE 0 END)::float / COUNT(rl.id) * 100)::numeric, 2)::float as "errorRate",
        (
          SELECT COUNT(m.id)::int
          FROM request_logs m
          WHERE m.user_id = rl.user_id
            AND m.created_at >= DATE_TRUNC('month', CURRENT_DATE)
            AND m.status <> 429
            AND m.path NOT LIKE '/api/v1/dashboard%'
            AND m.path NOT LIKE '/api/v1/newsletter%'
        ) as "monthlyRequests",
        (
          SELECT COUNT(m.id)::int
          FROM request_logs m
          WHERE m.user_id = rl.user_id
            AND m.created_at >= NOW() - INTERVAL '1 minute'
            AND m.status <> 429
            AND m.path NOT LIKE '/api/v1/dashboard%'
            AND m.path NOT LIKE '/api/v1/newsletter%'
        ) as "minuteRequests"
      FROM request_logs rl
      JOIN users u ON rl.user_id = u.id
      LEFT JOIN plans p ON u.plan_id = p.id
      WHERE rl.created_at >= $1 AND rl.created_at <= $2
        AND rl.path NOT LIKE '/api/v1/dashboard%'
        AND rl.path NOT LIKE '/api/v1/newsletter%'
      GROUP BY rl.user_id, u.user, u.email, u.status, p.name, p.req_min, p.req_month
      ORDER BY "totalRequests" DESC
      LIMIT $3
    `;

    return this.prisma.$queryRawUnsafe<any[]>(query, startDate, endDate, limit);
  }

  async getTopEndpoints(startDate: Date, endDate: Date, limit = 10, userId?: string) {
    const query = `
      SELECT
        method as "method",
        regexp_replace(
          regexp_replace(path, '/[0-9a-fA-F-]{36}', '/:id', 'g'),
          '/[0-9]+', '/:id', 'g'
        ) as "path",
        COUNT(id)::int as "totalRequests",
        ROUND((SUM(CASE WHEN status >= 200 AND status < 300 THEN 1 ELSE 0 END)::float / COUNT(id) * 100)::numeric, 2)::float as "successRate",
        ROUND(AVG(duration_ms)::numeric, 2)::float as "avgLatency",
        ROUND(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration_ms)::numeric, 2)::float as "p95Latency"
      FROM request_logs
      WHERE created_at >= $1 AND created_at <= $2
        ${userId ? 'AND user_id = $3' : ''}
        AND path NOT LIKE '/api/v1/dashboard%'
        AND path NOT LIKE '/api/v1/newsletter%'
      GROUP BY method, 2
      ORDER BY "totalRequests" DESC
      LIMIT ${userId ? '$4' : '$3'}
    `;

    const params = userId ? [startDate, endDate, userId, limit] : [startDate, endDate, limit];
    return this.prisma.$queryRawUnsafe<any[]>(query, ...params);
  }

  async getStatusDistribution(startDate: Date, endDate: Date, userId?: string) {
    const query = `
      SELECT
        CASE
          WHEN status >= 200 AND status < 300 THEN '2xx'
          WHEN status >= 300 AND status < 400 THEN '3xx'
          WHEN status = 429 THEN '429'
          WHEN status >= 400 AND status < 500 THEN '4xx'
          WHEN status >= 500 THEN '5xx'
          ELSE 'Outro'
        END as "statusClass",
        COUNT(id)::int as "count"
      FROM request_logs
      WHERE created_at >= $1 AND created_at <= $2
        ${userId ? 'AND user_id = $3' : ''}
        AND path NOT LIKE '/api/v1/dashboard%'
        AND path NOT LIKE '/api/v1/newsletter%'
      GROUP BY 1
      ORDER BY "count" DESC
    `;

    const params = userId ? [startDate, endDate, userId] : [startDate, endDate];
    return this.prisma.$queryRawUnsafe<any[]>(query, ...params);
  }

  async getTimeSeries(startDate: Date, endDate: Date, customInterval?: string, userId?: string) {
    let interval = customInterval;

    if (!interval) {
      const diffMs = endDate.getTime() - startDate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours <= 2) {
        interval = '1m';
      } else if (diffHours <= 12) {
        interval = '15m';
      } else if (diffHours <= 24) {
        interval = '30m';
      } else if (diffHours <= 72) {
        interval = 'hour';
      } else {
        interval = 'day';
      }
    }

    let sqlTimestampExpr = "DATE_TRUNC('day', created_at)";
    if (interval === '1m' || interval === 'minute') {
      sqlTimestampExpr = "DATE_TRUNC('minute', created_at)";
    } else if (interval === '15m' || interval === '15minute') {
      sqlTimestampExpr =
        "to_timestamp(floor(extract(epoch from created_at) / 900) * 900) AT TIME ZONE 'UTC'";
    } else if (interval === '30m' || interval === '30minute') {
      sqlTimestampExpr =
        "to_timestamp(floor(extract(epoch from created_at) / 1800) * 1800) AT TIME ZONE 'UTC'";
    } else if (interval === 'hour') {
      sqlTimestampExpr = "DATE_TRUNC('hour', created_at)";
    } else if (interval === 'day') {
      sqlTimestampExpr = "DATE_TRUNC('day', created_at)";
    }

    const query = `
      SELECT
        ${sqlTimestampExpr} as "timestamp",
        COUNT(id)::int as "count",
        SUM(CASE WHEN status >= 200 AND status < 300 THEN 1 ELSE 0 END)::int as "success",
        SUM(CASE WHEN status >= 400 AND status < 500 THEN 1 ELSE 0 END)::int as "clientError",
        SUM(CASE WHEN status >= 500 THEN 1 ELSE 0 END)::int as "serverError",
        SUM(CASE WHEN status >= 400 THEN 1 ELSE 0 END)::int as "error"
      FROM request_logs
      WHERE created_at >= $1 AND created_at <= $2
        ${userId ? 'AND user_id = $3' : ''}
        AND path NOT LIKE '/api/v1/dashboard%'
        AND path NOT LIKE '/api/v1/newsletter%'
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    const params = userId ? [startDate, endDate, userId] : [startDate, endDate];
    return this.prisma.$queryRawUnsafe<any[]>(query, ...params);
  }

  async getProactiveAlerts() {
    const query = `
      SELECT
        u.id as "userId",
        u.user as "username",
        u.email as "email",
        p.name as "planName",
        p.req_month as "planReqMonth",
        COUNT(rl.id)::int as "monthlyRequests",
        ROUND((COUNT(rl.id)::float / p.req_month * 100)::numeric, 2)::float as "usagePercentage",
        EXISTS (
          SELECT 1 FROM usage_alert_logs ual
          WHERE ual.user_id = u.id
            AND ual.sent_at >= DATE_TRUNC('month', CURRENT_DATE)
        ) as "notified"
      FROM request_logs rl
      JOIN users u ON rl.user_id = u.id
      JOIN plans p ON u.plan_id = p.id
      WHERE rl.created_at >= DATE_TRUNC('month', CURRENT_DATE)
        AND rl.status <> 429
        AND rl.path NOT LIKE '/api/v1/dashboard%'
        AND rl.path NOT LIKE '/api/v1/newsletter%'
      GROUP BY u.id, u.user, u.email, p.name, p.req_month
      HAVING COUNT(rl.id)::float / p.req_month >= 0.8
      ORDER BY "usagePercentage" DESC
    `;

    return this.prisma.$queryRawUnsafe<any[]>(query);
  }

  async getHeartbeatStatus() {
    try {
      const hb = await this.prisma.systemHeartbeat.findUnique({
        where: { service: 'log-processor' },
      });
      if (!hb) {
        return { status: 'INACTIVE', lastSeen: null };
      }
      const diffMin = (new Date().getTime() - hb.timestamp.getTime()) / (1000 * 60);
      return {
        status: diffMin <= 2 ? 'ACTIVE' : 'INACTIVE',
        lastSeen: hb.timestamp,
      };
    } catch (e) {
      return { status: 'INACTIVE', lastSeen: null };
    }
  }

  async getRequestLogs(startDate: Date, endDate: Date, page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT
        rl.created_at as "timestamp",
        rl.method as "method",
        rl.path as "path",
        rl.status as "status",
        rl.duration_ms as "durationMs",
        u.user as "username",
        u.email as "email"
      FROM request_logs rl
      JOIN users u ON rl.user_id = u.id
      WHERE rl.created_at >= $1 AND rl.created_at <= $2
        AND rl.path NOT LIKE '/api/v1/dashboard%'
        AND rl.path NOT LIKE '/api/v1/newsletter%'
      ORDER BY rl.created_at DESC
      LIMIT $3 OFFSET $4
    `;

    const countQuery = `
      SELECT COUNT(rl.id)::int as "total"
      FROM request_logs rl
      WHERE rl.created_at >= $1 AND rl.created_at <= $2
        AND rl.path NOT LIKE '/api/v1/dashboard%'
        AND rl.path NOT LIKE '/api/v1/newsletter%'
    `;

    const [data, totalResult] = await Promise.all([
      this.prisma.$queryRawUnsafe<any[]>(query, startDate, endDate, limit, offset),
      this.prisma.$queryRawUnsafe<any[]>(countQuery, startDate, endDate),
    ]);

    const total = totalResult[0]?.total || 0;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }


  async getDatabaseLoad(startDate: Date, endDate: Date, limit = 10) {
    const query = `
      SELECT
        dc.host as "host",
        dc.database as "database",
        COUNT(rl.id)::int as "totalRequests"
      FROM request_logs rl
      JOIN users u ON rl.user_id = u.id
      JOIN db_credentials dc ON u.db_credentials_id = dc.id
      WHERE rl.created_at >= $1 AND rl.created_at <= $2
        AND rl.path NOT LIKE '/api/v1/dashboard%'
        AND rl.path NOT LIKE '/api/v1/newsletter%'
      GROUP BY dc.host, dc.database
      ORDER BY "totalRequests" DESC
      LIMIT $3
    `;

    return this.prisma.$queryRawUnsafe<any[]>(query, startDate, endDate, limit);
  }

  async getPlanDistribution(startDate: Date, endDate: Date) {
    const query = `
      SELECT
        COALESCE(p.name, 'Sem Plano') as "planName",
        COUNT(rl.id)::int as "totalRequests"
      FROM request_logs rl
      JOIN users u ON rl.user_id = u.id
      LEFT JOIN plans p ON u.plan_id = p.id
      WHERE rl.created_at >= $1 AND rl.created_at <= $2
        AND rl.path NOT LIKE '/api/v1/dashboard%'
        AND rl.path NOT LIKE '/api/v1/newsletter%'
      GROUP BY p.name
      ORDER BY "totalRequests" DESC
    `;

    return this.prisma.$queryRawUnsafe<any[]>(query, startDate, endDate);
  }

  async getDossierData(type: 'internal' | 'client', startDate: Date, endDate: Date, userId?: string) {
    if (type === 'client') {
      if (!userId) {
        throw new Error('userId é obrigatório para dossiê do cliente');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { plan: true },
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const monthlyRequests = await this.prisma.requestLog.count({
        where: {
          userId,
          createdAt: { gte: startOfMonth },
          status: { not: 429 },
          NOT: [
            { path: { startsWith: '/api/v1/dashboard' } },
            { path: { startsWith: '/api/v1/newsletter' } },
          ],
        },
      });

      const [summary, topEndpoints, statusDistribution, timeSeries] = await Promise.all([
        this.getSummary(startDate, endDate, userId),
        this.getTopEndpoints(startDate, endDate, 10, userId),
        this.getStatusDistribution(startDate, endDate, userId),
        this.getTimeSeries(startDate, endDate, undefined, userId),
      ]);

      return {
        type: 'client',
        user: {
          id: user.id,
          username: user.user,
          email: user.email,
          status: user.status,
          planName: user.plan?.name || 'Sem Plano',
          planReqMonth: user.plan?.reqMonth || 0,
          monthlyRequests,
        },
        summary,
        topEndpoints,
        statusDistribution,
        timeSeries,
      };
    } else {
      const [
        summary,
        topUsers,
        topEndpoints,
        statusDistribution,
        databaseLoad,
        proactiveAlerts,
        planDistribution,
        timeSeries,
        heartbeat,
      ] = await Promise.all([
        this.getSummary(startDate, endDate),
        this.getTopUsers(startDate, endDate, 10),
        this.getTopEndpoints(startDate, endDate, 10),
        this.getStatusDistribution(startDate, endDate),
        this.getDatabaseLoad(startDate, endDate, 10),
        this.getProactiveAlerts(),
        this.getPlanDistribution(startDate, endDate),
        this.getTimeSeries(startDate, endDate),
        this.getHeartbeatStatus(),
      ]);

      return {
        type: 'internal',
        summary,
        topUsers,
        topEndpoints,
        statusDistribution,
        databaseLoad,
        proactiveAlerts,
        planDistribution,
        timeSeries,
        heartbeat,
      };
    }
  }
}
