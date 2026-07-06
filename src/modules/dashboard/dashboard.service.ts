import { Injectable } from '@nestjs/common';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: RegistryPrismaService) {}

  async getSummary(startDate: Date, endDate: Date) {
    const totalRequests = await this.prisma.requestLog.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        path: {
          not: {
            startsWith: '/api/v1/dashboard',
          },
        },
      },
    });

    const activeUsersResult = await this.prisma.requestLog.groupBy({
      by: ['userId'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        path: {
          not: {
            startsWith: '/api/v1/dashboard',
          },
        },
      },
    });
    const activeUsers = activeUsersResult.length;

    const successRequests = await this.prisma.requestLog.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          gte: 200,
          lt: 300,
        },
        path: {
          not: {
            startsWith: '/api/v1/dashboard',
          },
        },
      },
    });

    const successRate =
      totalRequests > 0 ? (successRequests / totalRequests) * 100 : 100;

    const rateLimitHits = await this.prisma.requestLog.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: 429,
        path: {
          not: {
            startsWith: '/api/v1/dashboard',
          },
        },
      },
    });

    return {
      totalRequests,
      activeUsers,
      successRate,
      rateLimitHits,
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
        p.req_month as "planReqMonth",
        COUNT(rl.id)::int as "totalRequests",
        ROUND((SUM(CASE WHEN rl.status >= 400 THEN 1 ELSE 0 END)::float / COUNT(rl.id) * 100)::numeric, 2)::float as "errorRate",
        (
          SELECT COUNT(m.id)::int
          FROM request_logs m
          WHERE m.user_id = rl.user_id
            AND m.created_at >= DATE_TRUNC('month', CURRENT_DATE)
            AND m.path NOT LIKE '/api/v1/dashboard%'
        ) as "monthlyRequests"
      FROM request_logs rl
      JOIN users u ON rl.user_id = u.id
      LEFT JOIN plans p ON u.plan_id = p.id
      WHERE rl.created_at >= $1 AND rl.created_at <= $2
        AND rl.path NOT LIKE '/api/v1/dashboard%'
      GROUP BY rl.user_id, u.user, u.email, u.status, p.name, p.req_month
      ORDER BY "totalRequests" DESC
      LIMIT $3
    `;

    return this.prisma.$queryRawUnsafe<any[]>(query, startDate, endDate, limit);
  }

  async getTopEndpoints(startDate: Date, endDate: Date, limit = 10) {
    const query = `
      SELECT
        method as "method",
        regexp_replace(
          regexp_replace(path, '/[0-9a-fA-F-]{36}', '/:id', 'g'),
          '/[0-9]+', '/:id', 'g'
        ) as "path",
        COUNT(id)::int as "totalRequests",
        ROUND((SUM(CASE WHEN status >= 200 AND status < 300 THEN 1 ELSE 0 END)::float / COUNT(id) * 100)::numeric, 2)::float as "successRate"
      FROM request_logs
      WHERE created_at >= $1 AND created_at <= $2
        AND path NOT LIKE '/api/v1/dashboard%'
      GROUP BY method, 2
      ORDER BY "totalRequests" DESC
      LIMIT $3
    `;

    return this.prisma.$queryRawUnsafe<any[]>(query, startDate, endDate, limit);
  }

  async getStatusDistribution(startDate: Date, endDate: Date) {
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
        AND path NOT LIKE '/api/v1/dashboard%'
      GROUP BY 1
      ORDER BY "count" DESC
    `;

    return this.prisma.$queryRawUnsafe<any[]>(query, startDate, endDate);
  }

  async getTimeSeries(startDate: Date, endDate: Date, customInterval?: string) {
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
        SUM(CASE WHEN status >= 400 THEN 1 ELSE 0 END)::int as "error"
      FROM request_logs
      WHERE created_at >= $1 AND created_at <= $2
        AND path NOT LIKE '/api/v1/dashboard%'
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    return this.prisma.$queryRawUnsafe<any[]>(query, startDate, endDate);
  }

  async getProactiveAlerts() {
    const query = `
      SELECT
        u.user as "username",
        u.email as "email",
        p.name as "planName",
        p.req_month as "planReqMonth",
        COUNT(rl.id)::int as "monthlyRequests",
        ROUND((COUNT(rl.id)::float / p.req_month * 100)::numeric, 2)::float as "usagePercentage"
      FROM request_logs rl
      JOIN users u ON rl.user_id = u.id
      JOIN plans p ON u.plan_id = p.id
      WHERE rl.created_at >= DATE_TRUNC('month', CURRENT_DATE)
        AND rl.path NOT LIKE '/api/v1/dashboard%'
      GROUP BY u.user, u.email, p.name, p.req_month
      HAVING COUNT(rl.id)::float / p.req_month >= 0.8
      ORDER BY "usagePercentage" DESC
    `;

    return this.prisma.$queryRawUnsafe<any[]>(query);
  }

  async getTopIPs(startDate: Date, endDate: Date, limit = 10) {
    const query = `
      SELECT
        ip as "ip",
        COUNT(id)::int as "totalRequests"
      FROM request_logs
      WHERE created_at >= $1 AND created_at <= $2 AND ip IS NOT NULL
        AND path NOT LIKE '/api/v1/dashboard%'
      GROUP BY ip
      ORDER BY "totalRequests" DESC
      LIMIT $3
    `;

    return this.prisma.$queryRawUnsafe<any[]>(query, startDate, endDate, limit);
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
      GROUP BY p.name
      ORDER BY "totalRequests" DESC
    `;

    return this.prisma.$queryRawUnsafe<any[]>(query, startDate, endDate);
  }
}
