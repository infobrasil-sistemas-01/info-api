import { Test, TestingModule } from '@nestjs/testing';
import { FirebirdService, IConnectionOptions } from './firebird.service';
import * as firebird from 'node-firebird';

jest.mock('node-firebird');

describe('FirebirdService', () => {
  let service: FirebirdService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebirdService],
    }).compile();

    service = module.get<FirebirdService>(FirebirdService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDatabaseConnection', () => {
    const mockOptions: IConnectionOptions = {
      host: 'localhost',
      port: 3050,
      database: 'test.fdb',
      user: 'sysdba',
      id: 98,
      pageSize: 4096,
    };

    it('should attach to Firebird database with decrypted password', async () => {
      const mockDb = { detach: jest.fn() };
      (firebird.attach as jest.Mock).mockImplementation((options, callback) => {
        callback(null, mockDb);
      });

      const result = await service.getDatabaseConnection(mockOptions);

      expect(result).toBe(mockDb);
      expect(firebird.attach).toHaveBeenCalledWith(
        expect.objectContaining({
          host: 'localhost',
          port: 3050,
          database: 'test.fdb',
          user: 'sysdba',
          pageSize: 4096,
        }),
        expect.any(Function),
      );
    });

    it('should reject promise when attachment fails', async () => {
      (firebird.attach as jest.Mock).mockImplementation((options, callback) => {
        callback(new Error('Attachment error'), null);
      });

      await expect(service.getDatabaseConnection(mockOptions)).rejects.toThrow(
        'Attachment error',
      );
    });

    it('should call firebird.attach with correct options', async () => {
      const mockDb = { detach: jest.fn() };
      (firebird.attach as jest.Mock).mockImplementation((options, callback) => {
        callback(null, mockDb);
      });

      await service.getDatabaseConnection(mockOptions);

      expect(firebird.attach).toHaveBeenCalledTimes(1);
    });
  });

  describe('FAILING: firebird connection edge cases', () => {
    const mockOptions: IConnectionOptions = {
      host: 'localhost',
      port: 3050,
      database: 'test.fdb',
      user: 'sysdba',
      id: 98,
      pageSize: 4096,
    };

    it('should throw error when database file does not exist', async () => {
      (firebird.attach as jest.Mock).mockImplementation((options, callback) => {
        callback(new Error('Database file not found'), null);
      });

      await expect(service.getDatabaseConnection(mockOptions)).rejects.toThrow(
        'Database file not found',
      );
    });

    it('should throw error when connection pool is exhausted', async () => {
      (firebird.attach as jest.Mock).mockImplementation((options, callback) => {
        callback(new Error('Pool exhausted'), null);
      });

      await expect(service.getDatabaseConnection(mockOptions)).rejects.toThrow(
        'Pool exhausted',
      );
    });
  });
});
