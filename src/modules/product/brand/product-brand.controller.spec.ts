import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ProductBrandController } from './product-brand.controller';
import { ProductBrandService } from './product-brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';

describe('ProductBrandController', () => {
  let controller: ProductBrandController;
  let brandService: jest.Mocked<ProductBrandService>;

  const mockBrandService = {
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
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
      controllers: [ProductBrandController],
      providers: [{ provide: ProductBrandService, useValue: mockBrandService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProductBrandController>(ProductBrandController);
    brandService = module.get(ProductBrandService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBrands', () => {
    it('should call brandService.get with pagination params', async () => {
      mockBrandService.get.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      const result = await controller.getBrands(mockReq, { page: 2, pageSize: 10 });

      expect(brandService.get).toHaveBeenCalledWith('cred-1', 2, 10);
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('should call brandService.get without pagination when not provided', async () => {
      mockBrandService.get.mockResolvedValue([]);

      await controller.getBrands(mockReq, {});

      expect(brandService.get).toHaveBeenCalledWith(
        'cred-1',
        undefined,
        undefined,
      );
    });
  });

  describe('createBrand', () => {
    it('should call brandService.create and return the created brand', async () => {
      const mockCreatedBrand = { MAR_CODIGO: 3, MAR_DESCRICAO: 'New Brand' };
      mockBrandService.create.mockResolvedValue(mockCreatedBrand);

      const payload: CreateBrandDto = { MAR_DESCRICAO: 'New Brand' };
      const result = await controller.createBrand(mockReq, payload);

      expect(brandService.create).toHaveBeenCalledWith('cred-1', payload);
      expect(result).toEqual(mockCreatedBrand);
    });
  });

  describe('updateBrand', () => {
    it('should call brandService.update and return the updated brand', async () => {
      const mockUpdatedBrand = {
        MAR_CODIGO: 1,
        MAR_DESCRICAO: 'Updated Brand',
      };
      mockBrandService.update.mockResolvedValue(mockUpdatedBrand);

      const payload: UpdateBrandDto = { MAR_DESCRICAO: 'Updated Brand' };
      const result = await controller.updateBrand(mockReq, 1, payload);

      expect(brandService.update).toHaveBeenCalledWith('cred-1', 1, payload);
      expect(result).toEqual(mockUpdatedBrand);
    });
  });
});
