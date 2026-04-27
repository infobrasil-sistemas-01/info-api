import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IpBlocklistService } from '../throttle/ip-blocklist.service';

/**
 * IpBlocklistMiddleware
 *
 * Middleware global que short-circuits requisições de IPs bloqueados
 * antes de chegarem ao roteador do NestJS.
 *
 * Extrai o IP real do cliente usando req.ip (que já leva em conta
 * o trust proxy configurado no main.ts, respeitando X-Forwarded-For).
 *
 * IPs de loopback (localhost) nunca são bloqueados.
 */
@Injectable()
export class IpBlocklistMiddleware implements NestMiddleware {
  constructor(private readonly ipBlocklist: IpBlocklistService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const ip = this.extractIp(req);

    if (!this.isLoopback(ip) && this.ipBlocklist.isBlocked(ip)) {
      const retryAfter = this.ipBlocklist.secondsUntilUnblock(ip);

      res.setHeader('Retry-After', String(retryAfter));
      res.status(429).json({
        statusCode: 429,
        message: 'Too Many Requests',
        retryAfter,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  }

  /**
   * Extrai o IP real do cliente.
   * req.ip já resolve X-Forwarded-For quando trust proxy está ativo.
   * Fallback para X-Real-IP caso req.ip não esteja disponível.
   */
  private extractIp(req: Request): string {
    return (
      req.ip ??
      (req.headers['x-real-ip'] as string) ??
      req.socket.remoteAddress ??
      'unknown'
    );
  }

  private isLoopback(ip: string): boolean {
    return ip === '127.0.0.1' || ip === '::1' || ip === 'unknown';
  }
}
