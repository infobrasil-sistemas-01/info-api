import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { EnvService } from 'src/config/env/env.service';
import { JwtPayload } from '../types/jwt-payload';

@Injectable()
export class JwtH2mStrategy extends PassportStrategy(Strategy, 'jwt-h2m') {
  constructor(env: EnvService) {
    const staticPublicKey = env.getOptionalString('STS_PUBLIC_KEY');
    const jwksUrl = env.get('STS_JWKS_URL');
    const issuer = env.get('STS_ISSUER');

    const secretOrKeyProvider = staticPublicKey
      ? (_req: any, _rawJwtToken: any, done: (err: any, secret?: string) => void) => {
          done(null, staticPublicKey);
        }
      : passportJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 10,
          jwksUri: jwksUrl,
        });

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['RS256'],
      issuer,
      secretOrKeyProvider,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const credentialsId = payload.credentials_id || payload.credentialsId;

    if (!payload.sub || !credentialsId || !payload.usu_codigo) {
      throw new UnauthorizedException('Token H2M inválido: claims obrigatórias ausentes');
    }

    const resolvedStoreId = payload.storeId ?? payload.store_id ?? 1;

    return {
      ...payload,
      type: 'H2M',
      credentials_id: credentialsId,
      credentialsId,
      store_id: resolvedStoreId,
      storeId: resolvedStoreId,
    };
  }
}
