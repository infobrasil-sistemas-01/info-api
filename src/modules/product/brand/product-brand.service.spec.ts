import { Test, TestingModule } from '@nestjs/testing';
import { ProductBrandService } from './product-brand.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductBrandService', () => {
  let service: ProductBrandService;
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

  describe('create', () => {
    it('should insert a new product brand', async () => {
      const mockCreatedBrand = { MAR_CODIGO: 3, MAR_DESCRICAO: 'New Brand' };
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, mockCreatedBrand);
        },
      );

      const payload: CreateBrandDto = { MAR_DESCRICAO: 'New Brand' };
      const result = await service.create('cred-1', payload);

      expect(result).toEqual(mockCreatedBrand);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO marcas'),
        ['New Brand'],
        expect.any(Function),
      );
    });

    it('should throw error when database insertion fails', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(new Error('Insert error'), null);
        },
      );

      const payload: CreateBrandDto = { MAR_DESCRICAO: 'New Brand' };
      await expect(service.create('cred-1', payload)).rejects.toThrow(
        'Insert error',
      );
    });
  });

  describe('getById', () => {
    it('should return a product brand by id', async () => {
      const mockBrand = { MAR_CODIGO: 1, MAR_DESCRICAO: 'Brand 1' };
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, [mockBrand]);
        },
      );

      const result = await service.getById('cred-1', 1);

      expect(result).toEqual(mockBrand);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [1],
        expect.any(Function),
      );
    });

    it('should return undefined if brand does not exist', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      const result = await service.getById('cred-1', 999);

      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update and return the updated brand', async () => {
      const mockBrand = { MAR_CODIGO: 1, MAR_DESCRICAO: 'Original Brand' };
      const mockUpdatedBrand = {
        MAR_CODIGO: 1,
        MAR_DESCRICAO: 'Updated Brand',
      };

      mockConnection.query
        .mockImplementationOnce(
          (query: string, params: any[], callback: Function) => {
            callback(null, [mockBrand]);
          },
        )
        .mockImplementationOnce(
          (query: string, params: any[], callback: Function) => {
            callback(null, true);
          },
        )
        .mockImplementationOnce(
          (query: string, params: any[], callback: Function) => {
            callback(null, [mockUpdatedBrand]);
          },
        );

      const payload: UpdateBrandDto = { MAR_DESCRICAO: 'Updated Brand' };
      const result = await service.update('cred-1', 1, payload);

      expect(result).toEqual(mockUpdatedBrand);
      expect(mockConnection.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('UPDATE marcas'),
        ['Updated Brand', 1],
        expect.any(Function),
      );
    });

    it('should return the original brand if no MAR_DESCRICAO is provided', async () => {
      const mockBrand = { MAR_CODIGO: 1, MAR_DESCRICAO: 'Original Brand' };
      mockConnection.query.mockImplementationOnce(
        (query: string, params: any[], callback: Function) => {
          callback(null, [mockBrand]);
        },
      );

      const payload: UpdateBrandDto = {};
      const result = await service.update('cred-1', 1, payload);

      expect(result).toEqual(mockBrand);
      expect(mockConnection.query).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if brand does not exist', async () => {
      mockConnection.query.mockImplementationOnce(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      const payload: UpdateBrandDto = { MAR_DESCRICAO: 'Updated Brand' };
      await expect(service.update('cred-1', 999, payload)).rejects.toThrow(
        NotFoundException,
      );
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
  });
});
