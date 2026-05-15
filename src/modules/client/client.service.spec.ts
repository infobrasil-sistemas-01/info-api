import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ClientService } from './client.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('ClientService', () => {
  let service: ClientService;
  let mockTenantConnection: any;

  const mockConnection = {
    query: jest.fn(),
  };

  beforeAll(async () => {
    mockTenantConnection = {
      getConnection: jest.fn().mockResolvedValue(mockConnection),
      releaseConnection: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        { provide: TenantConnectionService, useValue: mockTenantConnection },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return paginated clients', async () => {
      const mockClients = [{ CLI_CODIGO: 1, CLI_NOME: 'Client 1' }];
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, mockClients);
        },
      );

      const result = await service.get('cred-1', 1, 1, 10);

      expect(result).toEqual(mockClients);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT FIRST ? SKIP ?'),
        expect.arrayContaining([10, 0, 1]),
        expect.any(Function),
      );
    });

    it('should apply filters when provided', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await service.get('cred-1', 1, 1, 10, 'abc', 'A', '2000-01-01');

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('CLI_SITUACAO = ?'),
        expect.arrayContaining(['A', '2000-01-01', '%abc%']),
        expect.any(Function),
      );
    });
  });

  describe('getById', () => {
    it('should return client by id', async () => {
      const mockClient = { CLI_CODIGO: 1, CLI_NOME: 'Test Client' };
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, [mockClient]);
        },
      );

      const result = await service.getById('cred-1', 1, 1);

      expect(result).toEqual(mockClient);
    });
  });

  describe('create', () => {
    it('should insert a new client', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, { CLI_CODIGO: 99 });
        },
      );

      const payload = { CLI_NOME: 'New Client' } as any;
      const result = await service.create('cred-1', 1, payload);

      expect(result).toEqual({ CLI_CODIGO: 99 });
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO clientes'),
        expect.arrayContaining([1, 'New Client']),
        expect.any(Function),
      );
    });
  });

  describe('update', () => {
    it('should update existing client', async () => {
      // Mock para getById usado no update
      mockConnection.query.mockImplementationOnce(
        (query: string, params: any[], callback: Function) => {
          callback(null, [{ CLI_CODIGO: 1, CLI_NOME: 'Old Name' }]);
        },
      );
      
      // Mock para UPDATE
      mockConnection.query.mockImplementationOnce(
        (query: string, params: any[], callback: Function) => {
          callback(null, true);
        },
      );

      // Mock para getById no final
      mockConnection.query.mockImplementationOnce(
        (query: string, params: any[], callback: Function) => {
          callback(null, [{ CLI_CODIGO: 1, CLI_NOME: 'Updated Name' }]);
        },
      );

      const payload = { CLI_NOME: 'Updated Name' } as any;
      const result = await service.update('cred-1', 1, 1, payload);

      expect(result).toEqual({ CLI_CODIGO: 1, CLI_NOME: 'Updated Name' });
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE clientes SET CLI_NOME = ?'),
        ['Updated Name', 1, 1],
        expect.any(Function)
      );
    });

    it('should throw NotFoundException if client does not exist', async () => {
      // Mock getById retorna undefined
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []); // Vazio
        },
      );

      await expect(service.update('cred-1', 1, 999, { CLI_NOME: 'test' })).rejects.toThrow(NotFoundException);
    });
  });
});
