import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ProductGroupController } from './product-group.controller';
import { ProductGroupService } from './product-group.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

describe('ProductGroupController', () => {
  let controller: ProductGroupController;
  let groupService: jest.Mocked<ProductGroupService>;

  const mockGroupService = {
    get: jest.fn(),
  };

  const mockReq = {
    authContext: {
      userId: 'user-1',
      credentialsId: 'cred-1',
      storeId: 1,
    },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductGroupController],
      providers: [{ provide: ProductGroupService, useValue: mockGroupService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProductGroupController>(ProductGroupController);
    groupService = module.get(ProductGroupService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBrands', () => {
    it('should call groupService.get with pagination params', async () => {
      mockGroupService.get.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      const result = await controller.getBrands(mockReq, 2, 10);

      expect(groupService.get).toHaveBeenCalledWith('cred-1', 2, 10);
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('should call groupService.get without pagination when not provided', async () => {
      mockGroupService.get.mockResolvedValue([]);

      await controller.getBrands(mockReq);

      expect(groupService.get).toHaveBeenCalledWith(
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
