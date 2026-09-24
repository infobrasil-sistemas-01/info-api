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
import * as bcrypt from 'bcrypt';
import { AUTH_CONFIG } from 'src/config/auth.config';
import type { AuthConfig } from 'src/config/auth.config';
import * as Sentry from '@sentry/node';
import { PermissionResolver } from 'src/infra/rbac/permission-resolver.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { OperatorVerifyResponseDto } from './dto/operator-verify-response.dto';

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
    private readonly permissionResolver: PermissionResolver,
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async login(basic: string, meta: RequestMeta) {
    const [username, password] = Buffer.from(basic, 'base64')
      .toString()
      .split(':');
    const user = await this.prisma.user.findUnique({
      where: { user: username, status: true },
      select: {
        id: true,
        user: true,
        passwordHash: true,
        status: true,
        dbCredentialsId: true,
        storeId: true,
        role: true,
      },
    });

    if (!user) {
      this.logger.warn(
        `Tentativa de login falhou: usuário "${username}" não encontrado. IP: ${meta.ip}`,
      );
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    this.assertUserActive(user);

    const passwordIsValid = await this.verifyPassword(
      user.passwordHash,
      password,
    );

    if (!passwordIsValid) {
      this.logger.warn(
        `Tentativa de login falhou: senha incorreta para o usuário "${username}". IP: ${meta.ip}`,
      );
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    let refreshToken: string;
    let accessToken: string;

    try {
      refreshToken = await this.issueRefreshToken(user.id.toString(), meta);
      accessToken = await this.signAccessToken({
        userId: user.id.toString(),
        username: user.user,
        credentialsId: user.dbCredentialsId ?? undefined,
        storeId: user.storeId ?? undefined,
      });
    } catch {
      throw new UnauthorizedException('Falha ao gerar token.');
    }

    this.logger.log(
      `Usuário logado com sucesso: "${user.user}" (ID: ${user.id}). IP: ${meta.ip}`,
    );

    const permissions = await this.permissionResolver.resolve(
      user.id.toString(),
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id.toString(),
        username: user.user,
        role: user.role?.name || null,
        permissions: Array.from(permissions.allowedKeys),
      },
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
    username: string;
    credentialsId?: string;
    storeId?: number;
  }) {
    return this.jwt.signAsync(
      {
        sub: params.userId,
        username: params.username,
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
        username: user.user,
        credentialsId: user.dbCredentialsId ?? undefined,
        storeId: user.storeId ?? undefined,
      });
      this.logger.log(`Token de acesso renovado para o usuário ID: ${user.id}`);
      return { accessToken };
    } catch (error) {
      this.logger.warn(`Falha na renovação de token. Erro: ${error.message}`);
      throw new UnauthorizedException('Refresh token inválido.');
    }
  }

  async validateBasic(basic: string) {
    const [username, password] = Buffer.from(basic, 'base64')
      .toString()
      .split(':');
    const user = await this.prisma.user.findUnique({
      where: { user: username, status: true },
      select: {
        id: true,
        user: true,
        passwordHash: true,
        status: true,
        dbCredentialsId: true,
        storeId: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais M2M inválidas.');
    }

    this.assertUserActive(user);

    const passwordIsValid = await this.verifyPassword(
      user.passwordHash,
      password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credenciais M2M inválidas.');
    }

    if (!user.dbCredentialsId) {
      throw new UnauthorizedException('Tenant não possui banco configurado.');
    }

    return user;
  }

  async verifyOperator(
    credentialsId: string,
    dto: { username: string; password: string },
  ): Promise<OperatorVerifyResponseDto> {
    if (!credentialsId) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `
        SELECT 
          U.USU_CODIGO,
          U.USU_APELIDO,
          U.USU_SENHA_API,
          U.USU_SITUACAO,
          U.LOJ_CODIGO,
          U.FUN_CODIGO,
          F.FUN_DATADEMISSAO
        FROM USUARIOS U
        LEFT JOIN FUNCIONARIOS F ON F.FUN_CODIGO = U.FUN_CODIGO
        WHERE UPPER(U.USU_APELIDO) = UPPER(?)
      `;

      const rows: any = await new Promise((resolve, reject) => {
        connection.query(query, [dto.username], (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });

      const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

      if (!user) {
        this.logger.warn(
          `Tentativa de login de operador falhou: usuário "${dto.username}" não encontrado no Firebird. Tenant: ${credentialsId}`,
        );
        throw new UnauthorizedException('Credenciais inválidas.');
      }

      const situacao = (user.USU_SITUACAO || 'A')
        .toString()
        .trim()
        .toUpperCase();
      if (situacao !== 'A') {
        this.logger.warn(
          `Tentativa de login de operador falhou: usuário "${dto.username}" com situação "${situacao}". Tenant: ${credentialsId}`,
        );
        throw new UnauthorizedException('Credenciais inválidas.');
      }

      if (user.FUN_DATADEMISSAO) {
        this.logger.warn(
          `Tentativa de login de operador falhou: funcionário vinculado ao usuário "${dto.username}" está demitido. Tenant: ${credentialsId}`,
        );
        throw new UnauthorizedException('Credenciais inválidas.');
      }

      const storedHash = user.USU_SENHA_API
        ? user.USU_SENHA_API.toString().trim()
        : null;

      if (!storedHash) {
        this.logger.warn(
          `Tentativa de login de operador falhou: usuário "${dto.username}" não possui senha de API cadastrada (USU_SENHA_API IS NULL). Tenant: ${credentialsId}`,
        );
        throw new UnauthorizedException('Credenciais inválidas.');
      }

      const passwordMatches = await bcrypt.compare(dto.password, storedHash);
      if (!passwordMatches) {
        this.logger.warn(
          `Tentativa de login de operador falhou: senha incorreta para o usuário "${dto.username}". Tenant: ${credentialsId}`,
        );
        throw new UnauthorizedException('Credenciais inválidas.');
      }

      this.logger.log(
        `Operador autenticado com sucesso: "${user.USU_APELIDO}" (USU_CODIGO: ${user.USU_CODIGO}, LOJ_CODIGO: ${user.LOJ_CODIGO}). Tenant: ${credentialsId}`,
      );

      return {
        valid: true,
        usuCodigo: Number(user.USU_CODIGO),
        funCodigo: user.FUN_CODIGO ? Number(user.FUN_CODIGO) : null,
        storeId: Number(user.LOJ_CODIGO || 1),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(
        `Erro ao verificar operador no Firebird. Tenant: ${credentialsId}, Usuário: ${dto.username}`,
        error,
      );
      throw new UnauthorizedException('Credenciais inválidas.');
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async checkOperatorStatus(credentialsId: string, usuCodigo: number) {
    if (!credentialsId) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `
        SELECT 
          U.USU_CODIGO,
          U.USU_SITUACAO,
          U.LOJ_CODIGO,
          F.FUN_DATADEMISSAO
        FROM USUARIOS U
        LEFT JOIN FUNCIONARIOS F ON F.FUN_CODIGO = U.FUN_CODIGO
        WHERE U.USU_CODIGO = ?
      `;

      const rows: any = await new Promise((resolve, reject) => {
        connection.query(query, [usuCodigo], (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });

      const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

      if (!user) {
        return { active: false };
      }

      const situacao = (user.USU_SITUACAO || 'A')
        .toString()
        .trim()
        .toUpperCase();
      if (situacao !== 'A' || user.FUN_DATADEMISSAO) {
        return { active: false };
      }

      return {
        active: true,
        storeId: Number(user.LOJ_CODIGO || 1),
      };
    } catch (error) {
      this.logger.error(
        `Erro ao checar status do operador no Firebird. Tenant: ${credentialsId}, usuCodigo: ${usuCodigo}`,
        error,
      );
      return { active: false };
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
