import { Test, TestingModule } from '@nestjs/testing';
import { TenantConnectionService } from './tenant-connection.service';
import { RegistryPrismaService } from '../prisma/registry-prisma.service';
import { FirebirdService } from '../firebird/firebird.service';

describe('TenantConnectionService', () => {
  let service: TenantConnectionService;
  let mockPrisma: any;
  let mockFirebirdService: any;
  let mockPool: any;
  let mockDb: any;

  const mockDbCredentials = {
    id: 'cred-1',
    host: 'localhost',
    port: 3050,
    database: 'test.fdb',
    user: 'sysdba',
    dbId: 98,
  };

  beforeEach(async () => {
    mockDb = { detach: jest.fn() };
    mockPool = {
      get: jest.fn().mockImplementation((callback) => callback(null, mockDb)),
      destroy: jest.fn().mockImplementation((callback) => callback()),
    };

    mockPrisma = {
      dbCredentials: {
        findUnique: jest.fn().mockResolvedValue(mockDbCredentials),
      },
    };

    mockFirebirdService = {
      createPool: jest.fn().mockReturnValue(mockPool),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantConnectionService,
        { provide: RegistryPrismaService, useValue: mockPrisma },
        { provide: FirebirdService, useValue: mockFirebirdService },
      ],
    }).compile();

    service = module.get<TenantConnectionService>(TenantConnectionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getConnection', () => {
    it('should fetch credentials from prisma on first call', async () => {
      await service.getConnection('cred-1');

      expect(mockPrisma.dbCredentials.findUnique).toHaveBeenCalledWith({
        where: { id: 'cred-1' },
      });
      expect(mockFirebirdService.createPool).toHaveBeenCalled();
    });

    it('should NOT fetch credentials from prisma on second call (credentialsCache)', async () => {
      await service.getConnection('cred-1');
      await service.getConnection('cred-1');

      expect(mockPrisma.dbCredentials.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should return a connection from the pool', async () => {
      const conn = await service.getConnection('cred-1');
      expect(conn).toBe(mockDb);
      expect(mockPool.get).toHaveBeenCalled();
    });

    it('should throw error when credentials not found', async () => {
      mockPrisma.dbCredentials.findUnique.mockResolvedValue(null);

      await expect(service.getConnection('invalid-id')).rejects.toThrow(
        'Credentials not found for id: invalid-id',
      );
    });
  });

  describe('releaseConnection', () => {
    it('should call detach on the connection', () => {
      service.releaseConnection(mockDb);
      expect(mockDb.detach).toHaveBeenCalled();
    });
  });

  describe('destroyPool', () => {
    it('should destroy the pool and remove from poolCache', async () => {
      await service.getConnection('cred-1');
      await service.destroyPool('cred-1');

      expect(mockPool.destroy).toHaveBeenCalled();

      // Next getConnection should create a new pool but NOT call Prisma
      await service.getConnection('cred-1');
      expect(mockFirebirdService.createPool).toHaveBeenCalledTimes(2);
      expect(mockPrisma.dbCredentials.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('invalidateCredentials', () => {
    it('should destroy pool and clear credentials cache', async () => {
      await service.getConnection('cred-1');
      await service.invalidateCredentials('cred-1');

      expect(mockPool.destroy).toHaveBeenCalled();

      // Next getConnection should call Prisma again
      await service.getConnection('cred-1');
      expect(mockPrisma.dbCredentials.findUnique).toHaveBeenCalledTimes(2);
    });
  });
});
