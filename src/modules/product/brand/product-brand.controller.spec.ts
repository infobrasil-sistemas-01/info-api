import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ProductBrandController } from './product-brand.controller';
import { ProductBrandService } from './product-brand.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

describe('ProductBrandController', () => {
  let controller: ProductBrandController;
  let brandService: jest.Mocked<ProductBrandService>;

  const mockBrandService = {
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
      controllers: [ProductBrandController],
      providers: [{ provide: ProductBrandService, useValue: mockBrandService }],
    })
      .overrideGuard(JwtAuthGuard)
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

      const result = await controller.getBrands(mockReq, 2, 10);

      expect(brandService.get).toHaveBeenCalledWith('cred-1', 2, 10);
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('should call brandService.get without pagination when not provided', async () => {
      mockBrandService.get.mockResolvedValue([]);

      await controller.getBrands(mockReq);

      expect(brandService.get).toHaveBeenCalledWith(
        'cred-1',
        undefined,
        undefined,
      );
    });

    it('should throw BadRequestException when pageSize exceeds 25', () => {
      expect(() => controller.getBrands(mockReq, 1, 30)).toThrow(
        BadRequestException,
      );
    });
  });
});
