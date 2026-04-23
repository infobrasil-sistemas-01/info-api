import 'dotenv/config';
import * as Sentry from '@sentry/node';

Sentry.init({
    dsn: process.env.GLITCHTIP_DSN,
    environment: process.env.NODE_ENV || 'development',
    integrations: [
        Sentry.nodeContextIntegration(),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
});