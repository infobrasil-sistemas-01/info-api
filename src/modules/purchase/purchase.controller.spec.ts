import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { PurchaseItemService } from './purchase-item.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { PaginatedResponse } from 'src/common/pagination/paginated-response';

describe('PurchaseController', () => {
  let controller: PurchaseController;
  let service: jest.Mocked<PurchaseService>;
  let itemService: jest.Mocked<PurchaseItemService>;

  const mockService = {
    get: jest.fn(),
    getById: jest.fn(),
  };

  const mockItemService = {
    findItemsByPurchaseId: jest.fn(),
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
      controllers: [PurchaseController],
      providers: [
        { provide: PurchaseService, useValue: mockService },
        { provide: PurchaseItemService, useValue: mockItemService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PurchaseController>(PurchaseController);
    service = module.get(PurchaseService);
    itemService = module.get(PurchaseItemService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('deve chamar purchaseService.get com credentialsId, query e includeCount', async () => {
      const mockResult = new PaginatedResponse(
        [{ COM_NUMERO: 100, COM_DATA: '2026-08-15' }],
        1,
        1,
        10,
      );
      mockService.get.mockResolvedValue(mockResult);

      const query = {
        page: 1,
        pageSize: 10,
        storeId: 1,
        supplierId: 45,
        startDate: '2026-08-01',
        endDate: '2026-08-31',
        invoiceNumber: '1234',
        nfeKey: '23260812345678000195550010001234561001234567',
      };

      const result = await controller.get(mockReq, query, true);

      expect(service.get).toHaveBeenCalledWith('cred-1', query, true);
      expect(result).toEqual(mockResult);
    });

    it('deve lançar erro se credentialsId não existir no token', async () => {
      const invalidReq = { authContext: {} } as any;
      expect(() => controller.get(invalidReq, {})).toThrow(
        'Credentials ID not found in token',
      );
    });
  });

  describe('getById', () => {
    it('deve retornar a compra com seus itens', async () => {
      const mockPurchase = {
        COM_NUMERO: 100,
        COM_DATA: '2026-08-15',
        LOJ_CODIGO: 1,
      };
      const mockItems = [
        { ICP_NUMERO: 1, COM_NUMERO: 100, PRO_CODIGO: 'PROD-1' },
      ];

      mockService.getById.mockResolvedValue(mockPurchase);
      mockItemService.findItemsByPurchaseId.mockResolvedValue(mockItems);

      const result = await controller.getById(mockReq, 100);

      expect(service.getById).toHaveBeenCalledWith('cred-1', 1, 100);
      expect(itemService.findItemsByPurchaseId).toHaveBeenCalledWith('cred-1', 100);
      expect(result).toEqual({
        ...mockPurchase,
        items: mockItems,
      });
    });

    it('deve lançar NotFoundException se compra não for encontrada', async () => {
      mockService.getById.mockResolvedValue(null);

      await expect(controller.getById(mockReq, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
