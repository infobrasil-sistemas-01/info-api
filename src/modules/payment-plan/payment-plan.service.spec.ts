import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PaymentPlanService } from './payment-plan.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('PaymentPlanService', () => {
  let service: PaymentPlanService;
  let mockTenantConnection: any;

  const mockConnection = {
    query: jest.fn(),
  };

  beforeAll(async () => {
    mockTenantConnection = {
      getConnection: jest.fn().mockResolvedValue(mockConnection),
      releaseConnection: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentPlanService,
        { provide: TenantConnectionService, useValue: mockTenantConnection },
      ],
    }).compile();

    service = module.get<PaymentPlanService>(PaymentPlanService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return paginated payment plans', async () => {
      const mockPlans = [
        { PLP_CODIGO: 1, PLP_DESCRICAO: 'A VISTA' },
      ];
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, mockPlans);
        },
      );

      const result = await service.get('cred-1', 1, 10);

      expect(result).toEqual(mockPlans);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT FIRST ? SKIP ?'),
        expect.arrayContaining([10, 0]),
        expect.any(Function),
      );
    });

    it('should throw BadRequestException when pageSize is greater than 25', async () => {
      await expect(
        service.get('cred-1', 1, 50),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
