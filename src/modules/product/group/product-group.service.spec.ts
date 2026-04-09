import { Test, TestingModule } from '@nestjs/testing';
import { ProductGroupService } from './product-group.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('ProductGroupService', () => {
  let service: ProductGroupService;
  let mockTenantConnection: any;

  const mockConnection = {
    query: jest.fn(),
  };

  beforeAll(async () => {
    mockTenantConnection = {
      getConnection: jest.fn().mockResolvedValue(mockConnection),
      detach: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductGroupService,
        { provide: TenantConnectionService, useValue: mockTenantConnection },
      ],
    }).compile();

    service = module.get<ProductGroupService>(ProductGroupService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return paginated product groups', async () => {
      const mockGroups = [
        { GRU_CODIGO: 1, GRU_DESCRICAO: 'Group 1' },
        { GRU_CODIGO: 2, GRU_DESCRICAO: 'Group 2' },
      ];
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, mockGroups);
        },
      );

      const result = await service.get('cred-1', 1, 10);

      expect(result).toEqual(mockGroups);
    });

    it('should calculate correct pagination offset', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await service.get('cred-1', 3, 10);

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.any(String),
        [10, 20],
        expect.any(Function),
      );
    });

    it('should throw error when connection query fails', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(new Error('DB error'), null);
        },
      );

      await expect(service.get('cred-1')).rejects.toThrow('DB error');
    });
  });

  describe('FAILING: product group edge cases', () => {
    it('should throw error when page number is negative', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await expect(service.get('cred-1', -1, 10)).rejects.toThrow();
    });

    it('should throw error when database connection times out', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(new Error('Connection timeout'), null);
        },
      );

      await expect(service.get('cred-1', 1, 10)).rejects.toThrow(
        'Connection timeout',
      );
    });
  });
});
