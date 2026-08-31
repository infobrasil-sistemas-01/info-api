import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';

describe('PurchaseController', () => {
  let controller: PurchaseController;
  let service: jest.Mocked<PurchaseService>;

  const mockService = {
    get: jest.fn(),
  };

  const mockReq = {
    authContext: {
      credentialsId: 'cred-1',
    },
  } as any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseController],
      providers: [{ provide: PurchaseService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PurchaseController>(PurchaseController);
    service = module.get(PurchaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('deve chamar purchaseService.get com credentialsId e query', async () => {
      const mockResult = [{ COM_NUMERO: 100, COM_DATA: '2026-08-15' }];
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

      const result = await controller.get(mockReq, query);

      expect(service.get).toHaveBeenCalledWith('cred-1', query);
      expect(result).toEqual(mockResult);
    });

    it('deve lançar erro se credentialsId não existir no token', async () => {
      const invalidReq = { authContext: {} } as any;
      expect(() => controller.get(invalidReq, {})).toThrow(
        'Credentials ID not found in token',
      );
    });
  });
});
