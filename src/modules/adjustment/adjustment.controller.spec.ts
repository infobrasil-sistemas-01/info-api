import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AdjustmentController } from './adjustment.controller';
import { AdjustmentService } from './adjustment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { PaginatedResponse } from 'src/common/pagination/paginated-response';

describe('AdjustmentController', () => {
  let controller: AdjustmentController;
  let service: jest.Mocked<AdjustmentService>;

  const mockAdjustmentService = {
    get: jest.fn(),
    getById: jest.fn(),
    getItemsByAdjustmentNumber: jest.fn(),
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
      controllers: [AdjustmentController],
      providers: [
        {
          provide: AdjustmentService,
          useValue: mockAdjustmentService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AdjustmentController>(AdjustmentController);
    service = module.get(AdjustmentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('deve chamar adjustmentService.get com credenciais, loja e includeCount', async () => {
      const mockResult = new PaginatedResponse([{ ACE_NUMERO: 1 }], 1, 1, 10);
      mockAdjustmentService.get.mockResolvedValue(mockResult);

      const query = { page: 1, pageSize: 10, storeId: 2 };
      const result = await controller.get(mockReq, query, true);

      expect(service.get).toHaveBeenCalledWith(
        'cred-1',
        2,
        query,
        true,
      );
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

      mockAdjustmentService.get.mockResolvedValue(new PaginatedResponse([]));

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
    it('deve retornar o acerto com o array aninhado de itens', async () => {
      const mockHeader = {
        ACE_NUMERO: 105,
        LOJ_CODIGO: 1,
        SIT_DESCRICAO: 'FINALIZADO',
      };
      const mockItems = [
        {
          IAC_NUMERO: 1,
          ACE_NUMERO: 105,
          PRO_CODIGO: 'PROD-01',
          IAC_QTDE: 5,
        },
      ];

      mockAdjustmentService.getById.mockResolvedValue(mockHeader);
      mockAdjustmentService.getItemsByAdjustmentNumber.mockResolvedValue(mockItems);

      const result = await controller.getById(mockReq, 105, {});

      expect(service.getById).toHaveBeenCalledWith('cred-1', 1, 105);
      expect(service.getItemsByAdjustmentNumber).toHaveBeenCalledWith(
        'cred-1',
        105,
      );
      expect(result).toEqual({
        ...mockHeader,
        items: mockItems,
      });
    });

    it('deve lançar NotFoundException se o acerto não existir', async () => {
      mockAdjustmentService.getById.mockResolvedValue(null);

      await expect(controller.getById(mockReq, 999, {})).rejects.toThrow(
        NotFoundException,
      );
      expect(service.getItemsByAdjustmentNumber).not.toHaveBeenCalled();
    });
  });

  describe('getItems', () => {
    it('deve retornar diretamente o array de itens do acerto', async () => {
      const mockItems = [
        {
          IAC_NUMERO: 1,
          ACE_NUMERO: 105,
          PRO_CODIGO: 'PROD-01',
        },
      ];

      mockAdjustmentService.getItemsByAdjustmentNumber.mockResolvedValue(mockItems);

      const result = await controller.getItems(mockReq, 105);

      expect(service.getItemsByAdjustmentNumber).toHaveBeenCalledWith(
        'cred-1',
        105,
      );
      expect(result).toEqual(mockItems);
    });
  });
});
