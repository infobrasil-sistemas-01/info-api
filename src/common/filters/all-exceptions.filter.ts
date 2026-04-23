import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';

/**
 * AllExceptionsFilter
 *
 * Captura todas as exceções e:
 *  - Envia 5xx ao Sentry como exceção (com stack trace)
 *  - Envia 4xx importantes (401, 403, 404) como eventos de warning no Sentry
 *  - Adiciona breadcrumb para todos os erros
 *  - Formata a resposta JSON padronizada
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
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

    // Breadcrumb para todos os erros
    Sentry.addBreadcrumb({
      type: 'error',
      category: 'exception',
      message: `${request.method} ${request.url} → ${status}: ${errorMessage}`,
      data: { status_code: status, path: request.url },
      level: status >= 500 ? 'error' : 'warning',
    });

    if (status >= 500) {
      // Erros de servidor: captura como exceção com stack trace completo
      Sentry.withScope((scope) => {
        scope.setTag('http.status', String(status));
        scope.setTag('http.method', request.method);
        scope.setExtra('request.url', request.url);
        scope.setExtra('request.body', request.body);
        Sentry.captureException(exception);
      });
    } else if (status === 401 || status === 403 || status === 404) {
      // Erros de cliente relevantes: captura como warning para visibilidade
      Sentry.withScope((scope) => {
        scope.setTag('http.status', String(status));
        scope.setTag('http.method', request.method);
        scope.setExtra('request.url', request.url);
        Sentry.captureMessage(
          `[${status}] ${request.method} ${request.url} – ${errorMessage}`,
          'warning',
        );
      });
    }

    // Log estruturado
    if (status >= 500) {
      Sentry.logger.error(
        `${request.method} ${request.url} ${status} – ${errorMessage}`,
      );
    } else if (status >= 400) {
      Sentry.logger.warn(
        `${request.method} ${request.url} ${status} – ${errorMessage}`,
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
