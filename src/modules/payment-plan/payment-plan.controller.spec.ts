import { Test, TestingModule } from '@nestjs/testing';
import { PaymentPlanController } from './payment-plan.controller';
import { PaymentPlanService } from './payment-plan.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';

describe('PaymentPlanController', () => {
  let controller: PaymentPlanController;
  let paymentPlanService: jest.Mocked<PaymentPlanService>;

  const mockPaymentPlanService = {
    get: jest.fn(),
  };

  const mockReq = {
    authContext: {
      credentialsId: 'cred-1',
    },
  } as any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentPlanController],
      providers: [{ provide: PaymentPlanService, useValue: mockPaymentPlanService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PaymentPlanController>(PaymentPlanController);
    paymentPlanService = module.get(PaymentPlanService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPaymentPlans', () => {
    it('should call paymentPlanService.get with parameters', async () => {
      mockPaymentPlanService.get.mockResolvedValue([{ PLP_CODIGO: 1 }]);

      const result = await controller.getPaymentPlans(
        mockReq,
        2,
        20,
      );

      expect(paymentPlanService.get).toHaveBeenCalledWith(
        'cred-1',
        2,
        20,
      );
      expect(result).toEqual([{ PLP_CODIGO: 1 }]);
    });
  });
});
