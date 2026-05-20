import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AccountPayableService } from './account-payable.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('AccountPayableService', () => {
  let service: AccountPayableService;
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
        AccountPayableService,
        { provide: TenantConnectionService, useValue: mockTenantConnection },
      ],
    }).compile();

    service = module.get<AccountPayableService>(AccountPayableService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return paginated account payables', async () => {
      const mockResult = [{ PAG_NUMERO: 1 }];
      mockConnection.query.mockImplementation((query, params, cb) =>
        cb(null, mockResult),
      );

      const result = await service.get('cred-1', 1, 10);
      expect(result).toEqual(mockResult);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT FIRST ? SKIP ?'),
        expect.arrayContaining([10, 0]),
        expect.any(Function),
      );
    });

    it('should throw error when situation is invalid', async () => {
      await expect(
        service.get('cred-1', 1, 10, undefined, undefined, 'X'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error when only startDate is provided', async () => {
      await expect(
        service.get(
          'cred-1',
          1,
          10,
          undefined,
          undefined,
          undefined,
          '2024-01-01',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getById', () => {
    it('should return a specific account payable', async () => {
      const mockResult = [{ PAG_NUMERO: 1 }];
      mockConnection.query.mockImplementation((query, params, cb) =>
        cb(null, mockResult),
      );

      const result = await service.getById('cred-1', 1);
      expect(result).toEqual(mockResult[0]);
    });

    it('should throw NotFoundException if account payable is not found', async () => {
      mockConnection.query.mockImplementation((query, params, cb) =>
        cb(null, []),
      );

      await expect(service.getById('cred-1', 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
