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
    it('should return call center records with mapped blob strings, client, user, and auxiliary descriptions ordered by date DESC', async () => {
      const mockResult = [
        {
          CAL_NUMERO: 1,
          CLI_CODIGO: 10,
          CLI_NOME: 'Cliente João Silva',
          USU_CODIGO: 5,
          USU_APELIDO: 'Atendente João',
          CAL_DATA: '2026-08-10',
          CAL_HORA: '10:00:00',
          CAL_STATUS: 'P',
          CAL_DEPOIMENTO: 'Depoimento em texto',
          CAL_RELATORIO: null,
          CAL_OUTRASINFO: null,
          VEN_NUMERO: 1002,
          APL_DESCRICAO: 'Aplicação Teste',
          TOP_DESCRICAO: 'Tópico Teste',
          FAT_DESCRICAO: 'Forma Teste',
        },
      ];

      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: any) => {
          expect(query).toContain('ORDER BY CC.CAL_DATA DESC, CC.CAL_NUMERO DESC');
          expect(query).toContain('LEFT JOIN CLIENTES');
          expect(query).toContain('LEFT JOIN USUARIOS');
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
      expect(result[0].CLI_NOME).toEqual('Cliente João Silva');
      expect(result[0].USU_APELIDO).toEqual('Atendente João');
      expect(result[0].VEN_NUMERO).toEqual(1002);
      expect(result[0].APL_DESCRICAO).toEqual('Aplicação Teste');
      expect(tenantConnectionService.releaseConnection).toHaveBeenCalledWith(
        mockConnection,
      );
    });

    it('should correctly parse BLOB callback function and buffer fields (including large payloads)', async () => {
      const largeText = 'A'.repeat(15000);
      const mockBlobFunction = (cb: (err: any, name: any, emitter: any) => void) => {
        const { EventEmitter } = require('events');
        const emitter = new EventEmitter();
        cb(null, 'CAL_RELATORIO', emitter);
        setTimeout(() => {
          emitter.emit('data', Buffer.from(largeText.slice(0, 8000)));
          emitter.emit('data', Buffer.from(largeText.slice(8000)));
          emitter.emit('end');
        }, 1);
      };

      const mockResult = [
        {
          CAL_NUMERO: 2,
          CLI_CODIGO: 10,
          CAL_DEPOIMENTO: Buffer.from('Depoimento Buffer'),
          CAL_RELATORIO: mockBlobFunction,
          CAL_OUTRASINFO: 'Outras informações string',
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

      expect(result).toHaveLength(1);
      expect(result[0].CAL_DEPOIMENTO).toEqual('Depoimento Buffer');
      expect(result[0].CAL_RELATORIO).toEqual(largeText);
      expect(result[0].CAL_OUTRASINFO).toEqual('Outras informações string');
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
          CLI_NOME: 'Cliente João Silva',
          USU_CODIGO: 5,
          USU_APELIDO: 'Atendente João',
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
      expect(result.CLI_NOME).toEqual('Cliente João Silva');
      expect(result.USU_APELIDO).toEqual('Atendente João');
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
