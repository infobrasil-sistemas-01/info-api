import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { NotFoundException } from '@nestjs/common';

describe('DeliveryController', () => {
  let controller: DeliveryController;
  let deliveryService: jest.Mocked<DeliveryService>;

  const mockDeliveryService = {
    get: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    getStatus: jest.fn(),
  };

  const mockReq = {
    authContext: {
      credentialsId: 'cred-1',
      storeId: 1,
    },
  } as any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryController],
      providers: [{ provide: DeliveryService, useValue: mockDeliveryService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DeliveryController>(DeliveryController);
    deliveryService = module.get(DeliveryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDeliveries', () => {
    it('should call deliveryService.get with correct parameters', async () => {
      mockDeliveryService.get.mockResolvedValue([{ VEN_NUMERO: 12345 }]);

      const result = await controller.getDeliveries(mockReq, {
        page: 2,
        pageSize: 20,
        storeId: 1,
        startDate: '2026-05-01',
        endDate: '2026-05-31',
        situation: 1,
        vehiclePlate: 'ABC-1234',
        providerId: 5,
        orderId: 10,
        status: 2,
      });

      expect(deliveryService.get).toHaveBeenCalledWith('cred-1', 1, 2, 20, {
        startDate: '2026-05-01',
        endDate: '2026-05-31',
        situation: 1,
        vehiclePlate: 'ABC-1234',
        providerId: 5,
        orderId: 10,
        status: 2,
      });
      expect(result).toEqual([{ VEN_NUMERO: 12345 }]);
    });
  });

  describe('getDeliveriesStatus', () => {
    it('should call deliveryService.getStatus with correct parameters', async () => {
      const mockStatus = [{ TBS_CODIGO: 1, TBS_DESCRICAO: 'PENDENTE' }];
      mockDeliveryService.getStatus.mockResolvedValue(mockStatus);

      const result = await controller.getDeliveriesStatus(mockReq);

      expect(deliveryService.getStatus).toHaveBeenCalledWith('cred-1');
      expect(result).toEqual(mockStatus);
    });

    it('should throw error if credentialsId is missing', async () => {
      const badReq = { authContext: {} } as any;

      await expect(controller.getDeliveriesStatus(badReq)).rejects.toThrow(
        'Credentials ID not found in token',
      );
    });
  });

  describe('getDeliveryById', () => {
    it('should return delivery by id', async () => {
      const mockDelivery = { VEN_NUMERO: 12345, ENT_NUMERO: 100, items: [] };
      mockDeliveryService.getById.mockResolvedValue(mockDelivery);

      const result = await controller.getDeliveryById(mockReq, 100, {
        storeId: 1,
      });

      expect(deliveryService.getById).toHaveBeenCalledWith('cred-1', 100, 1);
      expect(result).toEqual(mockDelivery);
    });

    it('should throw NotFoundException if delivery is not found', async () => {
      mockDeliveryService.getById.mockResolvedValue(null);

      await expect(
        controller.getDeliveryById(mockReq, 999, { storeId: 1 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createDelivery', () => {
    it('should call deliveryService.create with correct parameters', async () => {
      const mockInput = { VEN_NUMERO: 12345 };
      const mockResult = { VEN_NUMERO: 12345, ENT_NUMERO: 100 };
      mockDeliveryService.create.mockResolvedValue(mockResult);

      const result = await controller.createDelivery(mockReq, mockInput as any);

      expect(deliveryService.create).toHaveBeenCalledWith('cred-1', mockInput);
      expect(result).toEqual(mockResult);
    });
  });
});
