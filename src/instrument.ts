import 'dotenv/config';
import * as Sentry from '@sentry/node';

Sentry.init({
    dsn: process.env.GLITCHTIP_DSN,
    environment: process.env.NODE_ENV || 'development',
    integrations: [
        Sentry.nodeContextIntegration(),
        // Captura automaticamente console.log/warn/error/debug/info
        Sentry.captureConsoleIntegration({
            levels: ['warn', 'error'],
        }),
        // Captura HTTP requests como breadcrumbs no trace
        Sentry.httpIntegration({ breadcrumbs: true }),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
    // Envia logs estruturados (Sentry.logger.*) para o GlitchTip
    enableLogs: true,
});