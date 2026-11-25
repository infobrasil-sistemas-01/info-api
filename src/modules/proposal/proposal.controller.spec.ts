import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { ProposalController } from './proposal.controller';
import { ProposalService } from './proposal.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';

describe('ProposalController', () => {
  let controller: ProposalController;
  let mockService: jest.Mocked<ProposalService>;

  beforeEach(async () => {
    mockService = {
      create: jest.fn(),
      get: jest.fn(),
      getById: jest.fn(),
      getItemsByProposalNumber: jest.fn(),
      update: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProposalController],
      providers: [{ provide: ProposalService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProposalController>(ProposalController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create proposal using token storeId for H2M', async () => {
    const req: any = {
      authContext: {
        credentialsId: 'cred_1',
        storeId: 1,
        usuCodigo: 5,
        funCodigo: 2,
        type: 'H2M',
      },
    };
    const body: any = {
      FUN_CODIGO: 2,
      SIT_CODIGO: 1,
      CLI_CODIGO: 10,
      ITENS: [{ PRO_CODIGO: '001', IPR_QTDE: 1 }],
    };

    mockService.create.mockResolvedValue({ PRO_NUMERO: 105 } as any);
    const result = await controller.create(req, body);

    expect(mockService.create).toHaveBeenCalledWith('cred_1', 1, 5, body);
    expect(result).toEqual({ PRO_NUMERO: 105 });
  });

  it('should forbid H2M from creating proposal for another store', async () => {
    const req: any = {
      authContext: {
        credentialsId: 'cred_1',
        storeId: 1,
        usuCodigo: 5,
        funCodigo: 2,
        type: 'H2M',
      },
    };
    const body: any = {
      LOJ_CODIGO: 2,
      FUN_CODIGO: 2,
      SIT_CODIGO: 1,
      CLI_CODIGO: 10,
      ITENS: [{ PRO_CODIGO: '001', IPR_QTDE: 1 }],
    };

    await expect(controller.create(req, body)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should delegate get, getById, getItems, and update to ProposalService', async () => {
    const req: any = {
      authContext: {
        credentialsId: 'cred_1',
        storeId: 1,
        type: 'M2M',
        includeCount: true,
      },
    };

    mockService.get.mockResolvedValue({ data: [], total: 0 } as any);
    await controller.get(req, { page: 1, pageSize: 10 }, true);
    expect(mockService.get).toHaveBeenCalledWith(
      'cred_1',
      undefined,
      { page: 1, pageSize: 10 },
      true,
    );

    mockService.getById.mockResolvedValue({ PRO_NUMERO: 105 } as any);
    await controller.getById(req, 105, {});
    expect(mockService.getById).toHaveBeenCalledWith('cred_1', undefined, 105);

    mockService.getItemsByProposalNumber.mockResolvedValue([]);
    await controller.getItems(req, 105);
    expect(mockService.getItemsByProposalNumber).toHaveBeenCalledWith(
      'cred_1',
      105,
      undefined,
    );

    mockService.update.mockResolvedValue({ PRO_NUMERO: 105 } as any);
    await controller.update(req, 105, { PRO_OBS: 'Teste' });
    expect(mockService.update).toHaveBeenCalledWith(
      'cred_1',
      undefined,
      105,
      { PRO_OBS: 'Teste' },
    );
  });
});
