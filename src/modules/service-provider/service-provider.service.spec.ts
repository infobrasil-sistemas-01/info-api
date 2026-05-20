import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ServiceProviderService } from './service-provider.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('ServiceProviderService', () => {
  let service: ServiceProviderService;
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
        ServiceProviderService,
        { provide: TenantConnectionService, useValue: mockTenantConnection },
      ],
    }).compile();

    service = module.get<ServiceProviderService>(ServiceProviderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return paginated service providers', async () => {
      const mockProviders = [
        { PRE_CODIGO: 1, PRE_NOME: 'Provider 1' },
        { PRE_CODIGO: 2, PRE_NOME: 'Provider 2' },
      ];
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, mockProviders);
        },
      );

      const result = await service.get('cred-1', 1, 1, 10);

      expect(result).toEqual(mockProviders);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT FIRST ? SKIP ?'),
        expect.arrayContaining([10, 0, 1]),
        expect.any(Function),
      );
    });

    it('should apply situation filter when provided', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await service.get('cred-1', 1, 1, 10, undefined, 'A');

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('PRE_SITUACAO = ?'),
        expect.arrayContaining([10, 0, 1, 'A']),
        expect.any(Function),
      );
    });

    it('should throw BadRequestException when search has less than 3 characters', async () => {
      await expect(service.get('cred-1', 1, 1, 10, 'ab')).rejects.toThrow(
        BadRequestException,
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
        expect.stringContaining('PRE_NOME LIKE ? OR PRE_APELIDO LIKE ?'),
        expect.arrayContaining([10, 0, 1, '%abc%', '%abc%']),
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
    it('should return service provider by id', async () => {
      const mockProvider = { PRE_CODIGO: 1, PRE_NOME: 'Provider Test' };
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, [mockProvider]);
        },
      );

      const result = await service.getById('cred-1', 1);

      expect(result).toEqual(mockProvider);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE PRE_CODIGO = ?'),
        [1],
        expect.any(Function),
      );
    });
  });
});
