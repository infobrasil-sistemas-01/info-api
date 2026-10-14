import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CityService } from './city.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('CityService', () => {
  let service: CityService;
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
        CityService,
        { provide: TenantConnectionService, useValue: mockTenantConnection },
      ],
    }).compile();

    service = module.get<CityService>(CityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return paginated cities with default values', async () => {
      const mockCities = [
        { MUN_CODIGO: 2304400, MUN_NOME: 'FORTALEZA', EST_CODIGO: 23 },
      ];
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, mockCities);
        },
      );

      const result = await service.get('cred-1', 1, 100);

      expect(result).toEqual(mockCities);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT FIRST ? SKIP ?'),
        [100, 0],
        expect.any(Function),
      );
      expect(mockTenantConnection.releaseConnection).toHaveBeenCalledWith(
        mockConnection,
      );
    });

    it('should filter by stateId (EST_CODIGO)', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await service.get('cred-1', 1, 10, undefined, 23);

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('AND EST_CODIGO = ?'),
        [10, 0, 23],
        expect.any(Function),
      );
    });

    it('should filter by search when >= 3 characters', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await service.get('cred-1', 1, 10, 'FOR');

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('AND MUN_NOME LIKE ?'),
        [10, 0, '%FOR%'],
        expect.any(Function),
      );
    });

    it('should throw BadRequestException if search has less than 3 characters', async () => {
      await expect(service.get('cred-1', 1, 10, 'FO')).rejects.toThrow(
        BadRequestException,
      );
      expect(mockTenantConnection.releaseConnection).toHaveBeenCalledWith(
        mockConnection,
      );
    });

    it('should throw error and release connection when query fails', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(new Error('Database error'));
        },
      );

      await expect(service.get('cred-1', 1, 10)).rejects.toThrow('Database error');
      expect(mockTenantConnection.releaseConnection).toHaveBeenCalledWith(
        mockConnection,
      );
    });
  });
});
