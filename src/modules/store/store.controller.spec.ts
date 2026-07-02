import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';

describe('StoreController', () => {
  let controller: StoreController;
  let storeService: jest.Mocked<StoreService>;

  const mockStoreService = {
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
      controllers: [StoreController],
      providers: [{ provide: StoreService, useValue: mockStoreService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<StoreController>(StoreController);
    storeService = module.get(StoreService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should call storeService.get with pagination and filter params', async () => {
      mockStoreService.get.mockResolvedValue([{ LOJ_CODIGO: 1 }]);

      const result = await controller.get(mockReq, 2, 10, 5, '12345678000100');

      expect(storeService.get).toHaveBeenCalledWith(
        'cred-1',
        2,
        10,
        5,
        '12345678000100',
      );
      expect(result).toEqual([{ LOJ_CODIGO: 1 }]);
    });

    it('should call storeService.get with undefined when no query params are provided', async () => {
      mockStoreService.get.mockResolvedValue([]);

      await controller.get(mockReq);

      expect(storeService.get).toHaveBeenCalledWith(
        'cred-1',
        undefined,
        undefined,
        undefined,
        undefined,
      );
    });

    it('should throw error when credentialsId is missing', async () => {
      const invalidReq = { authContext: {} } as any;

      expect(() => controller.get(invalidReq)).toThrow(
        'Credentials ID not found in token',
      );
    });
  });
});
