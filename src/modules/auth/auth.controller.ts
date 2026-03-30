import {
  Controller,
  HttpCode,
  Inject,
  Post,
  Req,
  Res,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AUTH_CONFIG } from 'src/config/auth.config';
import type { AuthConfig } from 'src/config/auth.config';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    @Inject(AUTH_CONFIG) private readonly authConfig: AuthConfig,
  ) {}

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
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas ou header de autorização ausente.',
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
    const base64 = authHeader.slice(6); // Remove 'Basic '

    const meta = this.metaFromReq(req);
    const result = await this.auth.login(base64, meta);

    return {
      user: result.user,
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
