import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMethodService } from './payment-method.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('PaymentMethodService', () => {
  let service: PaymentMethodService;
  let mockTenantConnection: any;

  const mockConnection = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    mockTenantConnection = {
      getConnection: jest.fn().mockResolvedValue(mockConnection),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentMethodService,
        { provide: TenantConnectionService, useValue: mockTenantConnection },
      ],
    }).compile();

    service = module.get<PaymentMethodService>(PaymentMethodService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return paginated payment methods', async () => {
      const mockPaymentMethods = [
        { FPG_CODIGO: 1, FPG_DESCRICAO: 'Dinheiro', FPG_BANDEIRA: null },
        { FPG_CODIGO: 2, FPG_DESCRICAO: 'Cartão Débito', FPG_BANDEIRA: 'Visa' },
      ];
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, mockPaymentMethods);
        },
      );

      const result = await service.get('cred-1', 1, 10);

      expect(result).toEqual(mockPaymentMethods);
    });

    it('should calculate correct pagination offset', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await service.get('cred-1', 3, 10);

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.any(String),
        [10, 20],
        expect.any(Function),
      );
    });

    it('should throw error when connection query fails', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(new Error('DB error'), null);
        },
      );

      await expect(service.get('cred-1')).rejects.toThrow('DB error');
    });
  });

  describe('FAILING: payment method edge cases', () => {
    it('should throw error when page size exceeds maximum allowed', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await expect(service.get('cred-1', 1, 10000)).rejects.toThrow();
    });

    it('should throw error when credentials are invalid', async () => {
      mockTenantConnection.getConnection.mockRejectedValue(
        new Error('Invalid credentials'),
      );

      await expect(service.get('invalid-creds', 1, 10)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
});
