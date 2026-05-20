import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as Sentry from '@sentry/node';

/**
 * IpBlocklistService
 *
 * Rastreia 404s por IP usando uma janela deslizante e bloqueia IPs
 * que excedem o threshold configurado.
 *
 * Parâmetros (ajuste conforme análise dos logs):
 *  - WINDOW_MS:    Janela de observação (2 minutos)
 *  - HIT_THRESHOLD: Número de 404s para bloqueio (20 hits)
 *  - BLOCK_DURATION_MS: Duração do bloqueio (30 minutos)
 *  - CLEANUP_INTERVAL_MS: Intervalo de limpeza de entradas expiradas (5 minutos)
 */
@Injectable()
export class IpBlocklistService implements OnModuleInit, OnModuleDestroy {
  private static readonly WINDOW_MS = 2 * 60 * 1000; // 2 minutos
  private static readonly HIT_THRESHOLD = 20;
  private static readonly BLOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutos
  private static readonly CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutos

  /**
   * hits: IP → timestamps dos 404s dentro da janela atual
   * blocklist: IP → timestamp de expiração do bloqueio
   */
  private readonly hits = new Map<string, number[]>();
  private readonly blocklist = new Map<string, number>();
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  onModuleInit(): void {
    // Limpeza periódica para não acumular entradas expiradas em memória
    this.cleanupTimer = setInterval(
      () => this.cleanup(),
      IpBlocklistService.CLEANUP_INTERVAL_MS,
    );
  }

  onModuleDestroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
  }

  /**
   * Registra um 404 para o IP informado.
   * Se o número de hits na janela exceder o threshold, o IP é bloqueado.
   */
  record404(ip: string): void {
    if (this.isBlocked(ip)) return;

    const now = Date.now();
    const windowStart = now - IpBlocklistService.WINDOW_MS;

    // Poda timestamps fora da janela e adiciona o novo
    const timestamps = (this.hits.get(ip) ?? []).filter((t) => t > windowStart);
    timestamps.push(now);
    this.hits.set(ip, timestamps);

    if (timestamps.length >= IpBlocklistService.HIT_THRESHOLD) {
      const expiresAt = now + IpBlocklistService.BLOCK_DURATION_MS;
      this.blocklist.set(ip, expiresAt);
      this.hits.delete(ip);

      const blockedUntil = new Date(expiresAt).toISOString();
      Sentry.logger.warn(
        `[IpBlocklist] IP bloqueado por excesso de 404s: ${ip} (até ${blockedUntil})`,
      );
      Sentry.addBreadcrumb({
        type: 'security',
        category: 'ip-blocklist',
        message: `IP bloqueado: ${ip}`,
        data: { ip, blocked_until: blockedUntil, reason: '404_threshold' },
        level: 'warning',
      });
    }
  }

  /**
   * Verifica se o IP está bloqueado.
   * Remove automaticamente entradas expiradas encontradas.
   */
  isBlocked(ip: string): boolean {
    const expiresAt = this.blocklist.get(ip);
    if (expiresAt === undefined) return false;

    if (Date.now() >= expiresAt) {
      this.blocklist.delete(ip);
      return false;
    }

    return true;
  }

  /**
   * Retorna os segundos restantes de bloqueio para um IP, ou 0 se não bloqueado.
   */
  secondsUntilUnblock(ip: string): number {
    const expiresAt = this.blocklist.get(ip);
    if (!expiresAt) return 0;
    return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
  }

  /**
   * Limpeza periódica: remove entradas expiradas de ambos os Maps.
   */
  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - IpBlocklistService.WINDOW_MS;

    for (const [ip, timestamps] of this.hits) {
      const pruned = timestamps.filter((t) => t > windowStart);
      if (pruned.length === 0) {
        this.hits.delete(ip);
      } else {
        this.hits.set(ip, pruned);
      }
    }

    for (const [ip, expiresAt] of this.blocklist) {
      if (now >= expiresAt) {
        this.blocklist.delete(ip);
      }
    }
  }
}
