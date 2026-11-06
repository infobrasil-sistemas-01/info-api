import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ProductionOrderService } from './production-order.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { PaginatedResponse } from 'src/common/pagination/paginated-response';

describe('ProductionOrderService', () => {
  let service: ProductionOrderService;
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
        ProductionOrderService,
        {
          provide: TenantConnectionService,
          useValue: mockTenantConnectionService,
        },
      ],
    }).compile();

    service = module.get<ProductionOrderService>(ProductionOrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('deve retornar lista de ordens em PaginatedResponse sem total quando includeCount = false', async () => {
      const mockResult = [
        {
          ORP_NUMERO: 201,
          SIT_CODIGO: 1,
          SIT_DESCRICAO: 'EM ANDAMENTO',
          LOJ_CODIGO: 1,
          PRO_CODIGO: 'PROD-01',
          ORP_QUANTIDADE: 50.0,
        },
      ];

      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, mockResult);
      });

      const response = await service.get(
        'cred-1',
        1,
        { page: 1, pageSize: 10 },
        false,
      );

      expect(response).toBeInstanceOf(PaginatedResponse);
      expect(response.data).toEqual(mockResult);
      expect(response.total).toBeUndefined();
      expect(mockTenantConnectionService.getConnection).toHaveBeenCalledWith(
        'cred-1',
      );
      expect(
        mockTenantConnectionService.releaseConnection,
      ).toHaveBeenCalledWith(mockConnection);
    });

    it('deve calcular contagem quando includeCount = true e retornar total no PaginatedResponse', async () => {
      const mockResult = [
        {
          ORP_NUMERO: 201,
          PRO_CODIGO: 'PROD-01',
        },
      ];
      const mockCountResult = [{ TOTAL: 15 }];

      mockConnection.query
        .mockImplementationOnce((query, params, callback) => {
          callback(null, mockResult);
        })
        .mockImplementationOnce((query, params, callback) => {
          callback(null, mockCountResult);
        });

      const response = await service.get(
        'cred-1',
        1,
        { page: 1, pageSize: 10 },
        true,
      );

      expect(response).toBeInstanceOf(PaginatedResponse);
      expect(response.data).toEqual(mockResult);
      expect(response.total).toBe(15);
    });

    it('deve aplicar filtros opcionais corretamente na query SQL', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, []);
      });

      await service.get(
        'cred-1',
        undefined,
        {
          storeId: 2,
          statusId: 3,
          productCode: 'PROD-ABC',
          productionOrderNumber: 205,
          startDate: '2026-01-01',
          endDate: '2026-01-31',
          startDateBaixa: '2026-02-01',
          endDateBaixa: '2026-02-28',
        },
        false,
      );

      const [executedQuery, executedParams] =
        mockConnection.query.mock.calls[0];

      expect(executedQuery).toContain('OP.LOJ_CODIGO = ?');
      expect(executedQuery).toContain('OP.SIT_CODIGO = ?');
      expect(executedQuery).toContain('OP.PRO_CODIGO = ?');
      expect(executedQuery).toContain('OP.ORP_NUMERO = ?');
      expect(executedQuery).toContain('OP.ORP_DATA BETWEEN ? AND ?');
      expect(executedQuery).toContain('OP.ORP_DATABAIXA BETWEEN ? AND ?');

      expect(executedParams).toEqual([
        10, // pageSize
        0, // offset
        2, // storeId
        3, // statusId
        'PROD-ABC', // productCode
        205, // productionOrderNumber
        '2026-01-01',
        '2026-01-31',
        '2026-02-01',
        '2026-02-28',
      ]);
    });

    it('deve lançar BadRequestException se page for menor que 1', async () => {
      await expect(
        service.get('cred-1', 1, { page: 0, pageSize: 10 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar BadRequestException se pageSize for menor que 1', async () => {
      await expect(
        service.get('cred-1', 1, { page: 1, pageSize: 0 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getById', () => {
    it('deve retornar a ordem de produção por ID se encontrada', async () => {
      const mockResult = [
        {
          ORP_NUMERO: 201,
          LOJ_CODIGO: 1,
          PRO_CODIGO: 'PROD-01',
        },
      ];

      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, mockResult);
      });

      const result = await service.getById('cred-1', 1, 201);

      expect(result).toEqual(mockResult[0]);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE OP.ORP_NUMERO = ? AND OP.LOJ_CODIGO = ?'),
        [201, 1],
        expect.any(Function),
      );
      expect(
        mockTenantConnectionService.releaseConnection,
      ).toHaveBeenCalledWith(mockConnection);
    });

    it('deve retornar null se a ordem de produção não for encontrada', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, []);
      });

      const result = await service.getById('cred-1', undefined, 999);

      expect(result).toBeNull();
    });
  });

  describe('getItemsByProductionOrderNumber', () => {
    it('deve retornar a lista de itens da ordem de produção', async () => {
      const mockItems = [
        {
          OPI_NUMERO: 1,
          ORP_NUMERO: 201,
          PRO_CODIGO: 'INSUMO-1',
          OPI_PRECO: 5.5,
          OPI_QTDE: 10,
          OPI_TOTAL: 55.0,
        },
      ];

      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, mockItems);
      });

      const result = await service.getItemsByProductionOrderNumber(
        'cred-1',
        201,
      );

      expect(result).toEqual(mockItems);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE OPI.ORP_NUMERO = ?'),
        [201],
        expect.any(Function),
      );
      expect(
        mockTenantConnectionService.releaseConnection,
      ).toHaveBeenCalledWith(mockConnection);
    });
  });
});

