import { StringValue } from 'ms';
import z from 'zod';

const stringValue = z.custom<StringValue>(
  (v) => typeof v === 'string' && v.length > 0,
  'Must be a valid ms string',
);

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  HOST: z.string().default('localhost'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z
    .string()
    .default('postgresql://user:password@localhost:5432/mydb'),
  JWT_SECRET: z.string().default('your_jwt_secret'),
  JWT_EXPIRES_IN: stringValue.default('15m' as StringValue),
  REFRESH_TOKEN_DAYS: z.coerce.number().int().positive().default(30),
  P98: z.string(),
  P99: z.string(),
  P131: z.string(),
  P104: z.string(),
  P129: z.string(),
  CRYPTO_ENC: z.string(),
  CRYPTO_IV: z.string(),
  CRYPTO_ALGO: z.string().default('aes-256-cbc'),
  GLITCHTIP_DSN: z.string(),
  // Email Configuration (Gmail API)
  GMAIL_USER: z.string(),
  GMAIL_CLIENT_ID: z.string(),
  GMAIL_CLIENT_SECRET: z.string(),
  GMAIL_REFRESH_TOKEN: z.string(),
  SUPPORT_EMAIL: z.string().default('suporte@infobrasilsistemas.com.br'),
  UPTIMEROBOT_APIKEY: z.string(),
  UPTIMEROBOT_MONITOR_ID: z.string(),
  UPTIMEROBOT_APIURL: z.string()
});

export type Env = z.infer<typeof envSchema>;
