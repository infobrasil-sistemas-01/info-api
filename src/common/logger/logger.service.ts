import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';

/**
 * GlobalLoggerService
 *
 * Extende o ConsoleLogger do NestJS para rotear logs para o GlitchTip/Sentry:
 *  - error  → captureException (com stack) + log estruturado
 *  - warn   → captureMessage  + log estruturado
 *  - log    → log estruturado (nível info)
 *  - debug  → log estruturado (nível debug)
 *  - verbose→ log estruturado (nível trace)
 *
 * Os logs estruturados são visíveis no painel "Logs" do GlitchTip quando
 * enableLogs: true está configurado no Sentry.init().
 */
/**
 * Contextos do NestJS que são muito ruidosos durante a inicialização
 * e não precisam ir para o GlitchTip/Sentry.
 */
const NOISY_CONTEXTS = [
  'InstanceLoader',
  'RoutesResolver',
  'RouterExplorer',
  'NestFactory',
  'NestApplication',
  'StatusService', // Log de monitoramento a cada minuto
];

@Injectable()
export class GlobalLoggerService extends ConsoleLogger {
  // ------------------------------------------------------------------ error
  error(message: any, stack?: string, context?: string): void {
    super.error(message, stack, context);
    this.toSentryError(message, stack, context);
  }

  // ------------------------------------------------------------------ warn
  warn(message: any, context?: string): void {
    super.warn(message, context);
    this.toSentryWarn(message, context);
  }

  // ------------------------------------------------------------------ log (info)
  log(message: any, context?: string): void {
    super.log(message, context);
    if (context && NOISY_CONTEXTS.includes(context)) return;
    this.toSentryLog('info', message, context);
  }

  // ------------------------------------------------------------------ debug
  debug(message: any, context?: string): void {
    super.debug(message, context);
    if (context && NOISY_CONTEXTS.includes(context)) return;
    this.toSentryLog('debug', message, context);
  }

  // ------------------------------------------------------------------ verbose (trace)
  verbose(message: any, context?: string): void {
    super.verbose(message, context);
    if (context && NOISY_CONTEXTS.includes(context)) return;
    this.toSentryLog('trace', message, context);
  }

  // ------------------------------------------------------------------ helpers privados

  private toSentryError(message: any, stack?: string, context?: string): void {
    Sentry.withScope((scope) => {
      if (context) scope.setTag('logger.context', context);
      if (stack) scope.setExtra('stack', stack);

      const err =
        message instanceof Error ? message : new Error(String(message));
      if (stack && !(message instanceof Error)) {
        err.stack = stack;
      }
      Sentry.captureException(err);
    });
  }

  private toSentryWarn(message: any, context?: string): void {
    Sentry.withScope((scope) => {
      if (context) scope.setTag('logger.context', context);
      Sentry.captureMessage(String(message), 'warning');
    });
  }

  private toSentryLog(
    level: 'trace' | 'debug' | 'info' | 'log' | 'warning' | 'error' | 'fatal',
    message: any,
    context?: string,
  ): void {
    // Sentry.logger.* envia logs estruturados para o GlitchTip
    // (requer enableLogs: true no Sentry.init)
    const attrs: Record<string, string> = {};
    if (context) attrs['logger.context'] = context;

    switch (level) {
      case 'trace':
        Sentry.logger.trace(String(message), attrs);
        break;
      case 'debug':
        Sentry.logger.debug(String(message), attrs);
        break;
      case 'info':
      default:
        Sentry.logger.info(String(message), attrs);
        break;
    }
  }
}
