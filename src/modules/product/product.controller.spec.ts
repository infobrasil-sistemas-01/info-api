import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
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
        startDateAlteracao: '2026-01-01',
        endDateAlteracao: '2026-01-31',
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
        '2026-01-01',
        '2026-01-31',
        false,
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
        undefined,
        undefined,
        false,
      );
    });

    it('should use H2M token storeId when query.storeId is omitted', async () => {
      const h2mReq = {
        authContext: {
          userId: 'h2m-user',
          credentialsId: 'cred-1',
          storeId: 5,
          type: 'H2M',
        },
      } as any;

      mockProductService.get.mockResolvedValue([]);

      await controller.getProducts(h2mReq, {});

      expect(productService.get).toHaveBeenCalledWith(
        'cred-1',
        5,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        false,
      );
    });

    it('should allow H2M operator when query.storeId matches tokenStoreId', async () => {
      const h2mReq = {
        authContext: {
          userId: 'h2m-user',
          credentialsId: 'cred-1',
          storeId: 5,
          type: 'H2M',
        },
      } as any;

      mockProductService.get.mockResolvedValue([]);

      await controller.getProducts(h2mReq, { storeId: 5 });

      expect(productService.get).toHaveBeenCalledWith(
        'cred-1',
        5,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        false,
      );
    });

    it('should pass includeCount true to productService.get when includeCount parameter is true', async () => {
      mockProductService.get.mockResolvedValue([]);

      await controller.getProducts(mockReq, { storeId: 1 }, true);

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
        undefined,
        undefined,
        true,
      );
    });

    it('should throw ForbiddenException if H2M operator queries a different storeId', () => {
      const h2mReq = {
        authContext: {
          userId: 'h2m-user',
          credentialsId: 'cred-1',
          storeId: 5,
          type: 'H2M',
        },
      } as any;

      expect(() => controller.getProducts(h2mReq, { storeId: 99 })).toThrow(
        ForbiddenException,
      );
    });

    it('should throw BadRequestException if M2M caller does not provide storeId', () => {
      const m2mReq = {
        authContext: {
          userId: 'm2m-client',
          credentialsId: 'cred-1',
          type: 'M2M',
        },
      } as any;

      expect(() => controller.getProducts(m2mReq, {})).toThrow(
        BadRequestException,
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

    it('should enforce H2M token storeId for product by id, ignoring query.storeId', async () => {
      const h2mReq = {
        authContext: {
          userId: 'h2m-user',
          credentialsId: 'cred-1',
          storeId: 7,
          type: 'H2M',
        },
      } as any;

      const mockProduct = { id: 123, name: 'Product 1' };
      mockProductService.getUnique.mockResolvedValue(mockProduct);

      await controller.getProductById(h2mReq, 123, { storeId: 99 });

      expect(productService.getUnique).toHaveBeenCalledWith(
        'cred-1',
        7,
        123,
        undefined,
        undefined,
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
