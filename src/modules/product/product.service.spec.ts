import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ProductService } from './product.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('ProductService', () => {
  let service: ProductService;
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
        ProductService,
        { provide: TenantConnectionService, useValue: mockTenantConnection },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return paginated products', async () => {
      const mockProducts = [
        { PRO_CODIGO: 1, PRO_DESCRICAO: 'Product 1' },
        { PRO_CODIGO: 2, PRO_DESCRICAO: 'Product 2' },
      ];
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, mockProducts);
        },
      );

      const result = await service.get('cred-1', 1, 1, 10);

      expect(result).toEqual(mockProducts);
    });

    it('should apply group filter when provided', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await service.get('cred-1', 1, 1, 10, 5);

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('P.GRU_CODIGO = ?'),
        expect.arrayContaining([10, 0, 1, 5]),
        expect.any(Function),
      );
    });

    it('should throw BadRequestException when search has less than 3 characters', async () => {
      await expect(
        service.get('cred-1', 1, 1, 10, undefined, undefined, undefined, 'ab'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should apply search filter when provided with 3+ characters', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await service.get(
        'cred-1',
        1,
        1,
        10,
        undefined,
        undefined,
        undefined,
        'abc',
      );

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('P.PRO_DESCRICAO LIKE ?'),
        expect.arrayContaining([10, 0, 1, '%abc%']),
        expect.any(Function),
      );
    });

    it('should throw error when connection query fails', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(new Error('DB error'), null);
        },
      );

      await expect(service.get('cred-1', 1, 1, 10)).rejects.toThrow('DB error');
    });
  });

  describe('getById', () => {
    it('should return product by id', async () => {
      const mockProduct = { PRO_CODIGO: 1, PRO_DESCRICAO: 'Test Product' };
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, [mockProduct]);
        },
      );

      const result = await service.getById('cred-1', 1, 1);

      expect(result).toEqual(mockProduct);
    });
  });

  describe('getUnique', () => {
    it('should return product by id', async () => {
      const mockProduct = { PRO_CODIGO: 1, PRO_DESCRICAO: 'Test Product' };
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, [mockProduct]);
        },
      );

      const result = await service.getUnique('cred-1', 1, 1);

      expect(result).toEqual(mockProduct);
    });

    it('should return product by codigoBar when provided', async () => {
      const mockProduct = { PRO_CODIGO: 1, PRO_CODIGOBAR: 123456 };
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, [mockProduct]);
        },
      );

      const result = await service.getUnique('cred-1', 1, undefined, 123456);

      expect(result).toEqual(mockProduct);
    });
  });

  describe('FAILING: product search edge cases', () => {
    it('should throw BadRequestException when page number is less than 1', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await expect(service.get('cred-1', 1, 0, 10)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error when connection is lost during query', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(new Error('Connection lost'), null);
        },
      );

      await expect(service.get('cred-1', 1, 1, 10)).rejects.toThrow(
        'Connection lost',
      );
    });
  });
});
