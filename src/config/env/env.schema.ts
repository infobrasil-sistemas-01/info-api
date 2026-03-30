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
  PORT: z.string().default('3000'),
  DATABASE_URL: z
    .string()
    .default('postgresql://user:password@localhost:5432/mydb'),
  JWT_SECRET: z.string().default('your_jwt_secret'),
  JWT_EXPIRES_IN: stringValue.default('15m' as StringValue),
  REFRESH_TOKEN_DAYS: z.coerce.number().int().positive().default(30),
  P99: z.string(),
  P131: z.string(),
  P104: z.string(),
});

export type Env = z.infer<typeof envSchema>;
