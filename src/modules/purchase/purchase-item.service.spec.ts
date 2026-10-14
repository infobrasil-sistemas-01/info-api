import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseItemService } from './purchase-item.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { PaginatedResponse } from 'src/common/pagination/paginated-response';

describe('PurchaseItemService', () => {
  let service: PurchaseItemService;
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
        PurchaseItemService,
        {
          provide: TenantConnectionService,
          useValue: mockTenantConnectionService,
        },
      ],
    }).compile();

    service = module.get<PurchaseItemService>(PurchaseItemService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findItemsByPurchaseId', () => {
    it('deve retornar a lista de itens da compra', async () => {
      const mockItems = [
        {
          ICP_NUMERO: 1,
          COM_NUMERO: 100,
          PRO_CODIGO: 'PROD-1',
          PRO_DESCRICAO: 'PRODUTO 1',
          ICP_QTDE: 10,
          ICP_PRECO: 25.5,
        },
      ];

      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, mockItems);
      });

      const result = await service.findItemsByPurchaseId('cred-1', 100);

      expect(result).toEqual(mockItems);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE ICP.COM_NUMERO = ?'),
        [100],
        expect.any(Function),
      );
    });
  });

  describe('get', () => {
    it('deve retornar itens transversais com paginação', async () => {
      const mockItems = [
        {
          ICP_NUMERO: 1,
          COM_NUMERO: 100,
          PRO_CODIGO: 'PROD-1',
          COM_DATA: '2026-08-15',
        },
      ];

      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, mockItems);
      });

      const result = await service.get('cred-1', { page: 1, pageSize: 10 });

      expect(result).toBeInstanceOf(PaginatedResponse);
      expect(result.data).toEqual(mockItems);
    });

    it('deve calcular total se includeCount for true', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        if (query.includes('COUNT(*)')) {
          callback(null, [{ TOTAL: 25 }]);
        } else {
          callback(null, [{ ICP_NUMERO: 1 }]);
        }
      });

      const result = await service.get(
        'cred-1',
        { page: 1, pageSize: 10 },
        true,
      );

      expect(result).toBeInstanceOf(PaginatedResponse);
      expect(result.total).toBe(25);
    });

    it('deve aplicar múltiplos filtros opcionais na query transversal', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, []);
      });

      await service.get('cred-1', {
        page: 1,
        pageSize: 10,
        purchaseId: 100,
        productId: 'PROD-1',
        storeId: 1,
        supplierId: 45,
        invoiceNumber: '123',
        brandId: 7,
        groupId: 12,
        cfop: 2102,
        startDate: '2026-08-01',
        endDate: '2026-08-31',
      });

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('ICP.COM_NUMERO = ?'),
        expect.arrayContaining([
          10,
          0,
          100,
          'PROD-1',
          1,
          45,
          '%123%',
          7,
          12,
          2102,
          '2026-08-01',
          '2026-08-31',
        ]),
        expect.any(Function),
      );
    });
  });
});
