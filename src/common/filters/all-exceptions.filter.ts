import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { IpBlocklistService } from '../throttle/ip-blocklist.service';
import { PlanService } from '../../modules/plan/plan.service';

/**
 * AllExceptionsFilter
 *
 * Captura todas as exceções e:
 *  - Envia 5xx ao Sentry como issue (captureException com stack trace)
 *  - Adiciona breadcrumb para todos os erros
 *  - Formata a resposta JSON padronizada
 *  - Registra 404s por IP para o IpBlocklistService (proteção contra bot scanning)
 */
@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly ipBlocklist: IpBlocklistService,
    private readonly planService: PlanService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const body =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error', statusCode: 500 };

    const message =
      typeof body === 'object' && body !== null && 'message' in body
        ? (body as any).message
        : body;

    const errorMessage =
      exception instanceof Error ? exception.message : String(message);

    // Registra 404s por IP para detecção de bot scanning
    if (status === 404) {
      const ip: string =
        request.ip ??
        (request.headers['x-real-ip'] as string) ??
        request.socket?.remoteAddress ??
        'unknown';
      // this.ipBlocklist.record404(ip);
    }

    // Tenta obter o userId do request.user ou decodificando o header Authorization
    let userId = request.user?.sub;
    if (!userId) {
      const authHeader = request.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payloadDecoded = Buffer.from(parts[1], 'base64').toString(
              'utf8',
            );
            const payload = JSON.parse(payloadDecoded);
            userId = payload.sub || payload.userId;
          }
        } catch {}
      }
    }

    // Isentar rotas de gestão operacional e autenticação da gravação de log
    const urlPath: string = request.url || '';
    const isExcluded = [
      '/api/v1/auth',
      '/api/v1/plans',
      '/api/v1/users',
      '/api/v1/roles',
      '/api/v1/permissions',
      '/api/v1/db-credentials',
      '/api/v1/announcements',
      '/api/v1/dashboard',
      '/api/v1/newsletter',
      '/integration',
      '/status',
    ].some((excluded) => urlPath.startsWith(excluded));

    // Grava o log de erro no banco de dados se não tiver sido gravado pelo interceptor
    if (userId && !request.logged && !isExcluded) {
      const ip: string =
        request.ip ??
        (request.headers['x-real-ip'] as string) ??
        request.socket?.remoteAddress ??
        'unknown';

      this.planService
        .logRequest(
          userId,
          request.method,
          request.url,
          status,
          ip,
          undefined, // durationMs
          false, // success
        )
        .catch(() => {});
    }

    const user = request.user;
    const userDisplay = user ? ` [User: ${user.username} (${user.sub})]` : '';

    // Breadcrumb para todos os erros
    Sentry.addBreadcrumb({
      type: 'error',
      category: 'exception',
      message: `${request.method} ${request.url}${userDisplay} → ${status}: ${errorMessage}`,
      data: {
        status_code: status,
        path: request.url,
        user: user ? { id: user.sub, name: user.username } : undefined,
      },
      level: status >= 500 ? 'error' : 'warning',
    });

    if (status >= 500) {
      // Erros de servidor: captura como exceção com stack trace completo
      Sentry.withScope((scope) => {
        if (user) {
          scope.setUser({ id: user.sub, username: user.username });
        }
        scope.setTag('http.status', String(status));
        scope.setTag('http.method', request.method);
        scope.setExtra('request.url', request.url);
        scope.setExtra('request.body', request.body);
        Sentry.captureException(exception);
      });
    }

    // Log estruturado
    if (status >= 500) {
      Sentry.logger.error(
        `${request.method} ${request.url}${userDisplay} ${status} – ${errorMessage}`,
      );
    } else if (status >= 400) {
      Sentry.logger.warn(
        `${request.method} ${request.url}${userDisplay} ${status} – ${errorMessage}`,
      );
    }

    response.status(status).json(
      typeof body === 'object'
        ? {
            ...body,
            timestamp: new Date().toISOString(),
            path: request.url,
          }
        : {
            message: body,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
          },
    );
  }
}
