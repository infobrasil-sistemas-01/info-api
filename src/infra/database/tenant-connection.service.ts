import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { RegistryPrismaService } from '../prisma/registry-prisma.service';
import {
  FirebirdService,
  IConnectionOptions,
} from '../firebird/firebird.service';
import * as firebird from 'node-firebird';

@Injectable()
export class TenantConnectionService implements OnModuleInit, OnModuleDestroy {
  /** Cache dos dados de conexão consultados do banco (Prisma). Um registro por tenant. */
  private credentialsCache = new Map<string, IConnectionOptions>();

  /** Cache de pools de conexão Firebird. Um pool por tenant. */
  private poolCache = new Map<string, firebird.ConnectionPool>();

  /** Rastreamento do último uso de cada pool para evicção por inatividade. */
  private lastUsedMap = new Map<string, number>();

  private cleanupInterval: NodeJS.Timeout | null = null;
  private readonly IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutos de inatividade
  private readonly CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // Varredura a cada 5 minutos

  private readonly logger = new Logger(TenantConnectionService.name);

  constructor(
    private readonly prisma: RegistryPrismaService,
    private readonly firebirdService: FirebirdService,
  ) {}

  onModuleInit() {
    this.cleanupInterval = setInterval(() => {
      this.evictIdlePools().catch((err) => {
        this.logger.error(
          `Erro ao executar evicção de pools inativos: ${err?.message}`,
        );
      });
    }, this.CLEANUP_INTERVAL_MS);

    if (this.cleanupInterval?.unref) {
      this.cleanupInterval.unref();
    }
  }

  async onModuleDestroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    const poolIds = Array.from(this.poolCache.keys());
    await Promise.all(poolIds.map((id) => this.destroyPool(id)));
  }

  /**
   * Remove pools que ficaram inativos por mais de IDLE_TIMEOUT_MS.
   */
  async evictIdlePools(): Promise<number> {
    const now = Date.now();
    let evictedCount = 0;

    for (const [credentialsId, lastUsed] of this.lastUsedMap.entries()) {
      if (now - lastUsed > this.IDLE_TIMEOUT_MS) {
        this.logger.log(
          `Evicting pool inativo para o tenant ${credentialsId} (inativo há ${Math.round(
            (now - lastUsed) / 60000,
          )} min)`,
        );
        await this.destroyPool(credentialsId);
        this.lastUsedMap.delete(credentialsId);
        evictedCount++;
      }
    }

    return evictedCount;
  }

  /**
   * Retorna uma conexão individual do pool do tenant.
   * Após o uso, chame `releaseConnection(connection)` para devolvê-la ao pool.
   */
  async getConnection(
    credentialsId: string,
    isRetry = false,
  ): Promise<firebird.Database> {
    this.lastUsedMap.set(credentialsId, Date.now());
    const pool = await this.getPool(credentialsId);

    try {
      return await new Promise<firebird.Database>((resolve, reject) => {
        // Timeout de 10 segundos para obter uma conexão do pool
        const timeout = setTimeout(() => {
          reject(new Error('Timeout (10s) ao obter conexão do pool Firebird'));
        }, 10000);

        pool.get((err, db) => {
          clearTimeout(timeout);
          if (err) return reject(err);

          // Previne crash por Unhandled 'error' event caso a conexão caia depois
          // Verifica se já tem listener para não vazar memória no pool (MaxListenersExceededWarning)
          if ((db as any).listenerCount('error') === 0) {
            (db as any).on('error', (dbErr: any) => {
              this.logger.error(
                `Erro na conexão Firebird para o tenant ${credentialsId}: ${dbErr?.message}`,
              );
            });
          }

          // Envolve db.query com timeout de segurança (25s) para evitar que qualquer query direta fique presa
          if (!(db as any).__queryWrapped && typeof db.query === 'function') {
            const originalQuery = db.query.bind(db);
            (db as any).__queryWrapped = true;
            (db as any).query = (
              sql: string,
              paramsOrCallback?: any,
              callback?: (qErr: any, res: any) => void,
            ) => {
              let actualParams: any[] = [];
              let actualCallback: ((qErr: any, res: any) => void) | undefined;

              if (typeof paramsOrCallback === 'function') {
                actualCallback = paramsOrCallback;
              } else {
                actualParams = paramsOrCallback || [];
                actualCallback = callback;
              }

              if (!actualCallback) {
                return originalQuery(sql, actualParams);
              }

              let isDone = false;
              const timer = setTimeout(() => {
                if (!isDone) {
                  isDone = true;
                  this.logger.warn(
                    `Timeout (25s) na execução da query no tenant ${credentialsId}`,
                  );
                  actualCallback!(
                    new Error(
                      'Timeout na execução da query SQL no Firebird (25s)',
                    ),
                    null,
                  );
                }
              }, 25000);

              try {
                originalQuery(sql, actualParams, (qErr: any, res: any) => {
                  if (isDone) return;
                  isDone = true;
                  clearTimeout(timer);
                  actualCallback!(qErr, res);
                });
              } catch (syncErr) {
                if (isDone) return;
                isDone = true;
                clearTimeout(timer);
                actualCallback!(syncErr, null);
              }
            };
          }

          resolve(db);
        });
      });
    } catch (err: any) {
      this.logger.warn(
        `Falha ao obter conexão para o tenant ${credentialsId}: ${err.message}`,
      );

      // Invalida o pool problemático removendo-o do cache e destruindo-o
      await this.destroyPool(credentialsId);

      if (!isRetry) {
        this.logger.log(
          `Tentando recriar o pool para o tenant ${credentialsId} após falha...`,
        );
        return this.getConnection(credentialsId, true);
      }

      throw err;
    }
  }

  /**
   * Devolve a conexão ao pool (não fecha o socket).
   * Sempre chame isso no `finally` após usar getConnection().
   */
  releaseConnection(connection: firebird.Database): void {
    if (!connection) return;
    try {
      connection.detach();
    } catch (err: any) {
      this.logger.error(`Erro ao fazer detach: ${err.message}`);
    }
  }

  /**
   * Executa uma consulta SQL em uma conexão aberta com timeout garantido.
   * Caso a conexão trave ou demore mais que timeoutMs, a Promise rejeita.
   */
  queryWithTimeout<T = any>(
    connection: firebird.Database,
    query: string,
    params: any[] = [],
    timeoutMs = 25000,
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      let isDone = false;
      const timer = setTimeout(() => {
        if (!isDone) {
          isDone = true;
          reject(
            new Error(
              `Timeout na execução da query SQL no Firebird (${timeoutMs}ms)`,
            ),
          );
        }
      }, timeoutMs);

      try {
        connection.query(query, params, (err: any, res: any) => {
          if (isDone) return;
          isDone = true;
          clearTimeout(timer);
          if (err) return reject(err);
          resolve(res as T);
        });
      } catch (err) {
        if (isDone) return;
        isDone = true;
        clearTimeout(timer);
        reject(err);
      }
    });
  }

  /**
   * Método de conveniência que obtém uma conexão do pool, executa a consulta com timeout,
   * e garante a liberação no finally.
   * Se houver timeout no socket, o pool é automaticamente destruído para descartar sockets zumbis.
   */
  async query<T = any>(
    credentialsId: string,
    query: string,
    params: any[] = [],
    timeoutMs = 25000,
  ): Promise<T> {
    const connection = await this.getConnection(credentialsId);
    try {
      return await this.queryWithTimeout<T>(
        connection,
        query,
        params,
        timeoutMs,
      );
    } catch (err: any) {
      if (
        err?.message?.includes('Timeout') ||
        err?.message?.includes('timeout')
      ) {
        this.logger.warn(
          `Query timeout no tenant ${credentialsId}. Destruindo pool para reciclagem de sockets.`,
        );
        await this.destroyPool(credentialsId);
      }
      throw err;
    } finally {
      this.releaseConnection(connection);
    }
  }

  /**
   * Destrói o pool de um tenant (ex: ao remover credenciais).
   * O cache de credenciais é mantido para que o pool possa ser recriado sem ir ao banco.
   * Não use em fluxos normais de requisição.
   */
  async destroyPool(credentialsId: string): Promise<void> {
    const pool = this.poolCache.get(credentialsId);
    if (!pool) return;

    // Remove do cache IMEDIATAMENTE para evitar que outras requisições usem um pool em destruição
    this.poolCache.delete(credentialsId);
    this.lastUsedMap.delete(credentialsId);

    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        this.logger.warn(
          `Timeout (2s) ao destruir pool para o tenant: ${credentialsId}. Seguindo com a limpeza do cache.`,
        );
        resolve();
      }, 2000);

      try {
        pool.destroy(() => {
          clearTimeout(timeout);
          this.logger.log(
            `Pool de conexões destruído para o tenant: ${credentialsId}`,
          );
          resolve();
        });
      } catch (err: any) {
        clearTimeout(timeout);
        this.logger.error(
          `Erro ao destruir pool para o tenant ${credentialsId}: ${err.message}`,
        );
        resolve();
      }
    });
  }

  /**
   * Remove as credenciais do cache (ex: ao atualizar dados de conexão no banco).
   * Destrói o pool existente e força nova consulta ao banco na próxima requisição.
   */
  async invalidateCredentials(credentialsId: string): Promise<void> {
    await this.destroyPool(credentialsId);
    this.credentialsCache.delete(credentialsId);
  }

  /**
   * Retorna métricas sobre os caches de pools e credenciais.
   * Usado pelo health check sem fazer requisições ao banco.
   */
  getPoolStats(): {
    activePools: number;
    cachedCredentials: number;
    tenantIds: string[];
  } {
    return {
      activePools: this.poolCache.size,
      cachedCredentials: this.credentialsCache.size,
      tenantIds: Array.from(this.poolCache.keys()),
    };
  }

  /**
   * Tenta executar `SELECT 1 FROM RDB$DATABASE` em cada pool aquecido.
   * Retorna o resultado por tenant (sem lançar exceção).
   * Timeout de 3s por pool para não bloquear o health check.
   */
  async pingActivePools(): Promise<
    Array<{
      credentialsId: string;
      status: 'up' | 'down';
      responseTimeMs: number;
      error?: string;
    }>
  > {
    const poolEntries = Array.from(this.poolCache.entries());

    return await Promise.all(
      poolEntries.map(async ([credentialsId, pool]) => {
        const start = Date.now();
        try {
          await this.pingPool(pool);
          return {
            credentialsId,
            status: 'up' as const,
            responseTimeMs: Date.now() - start,
          };
        } catch (err: any) {
          return {
            credentialsId,
            status: 'down' as const,
            responseTimeMs: Date.now() - start,
            error: err?.message ?? 'Unknown error',
          };
        }
      }),
    );
  }

  async ping(credentialsId: string): Promise<void> {
    const pool = await this.getPool(credentialsId);
    await this.pingPool(pool);
  }

  private pingPool(pool: firebird.ConnectionPool): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error('Ping timeout (3s)')),
        3000,
      );

      pool.get((err, db) => {
        if (err) {
          clearTimeout(timeout);
          return reject(err);
        }

        if ((db as any).listenerCount('error') === 0) {
          (db as any).on('error', (dbErr: any) => {
            this.logger.error(
              `Erro na conexão Firebird durante pingPool: ${dbErr?.message}`,
            );
          });
        }

        try {
          db.query('SELECT 1 FROM RDB$DATABASE', [], (qErr) => {
            clearTimeout(timeout);
            try {
              db.detach();
            } catch (e) {
              // ignore detach errors if connection is broken
            }
            if (qErr) return reject(qErr);
            resolve();
          });
        } catch (e) {
          clearTimeout(timeout);
          try {
            db.detach();
          } catch (err) {}
          reject(e);
        }
      });
    });
  }

  private async getPool(
    credentialsId: string,
  ): Promise<firebird.ConnectionPool> {
    if (this.poolCache.has(credentialsId)) {
      return this.poolCache.get(credentialsId)!;
    }

    const connectionOptions = await this.getCredentials(credentialsId);
    const pool = this.firebirdService.createPool(connectionOptions);

    this.logger.log(
      `Novo pool de conexões criado para o tenant: ${credentialsId} (${connectionOptions.host})`,
    );
    this.poolCache.set(credentialsId, pool);

    return pool;
  }

  /**
   * Retorna as opções de conexão para um tenant.
   * Consulta o banco (Prisma) apenas na primeira vez; nas chamadas seguintes,
   * retorna do cache em memória.
   */
  private async getCredentials(
    credentialsId: string,
  ): Promise<IConnectionOptions> {
    if (this.credentialsCache.has(credentialsId)) {
      return this.credentialsCache.get(credentialsId)!;
    }

    this.logger.log(
      `Consultando credenciais no banco para o tenant: ${credentialsId}`,
    );
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
      wireCrypt: firebird.WIRE_CRYPT_ENABLE,
      user: credentials.user,
      id: credentials?.dbId,
      port: credentials.port,
      pageSize: 4096,
    };

    this.credentialsCache.set(credentialsId, options);

    return options;
  }
}
