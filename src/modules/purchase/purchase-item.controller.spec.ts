import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseItemController } from './purchase-item.controller';
import { PurchaseItemService } from './purchase-item.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { PaginatedResponse } from 'src/common/pagination/paginated-response';

describe('PurchaseItemController', () => {
  let controller: PurchaseItemController;
  let service: jest.Mocked<PurchaseItemService>;

  const mockService = {
    get: jest.fn(),
  };

  const mockReq = {
    authContext: {
      credentialsId: 'cred-1',
      storeId: 1,
      type: 'M2M',
    },
  } as any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseItemController],
      providers: [{ provide: PurchaseItemService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PurchaseItemController>(PurchaseItemController);
    service = module.get(PurchaseItemService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('deve chamar purchaseItemService.get com filtros e includeCount', async () => {
      const mockResult = new PaginatedResponse(
        [{ ICP_NUMERO: 1, COM_NUMERO: 100 }],
        1,
        1,
        10,
      );
      mockService.get.mockResolvedValue(mockResult);

      const query = {
        page: 1,
        pageSize: 10,
        purchaseId: 100,
        productId: 'PROD-1',
      };

      const result = await controller.get(mockReq, query, true);

      expect(service.get).toHaveBeenCalledWith(
        'cred-1',
        { ...query, storeId: 1 },
        true,
      );
      expect(result).toEqual(mockResult);
    });

    it('deve lançar erro se credentialsId não for fornecido', async () => {
      const invalidReq = { authContext: {} } as any;
      expect(() => controller.get(invalidReq, {})).toThrow(
        'Credentials ID not found in token',
      );
    });
  });
});
