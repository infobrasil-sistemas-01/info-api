import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { ReqWithAuthContext } from './jwt-auth.guard';
import { AuthService } from '../auth.service';

@Injectable()
export class TenantAuthGuard implements CanActivate {
  constructor(
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<ReqWithAuthContext>();
    const authHeader =
      req.headers?.authorization || (req.headers as any)?.Authorization;

    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException('Cabeçalho de autorização ausente.');
    }

    if (authHeader.startsWith('Basic ')) {
      const base64 = authHeader.slice(6).trim();
      const m2mUser = await this.authService.validateBasic(base64);

      req.authContext = {
        userId: m2mUser.id.toString(),
        credentialsId: m2mUser.dbCredentialsId!,
        storeId: m2mUser.storeId ?? 1,
        type: 'M2M',
      };

      return true;
    }

    if (authHeader.startsWith('Bearer ')) {
      return (await this.jwtAuthGuard.canActivate(context)) as boolean;
    }

    throw new UnauthorizedException('Tipo de autorização não suportado.');
  }
}
