import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

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

    const message = typeof body === 'object' && body !== null && 'message' in body 
      ? (body as any).message 
      : body;

    this.logger.error(
      `${request.method} ${request.url} ${status} - Error: ${JSON.stringify(message)}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // Capture 5xx errors in Sentry
    if (status >= 500) {
      Sentry.captureException(exception);
    }

    response.status(status).json(
      typeof body === 'object'
        ? { ...body, timestamp: new Date().toISOString(), path: request.url }
        : { message: body, statusCode: status, timestamp: new Date().toISOString(), path: request.url }
    );
  }
}
