import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VpnGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const clientIp = request.ip;

    const allowedVpnPrefix = this.configService.get<string>('ALLOWED_VPN_PREFIX');
    const localIps = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];

    const isLocal = localIps.includes(clientIp);
    const isVpn = clientIp.startsWith(allowedVpnPrefix);

    if (isLocal || isVpn) {
      return true;
    }

    throw new ForbiddenException(
      `Acesso restrito. Seu IP (${clientIp}) não tem permissão para acessar esta área administrativa.`,
    );
  }
}
