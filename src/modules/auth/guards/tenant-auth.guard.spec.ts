import { UnauthorizedException } from '@nestjs/common';
import { TenantAuthGuard } from './tenant-auth.guard';

describe('TenantAuthGuard', () => {
  let guard: TenantAuthGuard;
  let mockJwtAuthGuard: any;
  let mockAuthService: any;

  beforeEach(() => {
    mockJwtAuthGuard = {
      canActivate: jest.fn(),
    };
    mockAuthService = {
      validateBasic: jest.fn(),
    };
    guard = new TenantAuthGuard(mockJwtAuthGuard, mockAuthService);
  });

  const createMockContext = (authHeader?: string): any => {
    const req: any = {
      headers: authHeader ? { authorization: authHeader } : {},
    };
    return {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
      _req: req,
    };
  };

  it('should authenticate with Basic Auth and set req.authContext', async () => {
    const ctx = createMockContext('Basic dXNlcjpwYXNz');
    mockAuthService.validateBasic.mockResolvedValue({
      id: 1,
      dbCredentialsId: 'cred-123',
      storeId: 2,
    });

    const result = await guard.canActivate(ctx);

    expect(result).toBe(true);
    expect(mockAuthService.validateBasic).toHaveBeenCalledWith('dXNlcjpwYXNz');
    expect(ctx._req.authContext).toEqual({
      userId: '1',
      credentialsId: 'cred-123',
      storeId: 2,
      type: 'M2M',
    });
  });

  it('should delegate to JwtAuthGuard when header starts with Bearer', async () => {
    const ctx = createMockContext('Bearer token123');
    mockJwtAuthGuard.canActivate.mockResolvedValue(true);

    const result = await guard.canActivate(ctx);

    expect(result).toBe(true);
    expect(mockJwtAuthGuard.canActivate).toHaveBeenCalledWith(ctx);
  });

  it('should throw UnauthorizedException when authorization header is missing', async () => {
    const ctx = createMockContext();

    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when scheme is unknown', async () => {
    const ctx = createMockContext('Digest something');

    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });
});
