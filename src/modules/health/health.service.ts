import { Injectable } from '@nestjs/common';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import path from 'path';
import fs from 'fs';

const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageVersion = fs.existsSync(packageJsonPath)
  ? JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).version
  : '1.0.0';

export interface DatabaseStatus {
  status: 'up' | 'down';
  responseTimeMs?: number;
  error?: string;
}

export interface FirebirdTenantStatus {
  credentialsId: string;
  status: 'up' | 'down';
  responseTimeMs: number;
  error?: string;
}

export interface FirebirdStatus {
  activePools: number;
  cachedCredentials: number;
  /**
   * Resultado do ping em cada pool aquecido.
   * Pools inativos (nunca conectados nesta instância) não são verificados.
   */
  tenants: FirebirdTenantStatus[];
}

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  version: string;
  uptime: number;
  timestamp: string;
  databases: {
    postgres: DatabaseStatus;
    firebird: FirebirdStatus;
  };
}
@Injectable()
export class HealthService {
  private lastCheck: HealthStatus | null = null;
  private lastCheckTime = 0;
  private readonly CACHE_TTL = 30000; // 30 segundos

  constructor(
    private readonly prisma: RegistryPrismaService,
    private readonly tenantConnections: TenantConnectionService,
  ) { }

  async check(): Promise<HealthStatus> {
    const now = Date.now();
    if (this.lastCheck && now - this.lastCheckTime < this.CACHE_TTL) {
      return {
        ...this.lastCheck,
        timestamp: new Date().toISOString(), // Mantém o timestamp atualizado
      };
    }

    const [postgres, firebird] = await Promise.all([
      this.checkPostgres(),
      this.checkFirebird(),
    ]);

    const postgresOk = postgres.status === 'up';
    const firebirdOk =
      firebird.tenants.length === 0 ||
      firebird.tenants.every((t) => t.status === 'up');

    const status = postgresOk && firebirdOk ? 'ok' : 'degraded';

    this.lastCheck = {
      status,
      version: packageVersion,
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      databases: { postgres, firebird },
    };
    this.lastCheckTime = now;

    return this.lastCheck;
  }

  async checkPostgres(): Promise<DatabaseStatus> {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'up', responseTimeMs: Date.now() - start };
    } catch (err: any) {
      return {
        status: 'down',
        responseTimeMs: Date.now() - start,
        error: err?.message ?? 'Unknown error',
      };
    }
  }

  async checkTenant(dbCredentialsId: string): Promise<FirebirdTenantStatus> {
    const start = Date.now();
    try {
      await this.tenantConnections.ping(dbCredentialsId);
      return {
        credentialsId: dbCredentialsId,
        status: 'up',
        responseTimeMs: Date.now() - start,
      };
    } catch (err: any) {
      return {
        credentialsId: dbCredentialsId,
        status: 'down',
        responseTimeMs: Date.now() - start,
        error: err?.message ?? 'Unknown error',
      };
    }
  }

  private async checkFirebird(): Promise<FirebirdStatus> {
    const stats = this.tenantConnections.getPoolStats();
    const tenants = await this.tenantConnections.pingActivePools();

    return {
      activePools: stats.activePools,
      cachedCredentials: stats.cachedCredentials,
      tenants,
    };
  }
}
