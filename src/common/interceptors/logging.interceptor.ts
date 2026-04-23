import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

/**
 * LoggingInterceptor
 *
 * Para cada requisição HTTP:
 *  - Adiciona um breadcrumb no Sentry com método, url, status e duração
 *  - Registra logs estruturados (info para 2xx/3xx, warn para 4xx/5xx)
 *  - Em caso de erro, registra o breadcrumb antes de repassar a exceção
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, headers } = request;

    // Health check: ignora completamente para não poluir logs e Sentry
    if (url.startsWith('/api/v1/health')) {
      return next.handle();
    }

    const now = Date.now();

    // Enriquece o scope Sentry com dados da requisição atual
    Sentry.getCurrentScope().setTag('http.method', method);
    Sentry.getCurrentScope().setTag('http.url', url);

    const userAgent = headers['user-agent'] ?? 'unknown';

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const statusCode: number = response.statusCode;
          const delay = Date.now() - now;

          Sentry.addBreadcrumb({
            type: 'http',
            category: 'http',
            message: `${method} ${url} ${statusCode} (${delay}ms)`,
            data: { method, url, status_code: statusCode, duration_ms: delay, userAgent },
            level: statusCode >= 400 ? 'warning' : 'info',
          });

          if (statusCode >= 400) {
            Sentry.logger.warn(`${method} ${url} → ${statusCode} (${delay}ms)`);
          } else {
            Sentry.logger.info(`${method} ${url} → ${statusCode} (${delay}ms)`);
          }
        },
        error: (error: any) => {
          const delay = Date.now() - now;
          const status = error?.status ?? 500;

          Sentry.addBreadcrumb({
            type: 'http',
            category: 'http',
            message: `${method} ${url} ${status} (${delay}ms) – ${error?.message ?? 'Unknown error'}`,
            data: { method, url, status_code: status, duration_ms: delay },
            level: 'error',
          });
        },
      }),
    );
  }
}
