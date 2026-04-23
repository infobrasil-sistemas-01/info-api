import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Injectable()
export class GlobalLoggerService extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    super.error(message, stack, context);

    if (process.env.NODE_ENV === 'production' || process.env.GLITCHTIP_DSN) {
      Sentry.withScope((scope) => {
        if (context) {
          scope.setTag('context', context);
        }
        if (stack) {
          scope.setExtra('stack', stack);
        }
        
        const errorToCapture = message instanceof Error ? message : new Error(String(message));
        if (stack && !(message instanceof Error)) {
           errorToCapture.stack = stack;
        }
        
        Sentry.captureException(errorToCapture);
      });
    }
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
    
    if (process.env.NODE_ENV === 'production' || process.env.GLITCHTIP_DSN) {
      Sentry.withScope((scope) => {
        if (context) {
          scope.setTag('context', context);
        }
        Sentry.captureMessage(String(message), 'warning');
      });
    }
  }
}
