import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { JwtPayload } from '../types/jwt-payload';

export type AuthContext = {
  userId: string;
  credentialsId: string;
  storeId: number;
  type?: 'M2M' | 'H2M';
  usuCodigo?: number;
  funCodigo?: number;
};

export type ReqWithAuthContext = Request & {
  authContext?: AuthContext;
  log?: any;
  user?: any;
};

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt', 'jwt-h2m']) {
  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ): any {
    if (err || !user) {
      throw err || new UnauthorizedException(info?.message ?? 'Unauthorized');
    }

    const payload = user as JwtPayload;

    const req = context.switchToHttp().getRequest<ReqWithAuthContext>();

    const userId = payload?.sub;
    if (typeof userId !== 'string' || !userId) {
      throw new UnauthorizedException('Invalid token (missing sub)');
    }

    const credentialsId = payload.credentials_id || payload.credentialsId;
    if (!credentialsId) {
      throw new UnauthorizedException('Invalid token (missing credentialsId)');
    }

    const storeId = payload.store_id ?? payload.storeId ?? 1;
    const type: 'M2M' | 'H2M' = payload.type || (payload.usu_codigo ? 'H2M' : 'M2M');

    req.authContext = {
      userId,
      credentialsId,
      storeId,
      type,
      usuCodigo: payload.usu_codigo,
      funCodigo: payload.fun_codigo,
    };

    if (req.log) req.log = req.log.child({ userId });

    return user;
  }
}
