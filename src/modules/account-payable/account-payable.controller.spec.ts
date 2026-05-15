import { Test, TestingModule } from '@nestjs/testing';
import { AccountPayableController } from './account-payable.controller';
import { AccountPayableService } from './account-payable.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';

describe('AccountPayableController', () => {
  let controller: AccountPayableController;
  let service: jest.Mocked<AccountPayableService>;

  const mockService = {
    get: jest.fn(),
    getById: jest.fn(),
  };

  const mockReq = {
    authContext: {
      credentialsId: 'cred-1',
    },
  } as any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountPayableController],
      providers: [{ provide: AccountPayableService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AccountPayableController>(AccountPayableController);
    service = module.get(AccountPayableService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccountPayable', () => {
    it('should call service.get with all parameters', async () => {
      mockService.get.mockResolvedValue([{ PAG_NUMERO: 1 }]);

      const query = {
        page: 2,
        pageSize: 20,
        storeId: 1,
        supplierId: 5,
        situation: 'A' as any,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      const result = await controller.getAccountPayable(mockReq, query);

      expect(service.get).toHaveBeenCalledWith(
        'cred-1',
        2,
        20,
        1,
        5,
        'A',
        '2024-01-01',
        '2024-12-31'
      );
      expect(result).toEqual([{ PAG_NUMERO: 1 }]);
    });
  });

  describe('getAccountPayableById', () => {
    it('should call service.getById with id parameter', async () => {
      mockService.getById.mockResolvedValue({ PAG_NUMERO: 1, PAG_VALOR: 100 });

      const result = await controller.getAccountPayableById(mockReq, 1);

      expect(service.getById).toHaveBeenCalledWith('cred-1', 1);
      expect(result).toEqual({ PAG_NUMERO: 1, PAG_VALOR: 100 });
    });
  });
});
