import { Test, TestingModule } from '@nestjs/testing';
import { TenantConnectionService } from './tenant-connection.service';
import { RegistryPrismaService } from '../prisma/registry-prisma.service';
import { FirebirdService } from '../firebird/firebird.service';

describe('TenantConnectionService', () => {
  let service: TenantConnectionService;
  let mockPrisma: any;
  let mockFirebirdService: any;

  const mockDbCredentials = {
    id: 'cred-1',
    host: 'localhost',
    port: 3050,
    database: 'test.fdb',
    user: 'sysdba',
    dbId: 98,
  };

  const mockConnection = { query: jest.fn(), detach: jest.fn() };

  beforeEach(async () => {
    mockPrisma = {
      dbCredentials: {
        findUnique: jest.fn().mockResolvedValue(mockDbCredentials),
      },
    };

    mockFirebirdService = {
      getDatabaseConnection: jest.fn().mockResolvedValue(mockConnection),
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
    it('should return cached connection if available', async () => {
      const connection1 = await service.getConnection('cred-1');
      const connection2 = await service.getConnection('cred-1');

      expect(connection1).toBe(connection2);
      expect(mockPrisma.dbCredentials.findUnique).toHaveBeenCalledTimes(1);
      expect(mockFirebirdService.getDatabaseConnection).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should fetch credentials from prisma when not cached', async () => {
      await service.getConnection('cred-1');

      expect(mockPrisma.dbCredentials.findUnique).toHaveBeenCalledWith({
        where: { id: 'cred-1' },
      });
    });

    it('should create connection with correct options from credentials', async () => {
      await service.getConnection('cred-1');

      expect(mockFirebirdService.getDatabaseConnection).toHaveBeenCalledWith({
        host: 'localhost',
        database: 'test.fdb',
        user: 'sysdba',
        id: 98,
        port: 3050,
        pageSize: 4096,
      });
    });

    it('should throw error when credentials not found', async () => {
      mockPrisma.dbCredentials.findUnique.mockResolvedValue(null);

      await expect(service.getConnection('invalid-id')).rejects.toThrow(
        'Credentials not found for id: invalid-id',
      );
    });
  });

  describe('FAILING: tenant connection edge cases', () => {
    it('should throw error when firebird connection fails', async () => {
      mockFirebirdService.getDatabaseConnection.mockRejectedValue(
        new Error('Firebird connection failed'),
      );

      await expect(service.getConnection('cred-1')).rejects.toThrow(
        'Firebird connection failed',
      );
    });

    it('should throw error when credentials have missing fields', async () => {
      mockPrisma.dbCredentials.findUnique.mockResolvedValue({
        id: 'cred-1',
        host: 'localhost',
      });

      await expect(service.getConnection('cred-1')).rejects.toThrow();
    });
  });
});
