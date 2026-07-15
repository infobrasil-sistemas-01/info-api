import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryService } from './delivery.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('DeliveryService', () => {
  let service: DeliveryService;
  let mockTenantConnection: any;

  const mockConnection = {
    query: jest.fn(),
    startTransaction: jest.fn(),
  };

  const mockTransaction = {
    query: jest.fn(),
    commit: jest.fn(),
    rollback: jest.fn(),
  };

  beforeAll(async () => {
    mockTenantConnection = {
      getConnection: jest.fn().mockResolvedValue(mockConnection),
      releaseConnection: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryService,
        { provide: TenantConnectionService, useValue: mockTenantConnection },
      ],
    }).compile();

    service = module.get<DeliveryService>(DeliveryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return paginated deliveries', async () => {
      const mockDeliveries = [
        { VEN_NUMERO: 12345, ENT_NUMERO: 100, PRE_CODIGO: 1 },
        { VEN_NUMERO: 12346, ENT_NUMERO: 101, PRE_CODIGO: 2 },
      ];
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, mockDeliveries);
        },
      );

      const result = await service.get('cred-1', 1, 1, 10);

      expect(result).toEqual(mockDeliveries);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT FIRST ? SKIP ?'),
        expect.arrayContaining([10, 0, 1]),
        expect.any(Function),
      );
    });

    it('should apply situation, vehiclePlate, orderId and status filters when provided', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await service.get('cred-1', 1, 1, 10, {
        situation: 2,
        vehiclePlate: 'ABC-1234',
        orderId: 12345,
        status: 3,
      });

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('AND E.SIT_CODIGO = ?'),
        expect.arrayContaining([2]),
        expect.any(Function),
      );
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('AND E.VEI_PLACA = ?'),
        expect.arrayContaining(['ABC-1234']),
        expect.any(Function),
      );
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('AND E.VEN_NUMERO = ?'),
        expect.arrayContaining([12345]),
        expect.any(Function),
      );
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('AND E.TBS_CODIGO = ?'),
        expect.arrayContaining([3]),
        expect.any(Function),
      );
    });
  });

  describe('getById', () => {
    it('should return delivery with items', async () => {
      const mockDelivery = {
        VEN_NUMERO: 12345,
        ENT_NUMERO: 100,
        PRE_CODIGO: 1,
      };
      const mockItems = [
        {
          ETI_NUMERO: 1,
          IVD_NUMERO: 50,
          VEN_NUMERO: 12345,
          PRO_CODIGO: 'PROD-1',
        },
      ];

      mockConnection.query
        .mockImplementationOnce(
          (query: string, params: any[], callback: Function) => {
            callback(null, [mockDelivery]);
          },
        )
        .mockImplementationOnce(
          (query: string, params: any[], callback: Function) => {
            callback(null, mockItems);
          },
        );

      const result = await service.getById('cred-1', 100, 1);

      expect(result).toEqual({
        ...mockDelivery,
        items: mockItems,
      });

      expect(mockConnection.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('WHERE E.ENT_NUMERO = ?'),
        expect.arrayContaining([100, 1]),
        expect.any(Function),
      );

      expect(mockConnection.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('WHERE EI.VEN_NUMERO = ?'),
        [12345],
        expect.any(Function),
      );
    });

    it('should return null if delivery is not found', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      const result = await service.getById('cred-1', 999, 1);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    const mockDeliveryInput = {
      VEN_NUMERO: 12345,
      PRE_CODIGO: 1,
      SIT_CODIGO: 1,
      USU_CODIGO: 9999,
      ENT_DATA: '2026-05-18',
      ENT_HORA: '14:30:00',
      items: [
        {
          IVD_NUMERO: 50,
          PRO_CODIGO: 'PROD-1',
          ETI_QTDE: 2,
        },
      ],
    };

    beforeEach(() => {
      mockConnection.startTransaction.mockImplementation((callback) => {
        callback(null, mockTransaction);
      });

      mockTransaction.query.mockImplementation((query, params, callback) => {
        if (query.includes('INSERT INTO entregas')) {
          callback(null, { ENT_NUMERO: 100 });
        } else {
          callback(null, {});
        }
      });

      mockTransaction.commit.mockImplementation((callback) => {
        callback(null);
      });

      mockTransaction.rollback.mockImplementation(() => {});
    });

    it('should insert a delivery and its items successfully', async () => {
      const mockDeliveryDetail = {
        VEN_NUMERO: 12345,
        ENT_NUMERO: 100,
        PRE_CODIGO: 1,
      };
      const mockItems = [
        {
          ETI_NUMERO: 1,
          IVD_NUMERO: 50,
          VEN_NUMERO: 12345,
          PRO_CODIGO: 'PROD-1',
          ETI_QTDE: 2,
        },
      ];

      // getById mocks
      mockConnection.query
        .mockImplementationOnce((query, params, callback) => {
          callback(null, [mockDeliveryDetail]);
        })
        .mockImplementationOnce((query, params, callback) => {
          callback(null, mockItems);
        });

      const result = await service.create('cred-1', mockDeliveryInput as any);

      expect(result).toEqual({
        ...mockDeliveryDetail,
        items: mockItems,
      });

      expect(mockConnection.startTransaction).toHaveBeenCalled();
      expect(mockTransaction.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO entregas'),
        expect.any(Array),
        expect.any(Function),
      );
      expect(mockTransaction.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO entregasitens'),
        expect.any(Array),
        expect.any(Function),
      );
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should rollback transaction and throw error if inserting delivery fails', async () => {
      mockTransaction.query.mockImplementation((query, params, callback) => {
        if (query.includes('INSERT INTO entregas')) {
          callback(new Error('Insert error'), null);
        } else {
          callback(null, {});
        }
      });

      await expect(
        service.create('cred-1', mockDeliveryInput as any),
      ).rejects.toThrow('Insert error');

      expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should rollback transaction and throw error if commit fails', async () => {
      mockTransaction.commit.mockImplementation((callback) => {
        callback(new Error('Commit error'));
      });

      await expect(
        service.create('cred-1', mockDeliveryInput as any),
      ).rejects.toThrow('Commit error');

      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });

  describe('getStatus', () => {
    it('should return a list of delivery status', async () => {
      const mockStatus = [
        { TBS_CODIGO: 1, TBS_DESCRICAO: 'PENDENTE', TBS_MOBILE: 'S' },
        { TBS_CODIGO: 2, TBS_DESCRICAO: 'EM ANDAMENTO', TBS_MOBILE: 'N' },
      ];
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, mockStatus);
        },
      );

      const result = await service.getStatus('cred-1');

      expect(result).toEqual(mockStatus);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('FROM tabela_status'),
        [],
        expect.any(Function),
      );
    });

    it('should throw error if query fails', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(new Error('Query error'), null);
        },
      );

      await expect(service.getStatus('cred-1')).rejects.toThrow('Query error');
    });
  });
});
