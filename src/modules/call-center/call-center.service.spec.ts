import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CallCenterService } from './call-center.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('CallCenterService', () => {
  let service: CallCenterService;
  let tenantConnectionService: jest.Mocked<TenantConnectionService>;
  let mockConnection: any;

  beforeEach(async () => {
    mockConnection = {
      query: jest.fn(),
    };

    const mockTenantConnectionService = {
      getConnection: jest.fn().mockResolvedValue(mockConnection),
      releaseConnection: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CallCenterService,
        {
          provide: TenantConnectionService,
          useValue: mockTenantConnectionService,
        },
      ],
    }).compile();

    service = module.get<CallCenterService>(CallCenterService);
    tenantConnectionService = module.get(TenantConnectionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return call center records with mapped blob strings and descriptions', async () => {
      const mockResult = [
        {
          CAL_NUMERO: 1,
          CLI_CODIGO: 10,
          USU_CODIGO: 5,
          CAL_DATA: '2026-08-10',
          CAL_HORA: '10:00:00',
          CAL_STATUS: 'P',
          CAL_DEPOIMENTO: 'Depoimento em texto',
          CAL_RELATORIO: null,
          CAL_OUTRASINFO: null,
          APL_DESCRICAO: 'Aplicação Teste',
          TOP_DESCRICAO: 'Tópico Teste',
          FAT_DESCRICAO: 'Forma Teste',
        },
      ];

      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: any) => {
          callback(null, mockResult);
        },
      );

      const result = await service.get('credentials-id-123', {
        page: 1,
        pageSize: 10,
      });

      expect(tenantConnectionService.getConnection).toHaveBeenCalledWith(
        'credentials-id-123',
      );
      expect(mockConnection.query).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].CAL_NUMERO).toEqual(1);
      expect(result[0].APL_DESCRICAO).toEqual('Aplicação Teste');
      expect(tenantConnectionService.releaseConnection).toHaveBeenCalledWith(
        mockConnection,
      );
    });

    it('should throw BadRequestException if only startDate is provided without endDate', async () => {
      await expect(
        service.get('credentials-id-123', { startDate: '2026-01-01' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getById', () => {
    it('should return a single call center record when found', async () => {
      const mockRecord = [
        {
          CAL_NUMERO: 123,
          CLI_CODIGO: 10,
          USU_CODIGO: 5,
          CAL_DATA: '2026-08-10',
          CAL_HORA: '10:00:00',
          CAL_STATUS: 'P',
          CAL_DEPOIMENTO: null,
          CAL_RELATORIO: null,
          CAL_OUTRASINFO: null,
          APL_DESCRICAO: 'Aplicação Teste',
          TOP_DESCRICAO: 'Tópico Teste',
          FAT_DESCRICAO: 'Forma Teste',
        },
      ];

      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: any) => {
          callback(null, mockRecord);
        },
      );

      const result = await service.getById('credentials-id-123', 123);

      expect(result.CAL_NUMERO).toEqual(123);
      expect(result.APL_DESCRICAO).toEqual('Aplicação Teste');
    });

    it('should throw NotFoundException when call center record is not found', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: any) => {
          callback(null, []);
        },
      );

      await expect(
        service.getById('credentials-id-123', 99999),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
