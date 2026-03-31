import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from '../types/jwt-payload';

export type AuthContext = {
  userId: string;
  credentialsId?: string;
  storeId?: number;
};

export type ReqWithAuthContext = {
  authContext?: AuthContext;
  log: any;
  user: any;
};

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ): any {
    if (err || !user) {
      throw err || new UnauthorizedException(info?.message ?? 'Unathorized');
    }

    const payload = user as JwtPayload;

    const req = context.switchToHttp().getRequest<ReqWithAuthContext>();

    const userId = payload?.sub;
    if (typeof userId !== 'string' || !userId) {
      throw new UnauthorizedException('Invalid token (missing sub)');
    }

    req.authContext = { userId, credentialsId: payload.credentials_id };

    if (req.log) req.log = req.log.child({ userId });

    return user;
  }
}
