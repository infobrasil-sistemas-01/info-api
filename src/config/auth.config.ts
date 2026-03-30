import { StringValue } from 'ms';
import { EnvService } from './env/env.service';

export type AuthConfig = {
  accessTokenTtl: StringValue;
  refreshTokenDays: number;
};

export const AUTH_CONFIG = Symbol('AUTH_CONFIG');

export function buildAuthConfig(env: EnvService): AuthConfig {
  return {
    accessTokenTtl: env.get('JWT_EXPIRES_IN'),
    refreshTokenDays: env.get('REFRESH_TOKEN_DAYS'),
  };
}
