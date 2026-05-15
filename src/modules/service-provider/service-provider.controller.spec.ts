import { Test, TestingModule } from '@nestjs/testing';
import { ServiceProviderController } from './service-provider.controller';
import { ServiceProviderService } from './service-provider.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';

describe('ServiceProviderController', () => {
  let controller: ServiceProviderController;
  let serviceProviderService: jest.Mocked<ServiceProviderService>;

  const mockServiceProviderService = {
    get: jest.fn(),
    getById: jest.fn(),
  };

  const mockReq = {
    credentials_id: 'cred-1',
    store_id: 1,
  } as any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceProviderController],
      providers: [{ provide: ServiceProviderService, useValue: mockServiceProviderService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ServiceProviderController>(ServiceProviderController);
    serviceProviderService = module.get(ServiceProviderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should call serviceProviderService.get with all parameters', async () => {
      mockServiceProviderService.get.mockResolvedValue([{ PRE_CODIGO: 1 }, { PRE_CODIGO: 2 }]);

      const result = await controller.get(
        mockReq,
        {
          storeId: 1,
          page: 2,
          pageSize: 20,
          search: 'search term',
          situation: 'A',
        }
      );

      expect(serviceProviderService.get).toHaveBeenCalledWith(
        'cred-1',
        1,
        2,
        20,
        'search term',
        'A'
      );
      expect(result).toEqual([{ PRE_CODIGO: 1 }, { PRE_CODIGO: 2 }]);
    });

    it('should call serviceProviderService.get without optional params', async () => {
      mockServiceProviderService.get.mockResolvedValue([]);

      await controller.get(mockReq, {} as any);

      expect(serviceProviderService.get).toHaveBeenCalledWith(
        'cred-1',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
    });
  });

  describe('getById', () => {
    it('should call serviceProviderService.getById with id', async () => {
      const mockProvider = { PRE_CODIGO: 123, PRE_NOME: 'Provider 1' };
      mockServiceProviderService.getById.mockResolvedValue(mockProvider);

      const result = await controller.getById(mockReq, 123);

      expect(serviceProviderService.getById).toHaveBeenCalledWith(
        'cred-1',
        123
      );
      expect(result).toEqual(mockProvider);
    });
  });
});
