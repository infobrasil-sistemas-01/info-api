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

  describe('createPool', () => {
    const mockOptions: IConnectionOptions = {
      host: 'localhost',
      port: 3050,
      database: 'test.fdb',
      user: 'sysdba',
      id: 98,
      pageSize: 4096,
    };

    it('should create a pool with decrypted password', () => {
      const mockPool = { get: jest.fn() };
      (firebird.pool as jest.Mock).mockReturnValue(mockPool);

      const result = service.createPool(mockOptions);

      expect(result).toBe(mockPool);
      expect(firebird.pool).toHaveBeenCalledWith(
        5, // default poolSize
        expect.objectContaining({
          host: 'localhost',
          port: 3050,
          database: 'test.fdb',
          user: 'sysdba',
          pageSize: 4096,
        }),
      );
    });

    it('should use specified pool size', () => {
      const mockPool = { get: jest.fn() };
      (firebird.pool as jest.Mock).mockReturnValue(mockPool);

      service.createPool(mockOptions, 10);

      expect(firebird.pool).toHaveBeenCalledWith(10, expect.any(Object));
    });
  });
});
