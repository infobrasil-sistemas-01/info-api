import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from 'src/config/env/env.service';
import { AUTH_CONFIG } from 'src/config/auth.config';
import * as argon2 from 'argon2';
import { PermissionResolver } from 'src/infra/rbac/permission-resolver.service';

jest.mock('argon2');

describe('AuthService', () => {
  let service: AuthService;
  let mockPrisma: any;
  let mockJwt: any;
  let mockEnv: any;
  let mockAuthConfig: any;
  let mockPermissionResolver: any;

  const mockUser = {
    id: '1',
    user: 'testuser',
    passwordHash: 'hashedPassword',
    status: true,
    dbCredentialsId: 'cred-1',
    storeId: 1,
    role: { name: 'admin' }
  };

  beforeAll(async () => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
      },
    };

    mockJwt = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    };

    mockEnv = {
      get: jest.fn(),
    };

    mockAuthConfig = {
      accessTokenTtl: '15m',
      refreshTokenDays: 30,
    };

    mockPermissionResolver = {
      resolve: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: RegistryPrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: EnvService, useValue: mockEnv },
        { provide: AUTH_CONFIG, useValue: mockAuthConfig },
        { provide: PermissionResolver, useValue: mockPermissionResolver },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const credentials = Buffer.from('testuser:password123').toString(
        'base64',
      );
      const meta = { requestId: 'req-1', ip: '127.0.0.1', userAgent: 'test' };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      mockJwt.signAsync
        .mockResolvedValueOnce('refresh-token')
        .mockResolvedValueOnce('access-token');

      mockPermissionResolver.resolve.mockResolvedValue({
        userId: '1',
        roles: ['admin'],
        allowedKeys: new Set(['perm1']),
      });

      const result = await service.login(credentials, meta);

      expect(result).toEqual({
        user: {
          id: '1',
          role: 'admin',
          username: 'testuser',
          permissions: ['perm1'],
        },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { user: 'testuser', status: true },
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
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const credentials = Buffer.from('testuser:password123').toString(
        'base64',
      );
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login(credentials, {})).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const credentials = Buffer.from('testuser:password123').toString(
        'base64',
      );
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(service.login(credentials, {})).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when user is blocked', async () => {
      const credentials = Buffer.from('testuser:password123').toString(
        'base64',
      );
      const blockedUser = { ...mockUser, status: false };
      mockPrisma.user.findUnique.mockResolvedValue(blockedUser);

      await expect(service.login(credentials, {})).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refresh', () => {
    it('should return new access token for valid refresh token', async () => {
      const refreshToken = 'valid-refresh-token';
      mockJwt.verifyAsync.mockResolvedValue({ type: 'refresh', userId: '1' });
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockJwt.signAsync.mockResolvedValue('new-access-token');

      const result = await service.refresh(refreshToken);

      expect(result).toEqual({ accessToken: 'new-access-token' });
    });

    it('should throw UnauthorizedException for invalid token type', async () => {
      const refreshToken = 'invalid-type-token';
      mockJwt.verifyAsync.mockResolvedValue({ type: 'access', userId: '1' });

      await expect(service.refresh(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when user not found during refresh', async () => {
      const refreshToken = 'valid-refresh-token';
      mockJwt.verifyAsync.mockResolvedValue({ type: 'refresh', userId: '1' });
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.refresh(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      const refreshToken = 'invalid-token';
      mockJwt.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(service.refresh(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('FAILING: login with expired refresh token scenario', () => {
    it('should throw UnauthorizedException when refresh token is expired', async () => {
      const credentials = Buffer.from('testuser:password123').toString(
        'base64',
      );
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      mockJwt.signAsync.mockRejectedValue(new Error('Token expired'));

      await expect(service.login(credentials, {})).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when credentials format is invalid', async () => {
      const credentials = Buffer.from('invalidformat').toString('base64');

      await expect(service.login(credentials, {})).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
