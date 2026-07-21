import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ProductGroupController } from './product-group.controller';
import { ProductGroupService } from './product-group.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';

describe('ProductGroupController', () => {
  let controller: ProductGroupController;
  let groupService: jest.Mocked<ProductGroupService>;

  const mockGroupService = {
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
      controllers: [ProductGroupController],
      providers: [{ provide: ProductGroupService, useValue: mockGroupService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProductGroupController>(ProductGroupController);
    groupService = module.get(ProductGroupService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getGroups', () => {
    it('should call groupService.get with pagination params', async () => {
      mockGroupService.get.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      const result = await controller.getGroups(mockReq, {
        page: 2,
        pageSize: 10,
      });

      expect(groupService.get).toHaveBeenCalledWith('cred-1', 2, 10);
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('should call groupService.get without pagination when not provided', async () => {
      mockGroupService.get.mockResolvedValue([]);

      await controller.getGroups(mockReq, {});

      expect(groupService.get).toHaveBeenCalledWith(
        'cred-1',
        undefined,
        undefined,
      );
    });
  });

  describe('createGroup', () => {
    it('should create a new product group', async () => {
      const inputDto = { GRU_DESCRICAO: 'New Group' };
      const createdGroup = { GRU_CODIGO: 5, GRU_DESCRICAO: 'New Group' };
      mockGroupService.create.mockResolvedValue(createdGroup);

      const result = await controller.createGroup(mockReq, inputDto);

      expect(groupService.create).toHaveBeenCalledWith('cred-1', inputDto);
      expect(result).toEqual(createdGroup);
    });

    it('should throw error when credentialsId is missing in request context', async () => {
      const reqWithoutCreds = { authContext: {} } as any;
      await expect(
        controller.createGroup(reqWithoutCreds, { GRU_DESCRICAO: 'New Group' }),
      ).rejects.toThrow('Credentials ID not found in token');
    });
  });

  describe('updateGroup', () => {
    it('should update an existing product group', async () => {
      const inputDto = { GRU_DESCRICAO: 'Updated Group' };
      const updatedGroup = { GRU_CODIGO: 1, GRU_DESCRICAO: 'Updated Group' };
      mockGroupService.update.mockResolvedValue(updatedGroup);

      const result = await controller.updateGroup(mockReq, 1, inputDto);

      expect(groupService.update).toHaveBeenCalledWith('cred-1', 1, inputDto);
      expect(result).toEqual(updatedGroup);
    });

    it('should throw error when credentialsId is missing in request context', async () => {
      const reqWithoutCreds = { authContext: {} } as any;
      await expect(
        controller.updateGroup(reqWithoutCreds, 1, {
          GRU_DESCRICAO: 'Updated Group',
        }),
      ).rejects.toThrow('Credentials ID not found in token');
    });
  });
});
