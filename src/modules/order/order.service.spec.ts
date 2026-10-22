import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { OrderService } from './order.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { OrderItemService } from './order-item/order-item.service';
import { ProductService } from '../product/product.service';
import { ReceiptService } from '../receipt/receipt.service';

describe('OrderService', () => {
  let service: OrderService;
  let mockTenantConnection: any;
  let mockOrderItemService: any;
  let mockProductService: any;
  let mockReceiptService: any;

  const mockConnection = {
    query: jest.fn(),
    startTransaction: jest.fn(),
  };

  const mockTransaction = {
    query: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
  };

  beforeAll(async () => {
    mockTenantConnection = {
      getConnection: jest.fn().mockResolvedValue(mockConnection),
      releaseConnection: jest.fn().mockResolvedValue(undefined),
    };

    mockOrderItemService = {
      insertSoldProductOnDb: jest.fn().mockResolvedValue({}),
    };

    mockProductService = {
      getById: jest.fn(),
    };

    mockReceiptService = {
      post: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: TenantConnectionService, useValue: mockTenantConnection },
        { provide: OrderItemService, useValue: mockOrderItemService },
        { provide: ProductService, useValue: mockProductService },
        { provide: ReceiptService, useValue: mockReceiptService },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockOrderData = {
    client_id: 1,
    employee_id: 1,
    store_id: 1,
    provider_id: 1,
    price_table_id: 1,
    user_id: 1,
    date: '2024-01-15',
    hour: '10:30:00',
    store_note: 'Test note',
    payment_method: '1',
    installment: 1,
    discount: 0,
    taxes: 0,
    payment_date: '2024-01-15',
    products_sold: [{ product_id: 1, quantity: 2 }],
  };

  describe('post', () => {

    beforeEach(() => {
      mockConnection.startTransaction.mockImplementation((callback) => {
        callback(null, mockTransaction);
      });

      mockConnection.query.mockImplementation((query, params, callback) => {
        if (typeof query === 'string' && query.includes('FROM USUARIOS')) {
          return callback(null, [
            {
              USU_CODIGO: 1,
              USU_SITUACAO: 'A',
              FUN_CODIGO: 1,
              FUN_SITUACAO: 'A',
              FUN_DATADEMISSAO: null,
            },
          ]);
        }
        callback(null, []);
      });

      mockTransaction.query.mockImplementation((query, params, callback) => {
        if (query.includes('INSERT INTO VENDAS')) {
          callback(null, { VEN_NUMERO: 123 });
        } else {
          callback(null, {});
        }
      });

      mockTransaction.commit.mockImplementation((callback) => {
        callback(null);
      });

      mockProductService.getById.mockResolvedValue({
        PRO_CODIGO: 1,
        PRO_PRECO1: 10.5,
      });
    });

    it('should create an order successfully', async () => {
      const result = await service.post('cred-1', mockOrderData as any, 1);

      expect(result).toEqual({ orderId: 123 });
      expect(mockConnection.startTransaction).toHaveBeenCalled();
      expect(mockProductService.getById).toHaveBeenCalled();
      expect(mockOrderItemService.insertSoldProductOnDb).toHaveBeenCalled();
    });

    it('should throw error when transaction start fails', async () => {
      mockConnection.startTransaction.mockImplementation((callback) => {
        callback(new Error('Transaction error'), null);
      });

      await expect(
        service.post('cred-1', mockOrderData as any, 1),
      ).rejects.toThrow('Transaction error');
    });

    it('should calculate totalpp1 with net liquid amount and omit ven_valorent in financial update', async () => {
      const orderWithDiscount = {
        ...mockOrderData,
        discount: 5,
        taxes: 2,
      };

      await service.post('cred-1', orderWithDiscount as any, 1);

      // Total calculated: 10.5 * 2 = 21
      // Net liquid: 21 + 2 (taxes) - 5 (discount) = 18
      const updateVendasCall = mockTransaction.query.mock.calls.find(
        (call: any[]) =>
          typeof call[0] === 'string' && call[0].includes('UPDATE VENDAS'),
      );

      expect(updateVendasCall).toBeDefined();
      const [sql, params] = updateVendasCall;
      expect(sql).not.toContain('VEN_VALORENT');
      // [PP1_CODIGO, FP1_CODIGO, VEN_TOTALPP1, VEN_TOTALPPA1, VEN_TOTALBRUTO, VEN_TOTALDESC, VEN_TOTALACRESC, VEN_TOTALLIQUIDO, VEN_DATABASE1, VEN_NUMERO]
      expect(params[2]).toBe(18); // VEN_TOTALPP1
      expect(params[3]).toBe(18); // VEN_TOTALPPA1
      expect(params[4]).toBe(21); // VEN_TOTALBRUTO
      expect(params[5]).toBe(5); // VEN_TOTALDESC
      expect(params[6]).toBe(2); // VEN_TOTALACRESC
      expect(params[7]).toBe(18); // VEN_TOTALLIQUIDO
    });
  });

  describe('generateReceipt', () => {
    const mockReceiptData = { email: 'test@example.com', cpf: '12345678900' };

    beforeEach(() => {
      mockConnection.startTransaction.mockImplementation((callback) => {
        callback(null, mockTransaction);
      });

      mockTransaction.query.mockImplementation((query, params, callback) => {
        callback(null, {});
      });

      mockTransaction.commit.mockImplementation((callback) => {
        callback(null);
      });

      mockReceiptService.post.mockResolvedValue({ ID: 456 });
    });

    it('should generate receipt successfully', async () => {
      const result = await service.generateReceipt(
        'cred-1',
        123,
        1,
        mockReceiptData,
      );

      expect(result).toEqual({ receiptId: 456 });
      expect(mockReceiptService.post).toHaveBeenCalledWith('cred-1', 1, 123);
    });
  });

  describe('get', () => {
    it('should return paginated orders', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, [
          { VEN_NUMERO: 1, VEN_DATA: '2024-01-15' },
          { VEN_NUMERO: 2, VEN_DATA: '2024-01-16' },
        ]);
      });

      const result = await service.get('cred-1', 1, 1, 10);

      expect(result.data).toHaveLength(2);
      expect(result.total).toBeUndefined();
    });

    it('should query count and return total when includeCount is true', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        if (query.includes('COUNT(*)')) {
          callback(null, [{ TOTAL: 55 }]);
        } else {
          callback(null, [
            {
              VEN_NUMERO: 1,
              VEN_DATA: '2024-01-15',
              LOJ_CODIGO: 1,
              LOJ_NOME: 'Loja Matriz',
              LOJ_FANTASIA: 'Matriz',
              SIT_CODIGO: 2,
              SIT_DESCRICAO: 'FECHADO',
              VEN_TOTALBRUTO: 100,
              VEN_TOTALDESC: 10,
              VEN_TOTALLIQUIDO: 90,
              FP1_CODIGO: 1,
              FPG_DESCRICAO: 'Dinheiro',
              VEN_TOTALPP1: 90,
            },
          ]);
        }
      });

      const result = await service.get('cred-1', 1, 1, 10, true);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(55);
      expect(result.data[0].LOJ_NOME).toBe('Loja Matriz');
      expect(result.data[0].SIT_DESCRICAO).toBe('FECHADO');
      expect(result.data[0].PAYMENTS).toEqual([
        { codigo: 1, descricao: 'Dinheiro', valor: 90 },
      ]);
    });

    it('should calculate correct pagination offset', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, []);
      });

      await service.get('cred-1', 1, 3, 10);

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.any(String),
        [10, 20, 1],
        expect.any(Function),
      );
    });
  });

  describe('getById', () => {
    it('should return order by id with enriched payments and store', async () => {
      const mockOrder = {
        VEN_NUMERO: 123,
        LOJ_CODIGO: 1,
        LOJ_NOME: 'Loja Matriz',
        LOJ_FANTASIA: 'Matriz',
        VEN_DATA: '2024-01-15',
        SIT_CODIGO: 2,
        SIT_DESCRICAO: 'FECHADO',
        VEN_TOTALBRUTO: 150.0,
        VEN_TOTALDESC: 10.0,
        VEN_TOTALLIQUIDO: 140.0,
        FP1_CODIGO: 1,
        FPG_DESCRICAO: 'Dinheiro',
        VEN_TOTALPP1: 40.0,
        FP2_CODIGO: 2,
        FPG2_DESCRICAO: 'Cartão de Crédito',
        VEN_TOTALPP2: 100.0,
        VEN_ENTREGA: 'S',
        VEN_MONTAGEM: 'N',
        TRA_CODIGO: 1,
        TRA_NOME: 'Transportadora 1',
        VALORENT: 10.0,
        MON_DATA: '2024-01-16',
      };
      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, [mockOrder]);
      });

      const result = (await service.getById('cred-1', 1, 123)) as any;

      expect(result.VEN_NUMERO).toBe(123);
      expect(result.LOJ_NOME).toBe('Loja Matriz');
      expect(result.SIT_DESCRICAO).toBe('FECHADO');
      expect(result.PAYMENTS).toEqual([
        { codigo: 1, descricao: 'Dinheiro', valor: 40.0 },
        { codigo: 2, descricao: 'Cartão de Crédito', valor: 100.0 },
      ]);
    });
  });

  describe('FAILING: order edge cases', () => {
    it('should throw error when product not found during order creation', async () => {
      mockConnection.startTransaction.mockImplementation((callback) => {
        callback(null, mockTransaction);
      });

      mockTransaction.query.mockImplementation((query, params, callback) => {
        if (query.includes('INSERT INTO VENDAS')) {
          callback(null, { VEN_NUMERO: 123 });
        } else {
          callback(null, {});
        }
      });

      mockProductService.getById.mockResolvedValue(null);

      const orderDataWithInvalidProduct = {
        user_id: 1,
        date: '2024-01-15',
        hour: '10:30:00',
        payment_method: '1',
        products_sold: [{ product_id: 999, quantity: 1 }],
      };

      await expect(
        service.post('cred-1', orderDataWithInvalidProduct as any, 1),
      ).rejects.toThrow();
    });

    it('should throw error when order has no products', async () => {
      mockConnection.startTransaction.mockImplementation((callback) => {
        callback(null, mockTransaction);
      });

      const orderDataWithNoProducts = {
        user_id: 1,
        date: '2024-01-15',
        hour: '10:30:00',
        payment_method: '1',
        products_sold: [],
      };

      await expect(
        service.post('cred-1', orderDataWithNoProducts as any, 1),
      ).rejects.toThrow();
    });

    it('should throw BadRequestException when user_id is missing in service', async () => {
      const { user_id, ...orderWithoutUser } = mockOrderData;

      await expect(
        service.post('cred-1', orderWithoutUser as any, 1),
      ).rejects.toThrow(
        new BadRequestException(
          'O campo user_id (código do operador no ERP) é obrigatório.',
        ),
      );
    });

    it('should throw BadRequestException when employee_id is missing in service', async () => {
      const { employee_id, ...orderWithoutEmployee } = mockOrderData;

      await expect(
        service.post('cred-1', orderWithoutEmployee as any, 1),
      ).rejects.toThrow(
        new BadRequestException(
          'O campo employee_id (código do funcionário/vendedor no ERP) é obrigatório.',
        ),
      );
    });

    it('should throw BadRequestException when user_id is not found in database', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        if (typeof query === 'string' && query.includes('FROM USUARIOS')) {
          return callback(null, []); // Usuário inexistente
        }
        callback(null, []);
      });

      await expect(
        service.post('cred-1', { ...mockOrderData, user_id: 999 } as any, 1),
      ).rejects.toThrow(new BadRequestException('Usuário/operador com ID 999 não encontrado.'));
    });

    it('should throw BadRequestException when user_id is inactive', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        if (typeof query === 'string' && query.includes('FROM USUARIOS')) {
          return callback(null, [{ USU_CODIGO: 1, USU_SITUACAO: 'I' }]); // Inativo
        }
        callback(null, []);
      });

      await expect(
        service.post('cred-1', { ...mockOrderData, user_id: 1 } as any, 1),
      ).rejects.toThrow(new BadRequestException('Usuário/operador com ID 1 está inativo.'));
    });

    it('should throw BadRequestException when user has no FUN_CODIGO linked', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        if (typeof query === 'string' && query.includes('FROM USUARIOS')) {
          return callback(null, [{ USU_CODIGO: 1, USU_SITUACAO: 'A', FUN_CODIGO: null }]);
        }
        callback(null, []);
      });

      await expect(
        service.post('cred-1', mockOrderData as any, 1),
      ).rejects.toThrow(
        new BadRequestException(
          'O usuário/operador com ID 1 não possui um funcionário vinculado no ERP.',
        ),
      );
    });

    it('should throw BadRequestException when user FUN_CODIGO differs from employee_id', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        if (typeof query === 'string' && query.includes('FROM USUARIOS')) {
          return callback(null, [
            {
              USU_CODIGO: 1,
              USU_SITUACAO: 'A',
              FUN_CODIGO: 99,
              FUN_SITUACAO: 'A',
            },
          ]);
        }
        callback(null, []);
      });

      await expect(
        service.post('cred-1', { ...mockOrderData, employee_id: 1 } as any, 1),
      ).rejects.toThrow(
        new BadRequestException(
          'O funcionário informado (1) não corresponde ao funcionário vinculado ao usuário/operador 1 no ERP (99).',
        ),
      );
    });

    it('should throw BadRequestException when linked employee is inactive or dismissed', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        if (typeof query === 'string' && query.includes('FROM USUARIOS')) {
          return callback(null, [
            {
              USU_CODIGO: 1,
              USU_SITUACAO: 'A',
              FUN_CODIGO: 1,
              FUN_SITUACAO: 'I',
            },
          ]);
        }
        callback(null, []);
      });

      await expect(
        service.post('cred-1', mockOrderData as any, 1),
      ).rejects.toThrow(
        new BadRequestException(
          'O funcionário com ID 1 está inativo ou desligado no ERP.',
        ),
      );
    });
  });

  describe('getOrderMetrics', () => {
    const filters = {
      startDate: '2026-09-01',
      endDate: '2026-09-30',
    };

    it('should return aggregated metrics with correctly calculated averageTicket', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        expect(query).toContain('SIT_CODIGO = 2');
        expect(query).toContain('SIT_CODIGO IN (1, 4)');
        expect(query).toContain('AND V.LOJ_CODIGO = ?');
        expect(params).toEqual([1, '2026-09-01', '2026-09-30']);

        callback(null, [
          {
            TOTAL_ORDERS: 100,
            BILLING: 224597.99,
            OPEN_ORDERS: 22,
          },
        ]);
      });

      const result = await service.getOrderMetrics('cred-1', 1, filters);

      expect(result).toEqual({
        totalOrders: 100,
        billing: 224597.99,
        averageTicket: 2245.98,
        openOrders: 22,
      });
      expect(mockTenantConnection.releaseConnection).toHaveBeenCalledWith(
        mockConnection,
      );
    });

    it('should return zero for averageTicket when totalOrders is 0', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, [
          {
            TOTAL_ORDERS: 0,
            BILLING: 0,
            OPEN_ORDERS: 5,
          },
        ]);
      });

      const result = await service.getOrderMetrics('cred-1', 1, filters);

      expect(result).toEqual({
        totalOrders: 0,
        billing: 0,
        averageTicket: 0,
        openOrders: 5,
      });
      expect(mockTenantConnection.releaseConnection).toHaveBeenCalledWith(
        mockConnection,
      );
    });

    it('should query without storeId filter when storeId is undefined', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        expect(query).not.toContain('AND V.LOJ_CODIGO = ?');
        expect(params).toEqual(['2026-09-01', '2026-09-30']);

        callback(null, [
          {
            TOTAL_ORDERS: 50,
            BILLING: 10000,
            OPEN_ORDERS: 10,
          },
        ]);
      });

      const result = await service.getOrderMetrics(
        'cred-1',
        undefined,
        filters,
      );

      expect(result).toEqual({
        totalOrders: 50,
        billing: 10000,
        averageTicket: 200,
        openOrders: 10,
      });
      expect(mockTenantConnection.releaseConnection).toHaveBeenCalledWith(
        mockConnection,
      );
    });

    it('should release connection even if query fails', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(new Error('Firebird connection lost'), null);
      });

      await expect(
        service.getOrderMetrics('cred-1', 1, filters),
      ).rejects.toThrow('Firebird connection lost');

      expect(mockTenantConnection.releaseConnection).toHaveBeenCalledWith(
        mockConnection,
      );
    });
  });

  describe('getAbcCurve', () => {
    const query = {
      startDate: '2026-01-22',
      endDate: '2026-10-22',
      groupBy: 'SELLER' as const,
    };

    it('should calculate ABC curve for sellers matching print data', async () => {
      mockConnection.query.mockImplementation((sql: string, params: any, callback: any) => {
        if (sql.includes('GLOBAL_QTD')) {
          callback(null, [
            { GLOBAL_QTD: 57, GLOBAL_VALOR: 27275.88, ENTITY_COUNT: 6 },
          ]);
        } else {
          callback(null, [
            {
              ENTITY_CODE: 41,
              ENTITY_NAME: 'ALISSON - HOMOBR',
              SOLD_QUANTITY: 1.0,
              SOLD_VALUE: 100.0,
            },
            {
              ENTITY_CODE: 49,
              ENTITY_NAME: 'CARLOS CESAR - DAVI',
              SOLD_QUANTITY: 8.0,
              SOLD_VALUE: 6632.0,
            },
            {
              ENTITY_CODE: 18,
              ENTITY_NAME: 'THIAGO - HOMOBR',
              SOLD_QUANTITY: 30.0,
              SOLD_VALUE: 8583.33,
            },
          ]);
        }
      });

      const result = await service.getAbcCurve('cred-1', 1, query);

      expect(result.dimension).toBe('SELLER');
      expect(result.summary.totalQuantity).toBe(57);
      expect(result.summary.totalValue).toBe(27275.88);
      expect(result.items.length).toBe(3);
      expect(result.items[0]).toMatchObject({
        code: 41,
        name: 'ALISSON - HOMOBR',
        soldQuantity: 1,
        soldValue: 100,
        classification: 'A',
      });
      expect(mockTenantConnection.releaseConnection).toHaveBeenCalledWith(
        mockConnection,
      );
    });

    it('should handle pagination and return pagination metadata', async () => {
      mockConnection.query.mockImplementation((sql: string, params: any, callback: any) => {
        if (sql.includes('GLOBAL_QTD')) {
          callback(null, [
            { GLOBAL_QTD: 100, GLOBAL_VALOR: 50000, ENTITY_COUNT: 15 },
          ]);
        } else {
          callback(null, [
            {
              ENTITY_CODE: 1,
              ENTITY_NAME: 'CLIENTE 1',
              SOLD_QUANTITY: 10,
              SOLD_VALUE: 5000,
            },
          ]);
        }
      });

      const result = await service.getAbcCurve('cred-1', 1, {
        ...query,
        groupBy: 'CUSTOMER' as const,
        page: 1,
        pageSize: 10,
      });

      expect(result.pagination).toBeDefined();
      expect(result.pagination?.page).toBe(1);
      expect(result.pagination?.pageSize).toBe(10);
      expect(result.pagination?.totalItems).toBe(15);
      expect(result.pagination?.totalPages).toBe(2);
    });

    it('should release connection if query fails', async () => {
      mockConnection.query.mockImplementation((sql: string, params: any, callback: any) => {
        callback(new Error('Query failed'), null);
      });

      await expect(service.getAbcCurve('cred-1', 1, query)).rejects.toThrow(
        'Query failed',
      );
      expect(mockTenantConnection.releaseConnection).toHaveBeenCalledWith(
        mockConnection,
      );
    });
  });
});
