import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderItemService } from './order-item/order-item.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostOrderDto } from './dto/create-order.dto';
import { GenerateReceiptDto } from './dto/generate-receipt.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: jest.Mocked<OrderService>;
  let orderItemService: jest.Mocked<OrderItemService>;

  const mockOrderService = {
    post: jest.fn(),
    get: jest.fn(),
    getById: jest.fn(),
    generateReceipt: jest.fn(),
  };

  const mockOrderItemService = {
    getByOrderId: jest.fn(),
  };

  const mockReq = {
    authContext: {
      userId: 'user-1',
      credentialsId: 'cred-1',
      storeId: 1,
    },
  } as any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: OrderItemService, useValue: mockOrderItemService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get(OrderService);
    orderItemService = module.get(OrderItemService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('postOrder', () => {
    it('should call orderService.post with credentialsId, dto, and storeId', async () => {
      const dto = new PostOrderDto();
      dto.id = 123;
      dto.date = '2024-01-15';
      dto.hour = '10:30:00';
      dto.payment_method = 'credit';
      dto.payment_date = '2024-01-15';
      dto.has_payment = true;
      dto.has_invoice = false;

      mockOrderService.post.mockResolvedValue({ orderId: 123 });

      const result = await controller.postOrder(mockReq, dto);

      expect(orderService.post).toHaveBeenCalledWith('cred-1', dto, 1);
      expect(result).toEqual({ orderId: 123 });
    });

    it('should call orderService.post with storeId 1 when not provided', async () => {
      const dto = new PostOrderDto();
      dto.id = 123;
      dto.date = '2024-01-15';
      dto.hour = '10:30:00';
      dto.payment_method = 'credit';
      dto.payment_date = '2024-01-15';
      dto.has_payment = true;
      dto.has_invoice = false;

      mockOrderService.post.mockResolvedValue({ orderId: 123 });

      const result = await controller.postOrder(mockReq, dto);

      expect(orderService.post).toHaveBeenCalledWith('cred-1', dto, 1);
      expect(result).toEqual({ orderId: 123 });
    });
  });

  describe('postReceipt', () => {
    it('should call orderService.generateReceipt with correct parameters', async () => {
      const dto = new GenerateReceiptDto();
      dto.email = 'test@example.com';
      dto.cpf = '12345678900';

      mockOrderService.generateReceipt.mockResolvedValue({ receiptId: 456 });

      const result = await controller.postReceipt(mockReq, dto, 123);

      expect(orderService.generateReceipt).toHaveBeenCalledWith(
        'cred-1',
        123,
        1,
        { email: 'test@example.com', cpf: '12345678900' },
      );
      expect(result).toEqual({ receiptId: 456 });
    });
  });

  describe('getOrders', () => {
    it('should call orderService.get with pagination params', async () => {
      mockOrderService.get.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      const result = await controller.getOrders(mockReq, 2, 10);

      expect(orderService.get).toHaveBeenCalledWith('cred-1', 1, 2, 10);
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('should call orderService.get without pagination when not provided', async () => {
      mockOrderService.get.mockResolvedValue([]);

      await controller.getOrders(mockReq);

      expect(orderService.get).toHaveBeenCalledWith(
        'cred-1',
        1,
        undefined,
        undefined,
      );
    });
  });

  describe('getOrderById', () => {
    it('should call orderService.getById and orderItemService.getByOrderId', async () => {
      const mockOrder = { id: 123, date: '2024-01-15' };
      const mockItems = [{ product_id: 1, quantity: 2 }];

      mockOrderService.getById.mockResolvedValue(mockOrder);
      mockOrderItemService.getByOrderId.mockResolvedValue(mockItems);

      const result = await controller.getOrderById(mockReq, 123);

      expect(orderService.getById).toHaveBeenCalledWith('cred-1', 1, 123);
      expect(orderItemService.getByOrderId).toHaveBeenCalledWith('cred-1', 123);
      expect(result).toEqual({ ...mockOrder, items: mockItems });
    });
  });
});
