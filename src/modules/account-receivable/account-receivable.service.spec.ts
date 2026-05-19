import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AccountReceivableService } from './account-receivable.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('AccountReceivableService', () => {
  let service: AccountReceivableService;
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
        AccountReceivableService,
        { provide: TenantConnectionService, useValue: mockTenantConnection },
      ],
    }).compile();

    service = module.get<AccountReceivableService>(AccountReceivableService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    beforeEach(() => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, [
          {
            cli_codigo: 1,
            cli_nome: 'Cliente Teste',
            rec_numero: 10,
            rec_situacao: 'A',
            rec_datavenc: '2024-06-01',
            rec_valor: 150.0,
          },
        ]);
      });
    });

    it('should return account receivables with clientId filter', async () => {
      const result = await service.get('cred-1', 1, 1, 10, 42);

      expect(result).toBeDefined();
      expect(mockConnection.query).toHaveBeenCalled();
    });

    it('should return account receivables with arId filter', async () => {
      const result = await service.get('cred-1', 1, 1, 10, undefined, 10);

      expect(result).toBeDefined();
    });

    it('should return account receivables with situation filter', async () => {
      const result = await service.get('cred-1', 1, 1, 10, undefined, undefined, 'A');

      expect(result).toBeDefined();
    });

    it('should return account receivables with date range filter', async () => {
      const result = await service.get(
        'cred-1',
        1,
        1,
        10,
        undefined,
        undefined,
        undefined,
        '2024-01-01',
        '2024-12-31',
      );

      expect(result).toBeDefined();
    });

    it('should build query with situation parameter', async () => {
      await service.get('cred-1', 1, 1, 10, undefined, undefined, 'L');

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('rec.rec_situacao = ?'),
        expect.arrayContaining(['L']),
        expect.any(Function),
      );
    });

    it('should build query with clientId parameter', async () => {
      await service.get('cred-1', 1, 1, 10, 99);

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('rec.cli_codigo = ?'),
        expect.arrayContaining([99]),
        expect.any(Function),
      );
    });

    it('should build query with arId parameter', async () => {
      await service.get('cred-1', 1, 1, 10, undefined, 55);

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('rec.rec_numero = ?'),
        expect.arrayContaining([55]),
        expect.any(Function),
      );
    });

    it('should build query with date range parameters', async () => {
      await service.get(
        'cred-1',
        1,
        1,
        10,
        undefined,
        undefined,
        undefined,
        '2024-01-01',
        '2024-12-31',
      );

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('rec.rec_datavenc BETWEEN ? AND ?'),
        expect.arrayContaining(['2024-01-01', '2024-12-31']),
        expect.any(Function),
      );
    });

    it('should calculate correct pagination skip for page 1', async () => {
      await service.get('cred-1', 1, 1, 25, 1);

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining([25, 0, 1]),
        expect.any(Function),
      );
    });

    it('should calculate correct pagination skip for page 3', async () => {
      await service.get('cred-1', 1, 3, 25, 1);

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining([25, 50, 1]),
        expect.any(Function),
      );
    });

    it('should throw BadRequestException when page is less than 1', async () => {
      await expect(service.get('cred-1', 1, 0, 10)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.get('cred-1', 1, 0, 10)).rejects.toThrow(
        'A página deve ser maior ou igual a 1',
      );
    });

    it('should throw BadRequestException when page is greater than 100', async () => {
      await expect(service.get('cred-1', 1, 101, 10)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.get('cred-1', 1, 101, 10)).rejects.toThrow(
        'A página deve ser menor ou igual a 100',
      );
    });

    it('should throw BadRequestException when no filter is provided', async () => {
      await expect(service.get('cred-1', 1, 1, 10)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.get('cred-1', 1, 1, 10)).rejects.toThrow(
        'Pelo menos um filtro deve ser informado',
      );
    });

    it('should throw BadRequestException for invalid situation value', async () => {
      await expect(
        service.get('cred-1', 1, 1, 10, undefined, undefined, 'X'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.get('cred-1', 1, 1, 10, undefined, undefined, 'X'),
      ).rejects.toThrow('Situação inválida! Valores aceitos: A (Aberto) ou L (Liquidado)');
    });

    it('should accept situation "A" as valid', async () => {
      await expect(
        service.get('cred-1', 1, 1, 10, undefined, undefined, 'A'),
      ).resolves.toBeDefined();
    });

    it('should accept situation "L" as valid', async () => {
      await expect(
        service.get('cred-1', 1, 1, 10, undefined, undefined, 'L'),
      ).resolves.toBeDefined();
    });

    it('should throw BadRequestException for invalid startDate', async () => {
      await expect(
        service.get('cred-1', 1, 1, 10, undefined, undefined, undefined, 'invalid-date'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.get('cred-1', 1, 1, 10, undefined, undefined, undefined, 'invalid-date'),
      ).rejects.toThrow('Data inicial inválida');
    });

    it('should throw BadRequestException for invalid endDate', async () => {
      await expect(
        service.get('cred-1', 1, 1, 10, undefined, undefined, undefined, undefined, 'not-a-date'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.get('cred-1', 1, 1, 10, undefined, undefined, undefined, undefined, 'not-a-date'),
      ).rejects.toThrow('Data final inválida');
    });

    it('should throw BadRequestException when startDate is provided without endDate', async () => {
      await expect(
        service.get('cred-1', 1, 1, 10, undefined, undefined, undefined, '2024-01-01'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.get('cred-1', 1, 1, 10, undefined, undefined, undefined, '2024-01-01'),
      ).rejects.toThrow('Data final é obrigatória quando a data inicial é informada');
    });

    it('should throw BadRequestException when endDate is provided without startDate', async () => {
      await expect(
        service.get('cred-1', 1, 1, 10, undefined, undefined, undefined, undefined, '2024-12-31'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.get('cred-1', 1, 1, 10, undefined, undefined, undefined, undefined, '2024-12-31'),
      ).rejects.toThrow('Data inicial é obrigatória quando a data final é informada');
    });

    it('should throw error when query fails', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(new Error('Query error'), null);
      });

      await expect(service.get('cred-1', 1, 1, 10, 1)).rejects.toThrow('Query error');
    });
  });
});
