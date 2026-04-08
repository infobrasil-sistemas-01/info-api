import { Test, TestingModule } from '@nestjs/testing';
import { EnvService } from './env.service';

jest.mock('./env.schema', () => ({
  envSchema: {
    safeParse: jest.fn().mockReturnValue({ success: true, data: {} }),
  },
}));

describe('EnvService', () => {
  let service: EnvService;

  beforeEach(() => {
    jest.resetModules();
  });

  describe('get', () => {
    it('should return configured value', () => {
      const mockParsed = {
        success: true,
        data: {
          NODE_ENV: 'development',
          HOST: 'localhost',
          PORT: '3000',
          DATABASE_URL: 'postgresql://localhost:5432/test',
          JWT_SECRET: 'test-secret',
          JWT_EXPIRES_IN: '15m',
          REFRESH_TOKEN_DAYS: 30,
          P98: 'p98',
          P99: 'p99',
          P131: 'p131',
          P104: 'p104',
          CRYPTO_ENC: 'enc',
          CRYPTO_IV: 'iv',
          CRYPTO_ALGO: 'aes-256-cbc',
        },
      };

      jest.doMock('./env.schema', () => ({
        envSchema: {
          safeParse: jest.fn().mockReturnValue(mockParsed),
        },
      }));

      const { EnvService: FreshEnvService } = require('./env.service');
      const freshService = new FreshEnvService();

      expect(freshService.get('JWT_SECRET')).toBe('test-secret');
      expect(freshService.get('REFRESH_TOKEN_DAYS')).toBe(30);
    });
  });

  describe('getString', () => {
    it('should return trimmed string', () => {
      const mockParsed = {
        success: true,
        data: {
          NODE_ENV: 'development',
          HOST: '  trimmed  ',
          PORT: '3000',
          DATABASE_URL: 'postgresql://localhost:5432/test',
          JWT_SECRET: 'test-secret',
          JWT_EXPIRES_IN: '15m',
          REFRESH_TOKEN_DAYS: 30,
          P98: 'p98',
          P99: 'p99',
          P131: 'p131',
          P104: 'p104',
          CRYPTO_ENC: 'enc',
          CRYPTO_IV: 'iv',
          CRYPTO_ALGO: 'aes-256-cbc',
        },
      };

      jest.doMock('./env.schema', () => ({
        envSchema: {
          safeParse: jest.fn().mockReturnValue(mockParsed),
        },
      }));

      const { EnvService: FreshEnvService } = require('./env.service');
      const freshService = new FreshEnvService();

      expect(freshService.getString('HOST')).toBe('trimmed');
    });
  });

  describe('getInt', () => {
    it('should return integer value', () => {
      const mockParsed = {
        success: true,
        data: {
          NODE_ENV: 'development',
          HOST: 'localhost',
          PORT: '3000',
          DATABASE_URL: 'postgresql://localhost:5432/test',
          JWT_SECRET: 'test-secret',
          JWT_EXPIRES_IN: '15m',
          REFRESH_TOKEN_DAYS: '30',
          P98: 'p98',
          P99: 'p99',
          P131: 'p131',
          P104: 'p104',
          CRYPTO_ENC: 'enc',
          CRYPTO_IV: 'iv',
          CRYPTO_ALGO: 'aes-256-cbc',
        },
      };

      jest.doMock('./env.schema', () => ({
        envSchema: {
          safeParse: jest.fn().mockReturnValue(mockParsed),
        },
      }));

      const { EnvService: FreshEnvService } = require('./env.service');
      const freshService = new FreshEnvService();

      expect(freshService.getInt('REFRESH_TOKEN_DAYS')).toBe(30);
    });
  });

  describe('isProduction', () => {
    it('should return true when NODE_ENV is production', () => {
      const mockParsed = {
        success: true,
        data: {
          NODE_ENV: 'production',
          HOST: 'localhost',
          PORT: '3000',
          DATABASE_URL: 'postgresql://localhost:5432/test',
          JWT_SECRET: 'test-secret',
          JWT_EXPIRES_IN: '15m',
          REFRESH_TOKEN_DAYS: 30,
          P98: 'p98',
          P99: 'p99',
          P131: 'p131',
          P104: 'p104',
          CRYPTO_ENC: 'enc',
          CRYPTO_IV: 'iv',
          CRYPTO_ALGO: 'aes-256-cbc',
        },
      };

      jest.doMock('./env.schema', () => ({
        envSchema: {
          safeParse: jest.fn().mockReturnValue(mockParsed),
        },
      }));

      const { EnvService: FreshEnvService } = require('./env.service');
      const freshService = new FreshEnvService();

      expect(freshService.isProduction).toBe(true);
    });
  });

  describe('isDevelopment', () => {
    it('should return true when NODE_ENV is development', () => {
      const mockParsed = {
        success: true,
        data: {
          NODE_ENV: 'development',
          HOST: 'localhost',
          PORT: '3000',
          DATABASE_URL: 'postgresql://localhost:5432/test',
          JWT_SECRET: 'test-secret',
          JWT_EXPIRES_IN: '15m',
          REFRESH_TOKEN_DAYS: 30,
          P98: 'p98',
          P99: 'p99',
          P131: 'p131',
          P104: 'p104',
          CRYPTO_ENC: 'enc',
          CRYPTO_IV: 'iv',
          CRYPTO_ALGO: 'aes-256-cbc',
        },
      };

      jest.doMock('./env.schema', () => ({
        envSchema: {
          safeParse: jest.fn().mockReturnValue(mockParsed),
        },
      }));

      const { EnvService: FreshEnvService } = require('./env.service');
      const freshService = new FreshEnvService();

      expect(freshService.isDevelopment).toBe(true);
    });
  });

  describe('FAILING: env validation edge cases', () => {
    let exitMock: jest.Mock;

    beforeEach(() => {
      exitMock = jest.fn();
      Object.defineProperty(process, 'exit', {
        value: exitMock,
        writable: true,
        configurable: true,
      });
    });

    it('should throw error when PORT is not a valid number', () => {
      const mockParsed = {
        success: false,
        data: {},
        error: { format: () => ({ PORT: { _errors: ['Invalid port'] } }) },
      };

      jest.doMock('./env.schema', () => ({
        envSchema: {
          safeParse: jest.fn().mockReturnValue(mockParsed),
        },
      }));

      expect(() => new (require('./env.service').EnvService)()).toThrow();
      expect(exitMock).toHaveBeenCalledWith(1);
    });

    it('should throw error when required env variable is missing', () => {
      const mockParsed = {
        success: false,
        data: {},
        error: { format: () => ({ JWT_SECRET: { _errors: ['Required'] } }) },
      };

      jest.doMock('./env.schema', () => ({
        envSchema: {
          safeParse: jest.fn().mockReturnValue(mockParsed),
        },
      }));

      expect(() => new (require('./env.service').EnvService)()).toThrow();
      expect(exitMock).toHaveBeenCalledWith(1);
    });
  });
});
