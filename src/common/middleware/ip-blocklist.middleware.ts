import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IpBlocklistService } from '../throttle/ip-blocklist.service';
import { extractClientIp } from '../../utils/ip.util';

/**
 * IpBlocklistMiddleware
 *
 * Middleware global que short-circuits requisições de IPs bloqueados
 * antes de chegarem ao roteador do NestJS.
 *
 * Extrai o IP real do cliente usando extractClientIp (respeitando Cloudflare,
 * Nginx reverse proxy e X-Forwarded-For).
 *
 * IPs de loopback (localhost) nunca são bloqueados.
 */
@Injectable()
export class IpBlocklistMiddleware implements NestMiddleware {
  constructor(private readonly ipBlocklist: IpBlocklistService) { }

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
   * Extrai o IP real do cliente utilizando a ordem de precedência centralizada:
   * cf-connecting-ip -> x-real-ip -> x-forwarded-for -> req.ip -> socket.remoteAddress
   */
  private extractIp(req: Request): string {
    return extractClientIp(req);
  }

  private isLoopback(ip: string): boolean {
    return ip === '127.0.0.1' || ip === '::1' || ip === 'unknown';
  }
}
