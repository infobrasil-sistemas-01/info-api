import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PaymentMethodController } from './payment-method.controller';
import { PaymentMethodService } from './payment-method.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';

describe('PaymentMethodController', () => {
  let controller: PaymentMethodController;
  let paymentMethodService: jest.Mocked<PaymentMethodService>;

  const mockPaymentMethodService = {
    get: jest.fn(),
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
      controllers: [PaymentMethodController],
      providers: [
        { provide: PaymentMethodService, useValue: mockPaymentMethodService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PaymentMethodController>(PaymentMethodController);
    paymentMethodService = module.get(PaymentMethodService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPaymentMethods', () => {
    it('should call paymentMethodService.get with pagination params', async () => {
      mockPaymentMethodService.get.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      const result = await controller.getPaymentMethods(mockReq, 2, 10);

      expect(paymentMethodService.get).toHaveBeenCalledWith('cred-1', 2, 10);
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('should call paymentMethodService.get without pagination when not provided', async () => {
      mockPaymentMethodService.get.mockResolvedValue([]);

      await controller.getPaymentMethods(mockReq);

      expect(paymentMethodService.get).toHaveBeenCalledWith(
        'cred-1',
        undefined,
        undefined,
      );
    });

    it('should throw BadRequestException when pageSize exceeds 25', () => {
      expect(() => controller.getPaymentMethods(mockReq, 1, 30)).toThrow(
        BadRequestException,
      );
    });
  });
});
