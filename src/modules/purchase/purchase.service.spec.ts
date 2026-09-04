import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseService } from './purchase.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { BadRequestException } from '@nestjs/common';

describe('PurchaseService', () => {
  let service: PurchaseService;
  let mockTenantConnectionService: any;
  let mockConnection: any;

  beforeEach(async () => {
    mockConnection = {
      query: jest.fn(),
    };

    mockTenantConnectionService = {
      getConnection: jest.fn().mockResolvedValue(mockConnection),
      releaseConnection: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseService,
        {
          provide: TenantConnectionService,
          useValue: mockTenantConnectionService,
        },
      ],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('deve retornar lista de compras com sucesso', async () => {
      const mockResult = [
        {
          COM_NUMERO: 1,
          COM_DATA: '2026-08-15',
          LOJ_CODIGO: 1,
          CRE_CODIGO: 10,
          CRE_NOME: 'FORNECEDOR TESTE',
          COM_NUMERONF: '12345',
          COM_VRTOTALNF: 1500.5,
        },
      ];

      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, mockResult);
      });

      const result = await service.get('cred-1', { page: 1, pageSize: 10 });

      expect(result).toEqual(mockResult);
      expect(mockTenantConnectionService.getConnection).toHaveBeenCalledWith(
        'cred-1',
      );
      expect(
        mockTenantConnectionService.releaseConnection,
      ).toHaveBeenCalledWith(mockConnection);
    });

    it('deve aplicar filtros opcionais corretamente na query', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(null, []);
      });

      await service.get('cred-1', {
        page: 2,
        pageSize: 20,
        storeId: 2,
        supplierId: 45,
        invoiceNumber: '999',
        nfeKey: '23260812345678000195550010001234561001234567',
        startDate: '2026-01-01',
        endDate: '2026-01-31',
      });

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('COM.LOJ_CODIGO = ?'),
        expect.arrayContaining([
          20,
          20,
          2,
          45,
          '%999%',
          '23260812345678000195550010001234561001234567',
          '2026-01-01',
          '2026-01-31',
        ]),
        expect.any(Function),
      );
    });

    it('deve lançar BadRequestException se apenas startDate ou endDate for fornecido', async () => {
      await expect(
        service.get('cred-1', { startDate: '2026-01-01' }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        service.get('cred-1', { endDate: '2026-01-31' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar erro se connection.query falhar', async () => {
      mockConnection.query.mockImplementation((query, params, callback) => {
        callback(new Error('Database error'), null);
      });

      await expect(service.get('cred-1', {})).rejects.toThrow('Database error');
      expect(
        mockTenantConnectionService.releaseConnection,
      ).toHaveBeenCalledWith(mockConnection);
    });
  });
});
