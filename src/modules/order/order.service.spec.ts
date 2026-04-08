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

  beforeEach(async () => {
    mockTenantConnection = {
      getConnection: jest.fn().mockResolvedValue(mockConnection),
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

  describe('post', () => {
    const mockOrderData = {
      id: 123,
      date: '2024-01-15',
      hour: '10:30:00',
      store_note: 'Test note',
      payment_method: '1',
      installment: 1,
      discount: 0,
      taxes: 0,
      payment_date: '2024-01-15',
      has_payment: true,
      has_invoice: false,
      products_sold: [{ product_id: 1, quantity: 2 }],
    };

    beforeEach(() => {
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

      expect(result).toHaveLength(2);
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
    it('should return order by id', async () => {
      const mockOrder = { VEN_NUMERO: 123, VEN_DATA: '2024-01-15' };
      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, [mockOrder]);
      });

      const result = await service.getById('cred-1', 1, 123);

      expect(result).toEqual(mockOrder);
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
        id: 123,
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
        id: 123,
        date: '2024-01-15',
        hour: '10:30:00',
        payment_method: '1',
        products_sold: [],
      };

      await expect(
        service.post('cred-1', orderDataWithNoProducts as any, 1),
      ).rejects.toThrow();
    });
  });
});
