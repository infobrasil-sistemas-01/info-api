import { Test, TestingModule } from '@nestjs/testing';
import { AccountReceivableController } from './account-receivable.controller';
import { AccountReceivableService } from './account-receivable.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';

describe('AccountReceivableController', () => {
  let controller: AccountReceivableController;
  let accountReceivableService: jest.Mocked<AccountReceivableService>;

  const mockAccountReceivableService = {
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
      controllers: [AccountReceivableController],
      providers: [
        {
          provide: AccountReceivableService,
          useValue: mockAccountReceivableService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AccountReceivableController>(
      AccountReceivableController,
    );
    accountReceivableService = module.get(AccountReceivableService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    const mockAccountReceivables = [
      {
        cli_codigo: 1,
        cli_nome: 'Cliente A',
        rec_numero: 10,
        rec_situacao: 'A',
        rec_datavenc: '2024-06-01',
        rec_valor: 200.0,
      },
      {
        cli_codigo: 2,
        cli_nome: 'Cliente B',
        rec_numero: 11,
        rec_situacao: 'L',
        rec_datavenc: '2024-05-15',
        rec_valor: 350.5,
      },
    ];

    it('should call service.get with credentialsId and clientId', async () => {
      mockAccountReceivableService.get.mockResolvedValue(
        mockAccountReceivables,
      );

      const result = await controller.get(mockReq, {
        clientId: 1,
      });

      expect(accountReceivableService.get).toHaveBeenCalledWith(
        'cred-1',
        1,
        1,
        10,
        1,
        undefined,
        undefined,
        undefined,
        undefined,
      );
      expect(result).toEqual(mockAccountReceivables);
    });

    it('should call service.get with all filters', async () => {
      mockAccountReceivableService.get.mockResolvedValue(
        mockAccountReceivables,
      );

      const result = await controller.get(mockReq, {
        storeId: 2,
        page: 2,
        pageSize: 20,
        clientId: 5,
        arId: 10,
        situation: 'A',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      });

      expect(accountReceivableService.get).toHaveBeenCalledWith(
        'cred-1',
        2,
        2,
        20,
        5,
        10,
        'A',
        '2024-01-01',
        '2024-12-31',
      );
      expect(result).toEqual(mockAccountReceivables);
    });

    it('should call service.get with only arId filter', async () => {
      mockAccountReceivableService.get.mockResolvedValue([
        mockAccountReceivables[0],
      ]);

      const result = await controller.get(mockReq, { arId: 10 });

      expect(accountReceivableService.get).toHaveBeenCalledWith(
        'cred-1',
        1,
        1,
        10,
        undefined,
        10,
        undefined,
        undefined,
        undefined,
      );
      expect(result).toEqual([mockAccountReceivables[0]]);
    });

    it('should call service.get with only situation filter', async () => {
      mockAccountReceivableService.get.mockResolvedValue(
        mockAccountReceivables,
      );

      await controller.get(mockReq, { situation: 'L' });

      expect(accountReceivableService.get).toHaveBeenCalledWith(
        'cred-1',
        1,
        1,
        10,
        undefined,
        undefined,
        'L',
        undefined,
        undefined,
      );
    });

    it('should call service.get with date range filter', async () => {
      mockAccountReceivableService.get.mockResolvedValue([]);

      await controller.get(mockReq, {
        startDate: '2024-01-01',
        endDate: '2024-03-31',
      });

      expect(accountReceivableService.get).toHaveBeenCalledWith(
        'cred-1',
        1,
        1,
        10,
        undefined,
        undefined,
        undefined,
        '2024-01-01',
        '2024-03-31',
      );
    });

    it('should throw error when credentialsId is not in token', async () => {
      const reqWithoutCredentials = {
        authContext: {
          userId: 'user-1',
          storeId: 1,
        },
      } as any;

      await expect(
        controller.get(reqWithoutCredentials, { clientId: 1 }),
      ).rejects.toThrow('Credentials ID not found in token');
    });

    it('should throw error when storeId is not in token', async () => {
      const reqWithoutStoreId = {
        authContext: {
          userId: 'user-1',
          credentialsId: 'cred-1',
        },
      } as any;

      await expect(
        controller.get(reqWithoutStoreId, { clientId: 1 }),
      ).rejects.toThrow('Store ID not found in token');
    });

    it('should propagate errors from service', async () => {
      mockAccountReceivableService.get.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(
        controller.get(mockReq, { clientId: 1 }),
      ).rejects.toThrow('Service error');
    });

    it('should return empty array when no records found', async () => {
      mockAccountReceivableService.get.mockResolvedValue([]);

      const result = await controller.get(mockReq, { clientId: 999 });

      expect(result).toEqual([]);
    });
  });
});
