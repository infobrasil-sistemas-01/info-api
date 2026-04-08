import { Test, TestingModule } from '@nestjs/testing';
import { ProductBrandService } from './product-brand.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('ProductBrandService', () => {
  let service: ProductBrandService;
  let mockTenantConnection: any;

  const mockConnection = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    mockTenantConnection = {
      getConnection: jest.fn().mockResolvedValue(mockConnection),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductBrandService,
        { provide: TenantConnectionService, useValue: mockTenantConnection },
      ],
    }).compile();

    service = module.get<ProductBrandService>(ProductBrandService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return paginated product brands', async () => {
      const mockBrands = [
        { MAR_CODIGO: 1, MAR_DESCRICAO: 'Brand 1' },
        { MAR_CODIGO: 2, MAR_DESCRICAO: 'Brand 2' },
      ];
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, mockBrands);
        },
      );

      const result = await service.get('cred-1', 1, 10);

      expect(result).toEqual(mockBrands);
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

  describe('FAILING: product brand edge cases', () => {
    it('should throw error when page size is zero', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await expect(service.get('cred-1', 1, 0)).rejects.toThrow();
    });

    it('should throw error when database returns null', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, null);
        },
      );

      await expect(service.get('cred-1', 1, 10)).rejects.toThrow();
    });
  });
});
