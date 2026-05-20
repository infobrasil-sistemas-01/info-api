import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('SupplierService', () => {
  let service: SupplierService;
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
        SupplierService,
        { provide: TenantConnectionService, useValue: mockTenantConnection },
      ],
    }).compile();

    service = module.get<SupplierService>(SupplierService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return paginated suppliers', async () => {
      const mockSuppliers = [{ CRE_CODIGO: 1, CRE_NOME: 'Supplier 1' }];
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, mockSuppliers);
        },
      );

      const result = await service.get('cred-1', 1, 1, 10);

      expect(result).toEqual(mockSuppliers);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT FIRST ? SKIP ?'),
        expect.arrayContaining([10, 0, 1]),
        expect.any(Function),
      );
    });

    it('should apply search filter when provided with 3+ characters', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await service.get('cred-1', 1, 1, 10, 'abc');

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('CRE_NOME LIKE ? OR CRE_FANTASIA LIKE ?'),
        expect.arrayContaining([10, 0, 1, '%abc%', '%abc%']),
        expect.any(Function),
      );
    });

    it('should throw BadRequestException when search has less than 3 characters', async () => {
      await expect(service.get('cred-1', 1, 1, 10, 'ab')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getById', () => {
    it('should return supplier by id', async () => {
      const mockSupplier = { CRE_CODIGO: 1, CRE_NOME: 'Supplier Test' };
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, [mockSupplier]);
        },
      );

      const result = await service.getById('cred-1', 1);

      expect(result).toEqual(mockSupplier);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE CRE_CODIGO = ?'),
        [1],
        expect.any(Function),
      );
    });
  });
});
