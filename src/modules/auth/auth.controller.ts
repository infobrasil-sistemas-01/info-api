import {
  Controller,
  HttpCode,
  Inject,
  Post,
  Req,
  Res,
  Headers,
  UnauthorizedException,
  Body,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AUTH_CONFIG } from 'src/config/auth.config';
import type { AuthConfig } from 'src/config/auth.config';
import type { Request, Response } from 'express';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JwtPayload } from './types/jwt-payload';
import { PermissionResolver } from 'src/infra/rbac/permission-resolver.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    @Inject(AUTH_CONFIG) private readonly authConfig: AuthConfig,
    private readonly permissionResolver: PermissionResolver,
  ) { }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  async me(@CurrentUser() user: JwtPayload) {
    const permissions = await this.permissionResolver.resolve(user.sub);
    return {
      id: user.sub,
      username: user.username,
      permissions: Array.from(permissions.allowedKeys),
      roles: permissions.roles,
    };
  }

  @Post('login')
  @HttpCode(200)
  @ApiBasicAuth()
  @ApiOperation({
    summary: 'Login do usuário',
    description:
      'Autentica o usuário usando credenciais básicas e retorna um token de acesso JWT.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Login realizado com sucesso, retorna usuário e token de acesso.',
  })
  async login(
    @Headers() headers: Record<string, string>,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authHeader = headers['authorization'] || headers['Authorization'];
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException(
        'Authorization header missing or invalid',
      );
    }
    const base64 = authHeader.slice(6);

    const meta = this.metaFromReq(req);
    const result = await this.auth.login(base64, meta);

    return result;
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Refresh do access token',
  })
  async refresh(@Body() body: RefreshDto) {
    const result = await this.auth.refresh(body.refresh_token);
    return {
      access_token: result.accessToken,
    };
  }

  private metaFromReq(req: Request) {
    const anyReq = req as any;

    const requestId =
      (anyReq.requestId as string | undefined) ??
      (anyReq.id as string | undefined) ??
      req.header('x-request-id') ??
      undefined;

    const ip = (req as any).ip ?? req.socket.remoteAddress ?? undefined;
    const userAgent = req.header('user-agent') ?? undefined;

    return { requestId, ip, userAgent };
  }
}
