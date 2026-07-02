import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('StoreService', () => {
  let service: StoreService;
  let mockTenantConnection: any;

  const mockConnection = {
    query: jest.fn(),
  };

  beforeAll(async () => {
    mockTenantConnection = {
      getConnection: jest.fn().mockResolvedValue(mockConnection),
      releaseConnection: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        { provide: TenantConnectionService, useValue: mockTenantConnection },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return paginated stores without filters', async () => {
      const mockStores = [
        {
          LOJ_CODIGO: 1,
          LOJ_NOME: 'LOJA 1',
          LOJ_FANTASIA: 'L1',
          LOJ_CNPJ: '123',
        },
        {
          LOJ_CODIGO: 2,
          LOJ_NOME: 'LOJA 2',
          LOJ_FANTASIA: 'L2',
          LOJ_CNPJ: '456',
        },
      ];
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, mockStores);
        },
      );

      const result = await service.get('cred-1', 1, 10);

      expect(result).toEqual(mockStores);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('FROM lojas'),
        [10, 0],
        expect.any(Function),
      );
    });

    it('should filter by storeId', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await service.get('cred-1', 1, 10, 5);

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('loj.loj_codigo = ?'),
        [10, 0, 5],
        expect.any(Function),
      );
    });

    it('should filter by storeCnpj', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await service.get('cred-1', 1, 10, undefined, '12345678000100');

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('loj.loj_cnpj = ?'),
        [10, 0, '12345678000100'],
        expect.any(Function),
      );
    });

    it('should filter by both storeId and storeCnpj', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await service.get('cred-1', 1, 10, 5, '12345678000100');

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('loj.loj_codigo = ? AND loj.loj_cnpj = ?'),
        [10, 0, 5, '12345678000100'],
        expect.any(Function),
      );
    });

    it('should throw error when page is less than 1', async () => {
      await expect(service.get('cred-1', 0, 10)).rejects.toThrow(
        'Page must be greater than or equal to 1',
      );
    });

    it('should throw error when pageSize is less than 1', async () => {
      await expect(service.get('cred-1', 1, 0)).rejects.toThrow(
        'Page size must be greater than or equal to 1',
      );
    });

    it('should throw error when DB query fails', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(new Error('DB error'), null);
        },
      );

      await expect(service.get('cred-1')).rejects.toThrow('DB error');
    });

    it('should release the database connection', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await service.get('cred-1');

      expect(mockTenantConnection.releaseConnection).toHaveBeenCalledWith(
        mockConnection,
      );
    });
  });
});
