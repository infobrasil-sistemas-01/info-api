import { Injectable } from '@nestjs/common';
import { RegistryPrismaService } from '../prisma/registry-prisma.service';
import { FirebirdService, IConnectionOptions } from '../firebird/firebird.service';
import * as firebird from 'node-firebird';

@Injectable()
export class TenantConnectionService {
  /** Cache dos dados de conexão consultados do banco (Prisma). Um registro por tenant. */
  private credentialsCache = new Map<string, IConnectionOptions>();

  /** Cache de pools de conexão Firebird. Um pool por tenant. */
  private poolCache = new Map<string, firebird.ConnectionPool>();

  constructor(
    private readonly prisma: RegistryPrismaService,
    private readonly firebirdService: FirebirdService,
  ) { }

  /**
   * Retorna uma conexão individual do pool do tenant.
   * Após o uso, chame `releaseConnection(connection)` para devolvê-la ao pool.
   */
  async getConnection(credentialsId: string): Promise<firebird.Database> {
    const pool = await this.getPool(credentialsId);

    return new Promise<firebird.Database>((resolve, reject) => {
      pool.get((err, db) => {
        if (err) return reject(err);
        resolve(db);
      });
    });
  }

  /**
   * Devolve a conexão ao pool (não fecha o socket).
   * Sempre chame isso no `finally` após usar getConnection().
   */
  releaseConnection(connection: firebird.Database): void {
    if (!connection) return;
    connection.detach();
  }

  /**
   * Destrói o pool de um tenant (ex: ao remover credenciais).
   * O cache de credenciais é mantido para que o pool possa ser recriado sem ir ao banco.
   * Não use em fluxos normais de requisição.
   */
  async destroyPool(credentialsId: string): Promise<void> {
    const pool = this.poolCache.get(credentialsId);
    if (!pool) return;

    await new Promise<void>((resolve) => {
      pool.destroy(() => resolve());
    });

    this.poolCache.delete(credentialsId);
  }

  /**
   * Remove as credenciais do cache (ex: ao atualizar dados de conexão no banco).
   * Destrói o pool existente e força nova consulta ao banco na próxima requisição.
   */
  async invalidateCredentials(credentialsId: string): Promise<void> {
    await this.destroyPool(credentialsId);
    this.credentialsCache.delete(credentialsId);
  }

  private async getPool(credentialsId: string): Promise<firebird.ConnectionPool> {
    if (this.poolCache.has(credentialsId)) {
      return this.poolCache.get(credentialsId)!;
    }

    const connectionOptions = await this.getCredentials(credentialsId);
    const pool = this.firebirdService.createPool(connectionOptions);

    this.poolCache.set(credentialsId, pool);

    return pool;
  }

  /**
   * Retorna as opções de conexão para um tenant.
   * Consulta o banco (Prisma) apenas na primeira vez; nas chamadas seguintes,
   * retorna do cache em memória.
   */
  private async getCredentials(credentialsId: string): Promise<IConnectionOptions> {
    if (this.credentialsCache.has(credentialsId)) {
      return this.credentialsCache.get(credentialsId)!;
    }

    const credentials = await this.prisma.dbCredentials.findUnique({
      where: { id: credentialsId },
    });

    if (!credentials) {
      throw new Error(`Credentials not found for id: ${credentialsId}`);
    }

    if (
      !credentials.host ||
      !credentials.database ||
      !credentials.user ||
      !credentials.port
    ) {
      throw new Error(
        `Credentials for id: ${credentialsId} are missing required fields`,
      );
    }

    const options: IConnectionOptions = {
      host: credentials.host,
      database: credentials.database,
      user: credentials.user,
      id: credentials?.dbId,
      port: credentials.port,
      pageSize: 4096,
    };

    this.credentialsCache.set(credentialsId, options);

    return options;
  }
}
