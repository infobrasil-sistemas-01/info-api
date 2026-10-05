import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AdjustmentService } from './adjustment.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { PaginatedResponse } from 'src/common/pagination/paginated-response';

describe('AdjustmentService', () => {
  let service: AdjustmentService;
  let mockTenantConnectionService: any;
  let mockConnection: any;

  beforeEach(async () => {
    mockConnection = {
      query: jest.fn(),
    };

    mockTenantConnectionService = {
      getConnection: jest.fn().mockResolvedValue(mockConnection),
      releaseConnection: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdjustmentService,
        {
          provide: TenantConnectionService,
          useValue: mockTenantConnectionService,
        },
      ],
    }).compile();

    service = module.get<AdjustmentService>(AdjustmentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('deve retornar lista de acertos em PaginatedResponse sem total quando includeCount = false', async () => {
      const mockResult = [
        {
          ACE_NUMERO: 101,
          SIT_CODIGO: 1,
          SIT_DESCRICAO: 'FINALIZADO',
          LOJ_CODIGO: 1,
          USU_CODIGO: 1,
          ACE_TOTAL: 150.0,
        },
      ];

      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, mockResult);
      });

      const response = await service.get('cred-1', 1, { page: 1, pageSize: 10 }, false);

      expect(response).toBeInstanceOf(PaginatedResponse);
      expect(response.data).toEqual(mockResult);
      expect(response.total).toBeUndefined();
      expect(mockTenantConnectionService.getConnection).toHaveBeenCalledWith('cred-1');
      expect(mockTenantConnectionService.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });

    it('deve calcular contagem quando includeCount = true e retornar total no PaginatedResponse', async () => {
      const mockResult = [
        {
          ACE_NUMERO: 101,
          ACE_TOTAL: 150.0,
        },
      ];
      const mockCountResult = [{ TOTAL: 42 }];

      mockConnection.query
        .mockImplementationOnce((query, params, callback) => {
          callback(null, mockResult);
        })
        .mockImplementationOnce((query, params, callback) => {
          callback(null, mockCountResult);
        });

      const response = await service.get('cred-1', 1, { page: 1, pageSize: 10 }, true);

      expect(response).toBeInstanceOf(PaginatedResponse);
      expect(response.data).toEqual(mockResult);
      expect(response.total).toBe(42);
      expect(mockConnection.query).toHaveBeenCalledTimes(2);
    });

    it('deve aplicar todos os filtros opcionais na cláusula WHERE', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        expect(query).toContain('A.LOJ_CODIGO = ?');
        expect(query).toContain('A.SIT_CODIGO = ?');
        expect(query).toContain('A.ACE_TIPO = ?');
        expect(query).toContain('A.USU_CODIGO = ?');
        expect(query).toContain('A.ACE_NUMERO = ?');
        expect(query).toContain('A.ACE_DATA BETWEEN ? AND ?');
        callback(null, []);
      });

      await service.get(
        'cred-1',
        undefined,
        {
          page: 2,
          pageSize: 20,
          storeId: 3,
          statusId: 2,
          type: '1',
          userId: 7,
          adjustmentNumber: 55,
          startDate: '2026-01-01',
          endDate: '2026-01-31',
        },
        false,
      );

      expect(mockTenantConnectionService.releaseConnection).toHaveBeenCalled();
    });

    it('deve lançar BadRequestException se page < 1', async () => {
      await expect(service.get('cred-1', 1, { page: 0 })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar BadRequestException se pageSize < 1', async () => {
      await expect(service.get('cred-1', 1, { pageSize: 0 })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getById', () => {
    it('deve retornar registro único do acerto quando encontrado', async () => {
      const mockAdjustment = {
        ACE_NUMERO: 105,
        LOJ_CODIGO: 1,
        SIT_DESCRICAO: 'ABERTO',
      };

      mockConnection.query.mockImplementation((query, params, callback) => {
        expect(query).toContain('A.ACE_NUMERO = ?');
        callback(null, [mockAdjustment]);
      });

      const result = await service.getById('cred-1', 1, 105);

      expect(result).toEqual(mockAdjustment);
      expect(mockTenantConnectionService.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });

    it('deve retornar null quando acerto não for encontrado', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, []);
      });

      const result = await service.getById('cred-1', 1, 999);

      expect(result).toBeNull();
      expect(mockTenantConnectionService.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });
  });

  describe('getItemsByAdjustmentNumber', () => {
    it('deve retornar array de itens associados ao acerto com joins de produto, marca e grupo', async () => {
      const mockItems = [
        {
          IAC_NUMERO: 1,
          ACE_NUMERO: 105,
          PRO_CODIGO: 'PROD-01',
          PRO_DESCRICAO: 'PRODUTO TESTE',
          MAR_DESCRICAO: 'MARCA 1',
          GRU_DESCRICAO: 'GRUPO 1',
          IAC_QTDE: 10,
        },
      ];

      mockConnection.query.mockImplementation((query, params, callback) => {
        expect(query).toContain('FROM ITENSACE IA');
        expect(query).toContain('INNER JOIN PRODUTOS P');
        expect(query).toContain('LEFT JOIN MARCAS M');
        expect(query).toContain('LEFT JOIN GRUPOSPRO G');
        expect(params).toEqual([105]);
        callback(null, mockItems);
      });

      const result = await service.getItemsByAdjustmentNumber('cred-1', 105);

      expect(result).toEqual(mockItems);
      expect(mockTenantConnectionService.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });
  });
});
