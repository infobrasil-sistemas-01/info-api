import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptService } from './receipt.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('ReceiptService', () => {
  let service: ReceiptService;
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

  beforeEach(async () => {
    mockTenantConnection = {
      getConnection: jest.fn().mockResolvedValue(mockConnection),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceiptService,
        { provide: TenantConnectionService, useValue: mockTenantConnection },
      ],
    }).compile();

    service = module.get<ReceiptService>(ReceiptService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('post', () => {
    it('should create receipt successfully', async () => {
      mockConnection.startTransaction.mockImplementation(
        (callback: Function) => {
          callback(null, mockTransaction);
        },
      );

      mockTransaction.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, [{ ID: 456 }]);
        },
      );

      mockTransaction.commit.mockImplementation((callback: Function) => {
        callback(null);
      });

      const result = await service.post('cred-1', 1, 123);

      expect(result).toEqual({ ID: 456 });
    });

    it('should rollback transaction on query error', async () => {
      mockConnection.startTransaction.mockImplementation(
        (callback: Function) => {
          callback(null, mockTransaction);
        },
      );

      mockTransaction.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(new Error('Query error'));
        },
      );

      mockTransaction.rollback.mockImplementation((callback?: Function) => {
        if (callback) callback();
      });

      await expect(service.post('cred-1', 1, 123)).rejects.toThrow(
        'Query error',
      );
    });
  });

  describe('FAILING: receipt edge cases', () => {
    it('should throw error when order does not exist', async () => {
      mockConnection.startTransaction.mockImplementation(
        (callback: Function) => {
          callback(null, mockTransaction);
        },
      );

      mockTransaction.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, [{ ID: 0 }]);
        },
      );

      await expect(service.post('cred-1', 1, 99999)).rejects.toThrow(
        'Order not found',
      );
    });

    it('should throw error when commit fails after query', async () => {
      mockConnection.startTransaction.mockImplementation(
        (callback: Function) => {
          callback(null, mockTransaction);
        },
      );

      mockTransaction.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, [{ ID: 456 }]);
        },
      );

      mockTransaction.commit.mockImplementation((callback: Function) => {
        callback(new Error('Commit failed'));
      });

      await expect(service.post('cred-1', 1, 123)).rejects.toThrow(
        'Commit failed',
      );
    });
  });
});
