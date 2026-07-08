import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: jest.Mocked<ProductService>;

  const mockProductService = {
    get: jest.fn(),
    getUnique: jest.fn(),
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
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should call productService.get with all parameters', async () => {
      mockProductService.get.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      const result = await controller.getProducts(mockReq, {
        storeId: 1,
        page: 2,
        pageSize: 10,
        priceTable: 1,
        group: 2,
        brand: 5,
        minStock: undefined,
        search: 'search term',
      });

      expect(productService.get).toHaveBeenCalledWith(
        'cred-1',
        1,
        2,
        10,
        1,
        2,
        5,
        undefined,
        'search term',
      );
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('should call productService.get without optional params', async () => {
      mockProductService.get.mockResolvedValue([]);

      await controller.getProducts(mockReq, { storeId: 1 });

      expect(productService.get).toHaveBeenCalledWith(
        'cred-1',
        1,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      );
    });
  });

  describe('getProductById', () => {
    it('should call productService.getUnique with id', async () => {
      const mockProduct = { id: 123, name: 'Product 1' };
      mockProductService.getUnique.mockResolvedValue(mockProduct);

      const result = await controller.getProductById(mockReq, 123, {
        storeId: 1,
      });

      expect(productService.getUnique).toHaveBeenCalledWith(
        'cred-1',
        1,
        123,
        undefined,
        undefined,
      );
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when product not found', async () => {
      mockProductService.getUnique.mockResolvedValue(null);

      await expect(controller.getProductById(mockReq, 999, {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getProductByBarcode', () => {
    it('should call productService.getUnique with barcode', async () => {
      const mockProduct = { id: 1, barcode: '123456789' };
      mockProductService.getUnique.mockResolvedValue(mockProduct);

      const result = await controller.getProductByBarcode(mockReq, 123456789, {
        storeId: 1,
      });

      expect(productService.getUnique).toHaveBeenCalledWith(
        'cred-1',
        1,
        undefined,
        123456789,
        undefined,
      );
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when product not found', async () => {
      mockProductService.getUnique.mockResolvedValue(null);

      await expect(
        controller.getProductByBarcode(mockReq, 999, {}),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
