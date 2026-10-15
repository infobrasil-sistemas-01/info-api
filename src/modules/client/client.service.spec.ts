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
        expect.stringContaining('C.CLI_CPF_CNPJ'),
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

    it('should search by formatted and clean CPF/CNPJ', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await service.get('cred-1', 1, 1, 10, '123.456.789-01');

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('C.CLI_CPF_CNPJ LIKE ?'),
        expect.arrayContaining(['%123.456.789-01%', '%12345678901%']),
        expect.any(Function),
      );
    });
  });

  describe('getById', () => {
    it('should return client by id', async () => {
      const mockClient = {
        CLI_CODIGO: 1,
        CLI_NOME: 'Test Client',
        MUN_CODIGO: 2304400,
        MUN_NOME: 'FORTALEZA',
      };
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, [mockClient]);
        },
      );

      const result = await service.getById('cred-1', 1, 1);

      expect(result).toEqual(mockClient);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining(
          'LEFT JOIN municipios M ON C.MUN_CODIGO = M.MUN_CODIGO',
        ),
        [1, 1],
        expect.any(Function),
      );
    });

    it('should throw BadRequestException for invalid id', async () => {
      await expect(service.getById('cred-1', 1, NaN as any)).rejects.toThrow(
        BadRequestException,
      );

      await expect(service.getById('cred-1', 1, 0)).rejects.toThrow(
        BadRequestException,
      );

      await expect(service.getById('cred-1', 1, null as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('create', () => {
    it('should insert a new client with required fields and leave optional fields as null', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, { CLI_CODIGO: 99 });
        },
      );

      const payload = {
        LOJ_CODIGO: 1,
        CLI_NOME: 'New Client',
        CLI_SITUACAO: 'A',
        CLI_UF: 'CE',
        MUN_CODIGO: 2302404,
      } as any;
      const result = await service.create('cred-1', 1, payload);

      expect(result).toEqual({ CLI_CODIGO: 99 });
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO clientes'),
        [
          1,
          'New Client',
          'A',
          'CE',
          2302404,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        expect.any(Function),
      );
    });

    it('should insert a new client with all fields provided', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, { CLI_CODIGO: 100 });
        },
      );

      const payload = {
        LOJ_CODIGO: 2,
        CLI_NOME: 'Complete Client',
        CLI_SITUACAO: 'A',
        CLI_UF: 'SP',
        MUN_CODIGO: 3550308,
        CLI_FANTASIA: 'Fantasia Teste',
        CLI_SEXO: 'F',
        CLI_ENDERECO: 'Rua Teste, 100',
        CLI_COMPL_ENDERECO: 'Apto 1',
        CLI_CEP: '01001-000',
        CLI_BAIRRO: 'Centro',
        CLI_FONE: '1133334444',
        CLI_CELULAR: '11999998888',
        CLI_EMAIL: 'cliente@teste.com',
        CLI_DATANASC: '1990-05-20',
        CLI_CPF_CNPJ: '12345678901',
        CLI_IDENTIDADE: 'MG123456',
        CLI_MAE: 'Mae Teste',
        CLI_PAI: 'Pai Teste',
        CLI_ESTADOCIVIL: 'C',
        CLI_NATURALIDADE: 'São Paulo',
        ROT_CODIGO: 5,
      };

      const result = await service.create('cred-1', 2, payload);

      expect(result).toEqual({ CLI_CODIGO: 100 });
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO clientes'),
        [
          2,
          'Complete Client',
          'A',
          'SP',
          3550308,
          'Fantasia Teste',
          'F',
          'Rua Teste, 100',
          'Apto 1',
          '01001-000',
          'Centro',
          '1133334444',
          '11999998888',
          'cliente@teste.com',
          '1990-05-20',
          '12345678901',
          'MG123456',
          'Mae Teste',
          'Pai Teste',
          'C',
          'São Paulo',
          5,
        ],
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
        expect.any(Function),
      );
    });

    it('should throw NotFoundException if client does not exist', async () => {
      // Mock getById retorna undefined
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []); // Vazio
        },
      );

      await expect(
        service.update('cred-1', 1, 999, { CLI_NOME: 'test' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if id is invalid in update', async () => {
      await expect(
        service.update('cred-1', 1, NaN as any, { CLI_NOME: 'test' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
