import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductionOrderController } from './production-order.controller';
import { ProductionOrderService } from './production-order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { PaginatedResponse } from 'src/common/pagination/paginated-response';

describe('ProductionOrderController', () => {
  let controller: ProductionOrderController;
  let service: jest.Mocked<ProductionOrderService>;

  const mockProductionOrderService = {
    get: jest.fn(),
    getById: jest.fn(),
    getItemsByProductionOrderNumber: jest.fn(),
    create: jest.fn(),
  };

  const mockReq = {
    authContext: {
      userId: 'user-1',
      credentialsId: 'cred-1',
      storeId: 1,
      type: 'M2M',
    },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductionOrderController],
      providers: [
        {
          provide: ProductionOrderService,
          useValue: mockProductionOrderService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProductionOrderController>(
      ProductionOrderController,
    );
    service = module.get(ProductionOrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const validBody = {
      product_id: 45,
      quantity: 50,
      store_id: 2,
      user_id: 10,
      products_sold: [{ product_id: 12, quantity: 20 }],
    };

    it('deve chamar productionOrderService.create com credenciais, loja, operador e body no padrão POST /orders', async () => {
      const mockCreated = { ORP_NUMERO: 201, items: [] };
      mockProductionOrderService.create.mockResolvedValue(mockCreated as any);

      const result = await controller.createProductionOrder(
        mockReq,
        validBody as any,
      );

      expect(service.create).toHaveBeenCalledWith(
        'cred-1',
        2,
        10,
        validBody,
      );
      expect(result).toBe(mockCreated);
    });

    it('deve forçar storeId do token quando usuário for H2M', async () => {
      const h2mReq = {
        authContext: {
          userId: '5',
          credentialsId: 'cred-1',
          storeId: 1,
          type: 'H2M',
        },
      } as any;

      mockProductionOrderService.create.mockResolvedValue({} as any);

      await controller.createProductionOrder(h2mReq, {
        ...validBody,
        store_id: 99,
      } as any);

      expect(service.create).toHaveBeenCalledWith(
        'cred-1',
        1,
        5,
        expect.objectContaining({ store_id: 99 }),
      );
    });

    it('deve lançar erro se credentialsId não estiver presente no token', async () => {
      const invalidReq = { authContext: {} } as any;
      await expect(
        controller.createProductionOrder(invalidReq, validBody as any),
      ).rejects.toThrow('Credentials ID not found in token');
    });

    it('deve lançar BadRequestException se storeId não for fornecido e nem existir no token', async () => {
      const noStoreReq = {
        authContext: {
          credentialsId: 'cred-1',
          type: 'M2M',
        },
      } as any;

      await expect(
        controller.createProductionOrder(noStoreReq, {
          ...validBody,
          store_id: undefined,
        } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('get', () => {
    it('deve chamar productionOrderService.get com credenciais, loja e includeCount', async () => {
      const mockResult = new PaginatedResponse([{ ORP_NUMERO: 201 }], 1, 1, 10);
      mockProductionOrderService.get.mockResolvedValue(mockResult);

      const query = { page: 1, pageSize: 10, storeId: 2 };
      const result = await controller.get(mockReq, query, true);

      expect(service.get).toHaveBeenCalledWith('cred-1', 2, query, true);
      expect(result).toBe(mockResult);
    });

    it('deve usar storeId do token quando usuário for H2M', async () => {
      const h2mReq = {
        authContext: {
          userId: 'user-h2m',
          credentialsId: 'cred-1',
          storeId: 5,
          type: 'H2M',
        },
      } as any;

      mockProductionOrderService.get.mockResolvedValue(
        new PaginatedResponse([]),
      );

      await controller.get(h2mReq, { storeId: 99 }, false);

      expect(service.get).toHaveBeenCalledWith(
        'cred-1',
        5,
        { storeId: 99 },
        false,
      );
    });

    it('deve lançar erro se credentialsId não estiver presente no token', () => {
      const invalidReq = { authContext: {} } as any;
      expect(() => controller.get(invalidReq, {}, false)).toThrow(
        'Credentials ID not found in token',
      );
    });
  });

  describe('getById', () => {
    it('deve retornar a ordem de produção com o array aninhado de itens', async () => {
      const mockHeader = {
        ORP_NUMERO: 201,
        LOJ_CODIGO: 1,
        PRO_CODIGO: 'PROD-01',
        SIT_DESCRICAO: 'EM ANDAMENTO',
      };
      const mockItems = [
        {
          OPI_NUMERO: 1,
          ORP_NUMERO: 201,
          PRO_CODIGO: 'INSUMO-01',
          OPI_QTDE: 10,
        },
      ];

      mockProductionOrderService.getById.mockResolvedValue(mockHeader);
      mockProductionOrderService.getItemsByProductionOrderNumber.mockResolvedValue(
        mockItems,
      );

      const result = await controller.getById(mockReq, 201, {});

      expect(service.getById).toHaveBeenCalledWith('cred-1', 1, 201);
      expect(service.getItemsByProductionOrderNumber).toHaveBeenCalledWith(
        'cred-1',
        201,
      );
      expect(result).toEqual({
        ...mockHeader,
        items: mockItems,
      });
    });

    it('deve lançar NotFoundException se a ordem de produção não existir', async () => {
      mockProductionOrderService.getById.mockResolvedValue(null);

      await expect(controller.getById(mockReq, 999, {})).rejects.toThrow(
        NotFoundException,
      );
      expect(
        service.getItemsByProductionOrderNumber,
      ).not.toHaveBeenCalled();
    });
  });

  describe('getItems', () => {
    it('deve retornar diretamente o array de itens da ordem', async () => {
      const mockItems = [
        {
          OPI_NUMERO: 1,
          ORP_NUMERO: 201,
          PRO_CODIGO: 'INSUMO-01',
        },
      ];

      mockProductionOrderService.getItemsByProductionOrderNumber.mockResolvedValue(
        mockItems,
      );

      const result = await controller.getItems(mockReq, 201);

      expect(service.getItemsByProductionOrderNumber).toHaveBeenCalledWith(
        'cred-1',
        201,
      );
      expect(result).toEqual(mockItems);
    });

    it('deve lançar erro se credentialsId não estiver presente no token', async () => {
      const invalidReq = { authContext: {} } as any;
      await expect(controller.getItems(invalidReq, 201)).rejects.toThrow(
        'Credentials ID not found in token',
      );
    });
  });
});
