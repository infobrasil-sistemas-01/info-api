import { Test, TestingModule } from '@nestjs/testing';
import { ParseIntPipe, BadRequestException } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';

describe('ClientController', () => {
  let controller: ClientController;
  let mockService: any;

  beforeEach(async () => {
    mockService = {
      get: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [{ provide: ClientService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ClientController>(ClientController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return clients using user.store_id when query.storeId is not provided', async () => {
      const mockResult = [{ CLI_CODIGO: 1, CLI_NOME: 'Test Client' }];
      mockService.get.mockResolvedValue(mockResult);

      const user = { credentials_id: 'cred-1', store_id: 1 };
      const query = { page: 1, pageSize: 10 };
      const result = await controller.get(user, query as any);

      expect(result).toEqual(mockResult);
      expect(mockService.get).toHaveBeenCalledWith(
        'cred-1',
        1,
        1,
        10,
        undefined,
        undefined,
        undefined,
        undefined,
      );
    });

    it('should return clients using query.storeId when provided for M2M', async () => {
      const mockResult = [{ CLI_CODIGO: 1, CLI_NOME: 'Test Client' }];
      mockService.get.mockResolvedValue(mockResult);

      const user = { credentials_id: 'cred-1', store_id: 1, type: 'M2M' };
      const query = { storeId: 2, page: 1, pageSize: 10 };
      const result = await controller.get(user, query as any);

      expect(result).toEqual(mockResult);
      expect(mockService.get).toHaveBeenCalledWith(
        'cred-1',
        2,
        1,
        10,
        undefined,
        undefined,
        undefined,
        undefined,
      );
    });

    it('should throw ForbiddenException when H2M operator requests different storeId', async () => {
      const user = { credentials_id: 'cred-1', store_id: 1, type: 'H2M' };
      const query = { storeId: 2 };

      await expect(controller.get(user, query as any)).rejects.toThrow(
        'Operador não autorizado a consultar dados de outra filial',
      );
    });
  });

  describe('getById', () => {
    it('should return client details for valid numeric ID', async () => {
      const mockResult = { CLI_CODIGO: 1, CLI_NOME: 'Test Client' };
      mockService.getById.mockResolvedValue(mockResult);

      const user = { credentials_id: 'cred-1', store_id: 1 };
      const result = await controller.getById(user, 1);

      expect(result).toEqual(mockResult);
      expect(mockService.getById).toHaveBeenCalledWith('cred-1', 1, 1);
    });
  });

  describe('update', () => {
    it('should update client for valid numeric ID', async () => {
      const mockResult = { CLI_CODIGO: 1, CLI_NOME: 'Updated Name' };
      mockService.update.mockResolvedValue(mockResult);

      const user = { credentials_id: 'cred-1', store_id: 1 };
      const payload = { CLI_NOME: 'Updated Name' };
      const result = await controller.update(user, 1, payload);

      expect(result).toEqual(mockResult);
      expect(mockService.update).toHaveBeenCalledWith('cred-1', 1, 1, payload);
    });
  });

  describe('ParseIntPipe validation', () => {
    it('should parse valid integer string', async () => {
      const pipe = new ParseIntPipe();
      const result = await pipe.transform('123', { type: 'param', data: 'id' });
      expect(result).toBe(123);
    });

    it('should throw BadRequestException when param is "undefined"', async () => {
      const pipe = new ParseIntPipe();
      await expect(
        pipe.transform('undefined', { type: 'param', data: 'id' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when param is non-numeric string', async () => {
      const pipe = new ParseIntPipe();
      await expect(
        pipe.transform('abc', { type: 'param', data: 'id' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
