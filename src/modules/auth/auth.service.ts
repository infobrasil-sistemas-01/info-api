import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from 'src/config/env/env.service';
import * as argon2 from 'argon2';
import { AUTH_CONFIG } from 'src/config/auth.config';
import type { AuthConfig } from 'src/config/auth.config';

type RequestMeta = { requestId?: string; ip?: string; userAgent?: string };

type RefreshResult = {
  accessToken: string | null;
  newRefreshToken: string | null;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: RegistryPrismaService,
    private readonly jwt: JwtService,
    private readonly env: EnvService,
    @Inject(AUTH_CONFIG) private readonly authConfig: AuthConfig,
  ) {}

  async login(basic: string, meta: RequestMeta) {
    const [username, password] = Buffer.from(basic, 'base64')
      .toString()
      .split(':');
    const user = await this.prisma.user.findUnique({
      where: { user: username, status: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    this.assertUserActive(user);

    const passwordIsValid = await this.verifyPassword(
      user.passwordHash,
      password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const refreshToken = await this.issueRefreshToken(user.id.toString(), meta);

    const accessToken = await this.signAccessToken({
      userId: user.id.toString(),
      credentialsId: user.dbCredentialsId ?? undefined,
      storeId: user.storeId ?? undefined,
    });

    return {
      user: {
        id: user.id.toString(),
        username: user.user,
      },
      accessToken,
      refreshToken,
    };
  }

  private assertUserActive(user: { status: Boolean }) {
    if (user.status != true) {
      throw new UnauthorizedException('Usuário bloqueado.');
    }
  }

  private async verifyPassword(
    storedHash: string,
    password: string,
  ): Promise<boolean> {
    return argon2.verify(storedHash, password);
  }

  private async issueRefreshToken(userId: string, meta: RequestMeta) {
    return this.jwt.signAsync(
      {
        type: 'refresh',
        userId,
        requestId: meta.requestId,
        ip: meta.ip,
        userAgent: meta.userAgent,
      },
      {
        expiresIn: `${this.authConfig.refreshTokenDays}d`,
      },
    );
  }

  private async signAccessToken(params: {
    userId: string;
    credentialsId?: string;
    storeId?: number;
  }) {
    return this.jwt.signAsync(
      {
        sub: params.userId,
        credentials_id: params.credentialsId,
        store_id: params.storeId,
      },
      { expiresIn: this.authConfig.accessTokenTtl },
    );
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken);
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Token inválido.');
      }
      const userId = payload.userId;
      const user = await this.prisma.user.findUnique({
        where: { id: userId, status: true },
      });
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado.');
      }
      this.assertUserActive(user);
      const accessToken = await this.signAccessToken({
        userId: user.id.toString(),
        credentialsId: user.dbCredentialsId ?? undefined,
        storeId: user.storeId ?? undefined,
      });
      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido.');
    }
  }
}
