import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemController } from './order-item.controller';
import { OrderItemService } from './order-item.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';

describe('OrderItemController', () => {
  let controller: OrderItemController;
  let mockOrderItemService: any;

  const mockReq = {
    authContext: {
      credentialsId: 'cred-1',
      storeId: 1,
    },
  } as any;

  beforeEach(async () => {
    mockOrderItemService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemController],
      providers: [
        { provide: OrderItemService, useValue: mockOrderItemService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<OrderItemController>(OrderItemController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should call orderItemService.get with credentials, storeId, query, and includeCount false by default', async () => {
      const mockResult = [{ VEN_NUMERO: 1, PRO_CODIGO: 101 }];
      mockOrderItemService.get.mockResolvedValue(mockResult);

      const query = { page: 1, pageSize: 10 };
      const result = await controller.get(mockReq, query as any);

      expect(result).toEqual(mockResult);
      expect(mockOrderItemService.get).toHaveBeenCalledWith(
        'cred-1',
        1,
        query,
        false,
      );
    });

    it('should call orderItemService.get with includeCount true when header is present', async () => {
      const mockResult = [{ VEN_NUMERO: 1, PRO_CODIGO: 101 }];
      mockOrderItemService.get.mockResolvedValue(mockResult);

      const query = { page: 2, pageSize: 20, orderId: 123 };
      const result = await controller.get(mockReq, query as any, true);

      expect(result).toEqual(mockResult);
      expect(mockOrderItemService.get).toHaveBeenCalledWith(
        'cred-1',
        1,
        query,
        true,
      );
    });
  });
});
