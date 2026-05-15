import { Test, TestingModule } from '@nestjs/testing';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';

describe('SupplierController', () => {
  let controller: SupplierController;
  let supplierService: jest.Mocked<SupplierService>;

  const mockSupplierService = {
    get: jest.fn(),
    getById: jest.fn(),
  };

  const mockReq = {
    credentials_id: 'cred-1',
    store_id: 1,
  } as any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierController],
      providers: [{ provide: SupplierService, useValue: mockSupplierService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<SupplierController>(SupplierController);
    supplierService = module.get(SupplierService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should call supplierService.get with all parameters', async () => {
      mockSupplierService.get.mockResolvedValue([{ CRE_CODIGO: 1 }]);

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

      expect(supplierService.get).toHaveBeenCalledWith(
        'cred-1',
        1,
        2,
        20,
        'search term',
        'A'
      );
      expect(result).toEqual([{ CRE_CODIGO: 1 }]);
    });
  });

  describe('getById', () => {
    it('should call supplierService.getById with id', async () => {
      const mockSupplier = { CRE_CODIGO: 123, CRE_NOME: 'Sup 1' };
      mockSupplierService.getById.mockResolvedValue(mockSupplier);

      const result = await controller.getById(mockReq, 123);

      expect(supplierService.getById).toHaveBeenCalledWith(
        'cred-1',
        123
      );
      expect(result).toEqual(mockSupplier);
    });
  });
});
