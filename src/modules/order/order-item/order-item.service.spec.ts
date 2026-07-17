import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemService } from './order-item.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('OrderItemService', () => {
  let service: OrderItemService;
  let mockTenantConnection: any;

  const mockConnection = {
    query: jest.fn(),
  };

  const mockTransaction = {
    query: jest.fn(),
  };

  beforeAll(async () => {
    mockTenantConnection = {
      getConnection: jest.fn().mockResolvedValue(mockConnection),
      releaseConnection: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemService,
        { provide: TenantConnectionService, useValue: mockTenantConnection },
      ],
    }).compile();

    service = module.get<OrderItemService>(OrderItemService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('insertSoldProductOnDb', () => {
    const mockProduct = {
      product_id: 1,
      quantity: 2,
    };

    const mockOurProduct = {
      PRO_CODIGO: 101,
      PRO_PRECO1: 15.5,
      PRO_PRCCOMPRA: 10.0,
      PRO_PRCCUSTO: 8.0,
      PRO_PRCCOMPRAFISCAL: 12.0,
      PRO_CUSTOFISCAL: 9.0,
      PRG_CODIGO: 1,
    };

    it('should insert sold product successfully', async () => {
      mockTransaction.query.mockImplementation(
        (query: string, values: any[], callback: Function) => {
          callback(null, { success: true });
        },
      );

      const result = await service.insertSoldProductOnDb(
        mockTransaction,
        mockProduct,
        mockOurProduct,
        123,
        1,
      );

      expect(result).toEqual({ success: true });
    });

    it('should include variant data when variant_id is provided', async () => {
      mockTransaction.query.mockImplementation(
        (query: string, values: any[], callback: Function) => {
          callback(null, { success: true });
        },
      );

      const variantProduct = {
        product_id: 1,
        quantity: 1,
        variant_id: 5,
      };

      const ourProductWithVariant = {
        ...mockOurProduct,
        TAM_CODIGO: 2,
        COR_CODIGO: 3,
      };

      await service.insertSoldProductOnDb(
        mockTransaction,
        variantProduct,
        ourProductWithVariant,
        123,
        1,
      );

      expect(mockTransaction.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO ITENSVEN'),
        expect.arrayContaining([123, 1, 101, 101, 2, 3, 1, 1, 15.5]),
        expect.any(Function),
      );
    });

    it('should reject promise on query error', async () => {
      mockTransaction.query.mockImplementation(
        (query: string, values: any[], callback: Function) => {
          callback(new Error('Insert error'));
        },
      );

      await expect(
        service.insertSoldProductOnDb(
          mockTransaction,
          mockProduct,
          mockOurProduct,
          123,
          1,
        ),
      ).rejects.toThrow('Insert error');
    });
  });

  describe('getByOrderId', () => {
    it('should return order items', async () => {
      const mockItems = [
        {
          PRO_CODIGO: 1,
          PRO_DESCRICAO: 'Product 1',
          PRO_PESO: 1.5,
          IVD_PRECO: 10.0,
          IVD_QTDE: 2,
          IVD_TOTAL: 20.0,
          IVD_DESCONTO: 0,
          IVD_LIQUIDO: 20.0,
          TRM_CODIGO: '3',
          TRM_DESCRICAO: 'ENTREGA',
        },
      ];
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, mockItems);
        },
      );

      const result = await service.getByOrderId('cred-1', 123);

      expect(result).toEqual(mockItems);
    });

    it('should reject on query error', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(new Error('Query error'), null);
        },
      );

      await expect(service.getByOrderId('cred-1', 123)).rejects.toThrow(
        'Query error',
      );
    });
  });

  describe('FAILING: order item edge cases', () => {
    const mockProduct = {
      product_id: 1,
      quantity: 2,
    };

    const mockOurProduct = {
      PRO_CODIGO: 101,
      PRO_PRECO1: 15.5,
      PRO_PRCCOMPRA: 10.0,
      PRO_PRCCUSTO: 8.0,
      PRO_PRCCOMPRAFISCAL: 12.0,
      PRO_CUSTOFISCAL: 9.0,
      PRG_CODIGO: 1,
    };

    it('should throw error when quantity is zero', async () => {
      mockTransaction.query.mockImplementation(
        (query: string, values: any[], callback: Function) => {
          callback(null, { success: true });
        },
      );

      const productWithZeroQty = {
        product_id: 1,
        quantity: 0,
      };

      await expect(
        service.insertSoldProductOnDb(
          mockTransaction,
          productWithZeroQty,
          mockOurProduct,
          123,
          1,
        ),
      ).rejects.toThrow();
    });
  });
});
