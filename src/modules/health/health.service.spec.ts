import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('HealthService', () => {
  let service: HealthService;
  let mockPrisma: any;
  let mockTenantConnections: any;

  beforeEach(async () => {
    mockPrisma = {
      $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
    };
    mockTenantConnections = {
      getPoolStats: jest.fn().mockReturnValue({
        activePools: 1,
        cachedCredentials: 1,
        tenantIds: ['cred-1'],
      }),
      pingActivePools: jest.fn().mockResolvedValue([
        {
          credentialsId: 'cred-1',
          status: 'up',
          responseTimeMs: 5,
        },
      ]),
      ping: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: RegistryPrismaService, useValue: mockPrisma },
        { provide: TenantConnectionService, useValue: mockTenantConnections },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkLiveness', () => {
    it('should return ok when postgres is up without querying firebird', async () => {
      const result = await service.checkLiveness();

      expect(result.status).toBe('ok');
      expect(result.database.status).toBe('up');
      expect(mockTenantConnections.pingActivePools).not.toHaveBeenCalled();
    });

    it('should return degraded when postgres fails', async () => {
      mockPrisma.$queryRaw.mockRejectedValue(new Error('PG Connection error'));

      const result = await service.checkLiveness();

      expect(result.status).toBe('degraded');
      expect(result.database.status).toBe('down');
      expect(result.database.error).toBe('PG Connection error');
    });
  });

  describe('check', () => {
    it('should return full health status with postgres and firebird', async () => {
      const result = await service.check(true);

      expect(result.status).toBe('ok');
      expect(result.databases.postgres.status).toBe('up');
      expect(result.databases.firebird.tenants).toHaveLength(1);
      expect(mockTenantConnections.pingActivePools).toHaveBeenCalled();
    });
  });
});
