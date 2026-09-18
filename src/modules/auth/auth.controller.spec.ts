import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AUTH_CONFIG } from 'src/config/auth.config';
import { RefreshDto } from './dto/refresh.dto';
import { OperatorVerifyDto } from './dto/operator-verify.dto';
import { PermissionResolver } from 'src/infra/rbac/permission-resolver.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TenantAuthGuard } from './guards/tenant-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthService = {
    login: jest.fn(),
    refresh: jest.fn(),
    verifyOperator: jest.fn(),
    checkOperatorStatus: jest.fn(),
  };

  const mockPermissionResolver = {
    resolve: jest.fn(),
  };

  const mockAuthConfig = {
    accessTokenTtl: '15m',
    refreshTokenDays: 30,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: AUTH_CONFIG, useValue: mockAuthConfig },
        { provide: PermissionResolver, useValue: mockPermissionResolver },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(TenantAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const createMockRequest = (overrides = {}) =>
      ({
        requestId: 'req-123',
        ip: '127.0.0.1',
        header: jest.fn().mockReturnValue('test-agent'),
        ...overrides,
      }) as any;

    it('should call authService.login with base64 credentials from header and meta', async () => {
      const credentials = Buffer.from('user:pass').toString('base64');
      const headers = { authorization: `Basic ${credentials}` };
      const mockRequest = createMockRequest();

      mockAuthService.login.mockResolvedValue({
        user: { id: '1', username: 'user', role: 'admin', permissions: [] },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const result = await controller.login(headers, mockRequest, {
        passthrough: true,
      } as any);

      expect(authService.login).toHaveBeenCalledWith(
        credentials,
        expect.objectContaining({
          requestId: 'req-123',
          ip: '127.0.0.1',
          userAgent: 'test-agent',
        }),
      );
      expect(result).toEqual({
        user: { id: '1', username: 'user', role: 'admin', permissions: [] },
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      });
    });

    it('should throw UnauthorizedException when authorization header is missing', async () => {
      const headers = {};
      const mockRequest = createMockRequest();

      await expect(
        controller.login(headers, mockRequest, { passthrough: true } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when authorization header does not start with Basic', async () => {
      const headers = { authorization: 'Bearer token' };
      const mockRequest = createMockRequest();

      await expect(
        controller.login(headers, mockRequest, { passthrough: true } as any),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    it('should call authService.refresh with refresh_token from DTO', async () => {
      const dto = new RefreshDto();
      dto.refresh_token = 'refresh-token-value';

      mockAuthService.refresh.mockResolvedValue({
        accessToken: 'new-access-token',
        newRefreshToken: null,
      });

      const result = await controller.refresh(dto);

      expect(authService.refresh).toHaveBeenCalledWith('refresh-token-value');
      expect(result).toEqual({ access_token: 'new-access-token' });
    });
  });

  describe('operatorVerify', () => {
    it('should call authService.verifyOperator with credentialsId and body from req', async () => {
      const dto = new OperatorVerifyDto();
      dto.username = 'OPERADOR1';
      dto.password = 'pass123';

      const req = {
        authContext: {
          credentialsId: 'cred-123',
        },
      } as any;

      mockAuthService.verifyOperator.mockResolvedValue({
        valid: true,
        usuCodigo: 10,
        funCodigo: 25,
        storeId: 1,
      });

      const result = await controller.operatorVerify(req, dto);

      expect(authService.verifyOperator).toHaveBeenCalledWith('cred-123', dto);
      expect(result).toEqual({
        valid: true,
        usuCodigo: 10,
        funCodigo: 25,
        storeId: 1,
      });
    });

    it('should throw UnauthorizedException if credentialsId is missing in authContext', async () => {
      const dto = new OperatorVerifyDto();
      dto.username = 'OPERADOR1';
      dto.password = 'pass123';

      const req = {
        authContext: {},
      } as any;

      await expect(controller.operatorVerify(req, dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('operatorStatus', () => {
    it('should call authService.checkOperatorStatus with credentialsId and usuCodigo', async () => {
      const req = {
        authContext: {
          credentialsId: 'cred-123',
        },
      } as any;

      mockAuthService.checkOperatorStatus.mockResolvedValue({
        active: true,
        storeId: 2,
      });

      const result = await controller.operatorStatus(req, 10);

      expect(authService.checkOperatorStatus).toHaveBeenCalledWith(
        'cred-123',
        10,
      );
      expect(result).toEqual({ active: true, storeId: 2 });
    });

    it('should throw UnauthorizedException if credentialsId is missing in authContext', async () => {
      const req = {
        authContext: {},
      } as any;

      await expect(controller.operatorStatus(req, 10)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
