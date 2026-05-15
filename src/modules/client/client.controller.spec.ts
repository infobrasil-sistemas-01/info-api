import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';

describe('ClientController', () => {
  let controller: ClientController;
  let clientService: jest.Mocked<ClientService>;

  const mockClientService = {
    get: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockReq = {
    credentials_id: 'cred-1',
    store_id: 1,
  } as any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [{ provide: ClientService, useValue: mockClientService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ClientController>(ClientController);
    clientService = module.get(ClientService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should call clientService.get with all parameters', async () => {
      mockClientService.get.mockResolvedValue([{ CLI_CODIGO: 1 }]);

      const result = await controller.get(
        mockReq,
        {
          page: 2,
          pageSize: 20,
          search: 'search',
          situation: 'A',
          birthdate: '2000-01-01'
        }
      );

      expect(clientService.get).toHaveBeenCalledWith(
        'cred-1',
        1,
        2,
        20,
        'search',
        'A',
        '2000-01-01'
      );
      expect(result).toEqual([{ CLI_CODIGO: 1 }]);
    });
  });

  describe('getById', () => {
    it('should call clientService.getById with id', async () => {
      const mockClient = { CLI_CODIGO: 123, CLI_NOME: 'Cli 1' };
      mockClientService.getById.mockResolvedValue(mockClient);

      const result = await controller.getById(mockReq, 123);

      expect(clientService.getById).toHaveBeenCalledWith(
        'cred-1',
        1,
        123
      );
      expect(result).toEqual(mockClient);
    });
  });

  describe('create', () => {
    it('should call clientService.create', async () => {
      const mockResult = { CLI_CODIGO: 99 };
      mockClientService.create.mockResolvedValue(mockResult);

      const payload = { CLI_NOME: 'Test' } as any;
      const result = await controller.create(mockReq, payload);

      expect(clientService.create).toHaveBeenCalledWith('cred-1', 1, payload);
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('should call clientService.update', async () => {
      const mockResult = { CLI_CODIGO: 123, CLI_NOME: 'Updated' };
      mockClientService.update.mockResolvedValue(mockResult);

      const payload = { CLI_NOME: 'Updated' } as any;
      const result = await controller.update(mockReq, 123, payload);

      expect(clientService.update).toHaveBeenCalledWith('cred-1', 1, 123, payload);
      expect(result).toEqual(mockResult);
    });
  });
});
