import { GlobalLoggerService } from './logger.service';
import * as Sentry from '@sentry/node';

jest.mock('@sentry/node', () => ({
  withScope: jest.fn((callback) =>
    callback({ setTag: jest.fn(), setExtra: jest.fn(), setUser: jest.fn() }),
  ),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  logger: {
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('GlobalLoggerService', () => {
  let loggerService: GlobalLoggerService;

  beforeEach(() => {
    loggerService = new GlobalLoggerService();
    jest.clearAllMocks();
  });

  describe('error', () => {
    it('should handle error when stack is passed as an Error instance without throwing stack.split is not a function', () => {
      const errorInstance = new Error('Test error');
      expect(() => {
        loggerService.error('Log message', errorInstance, 'TestContext');
      }).not.toThrow();

      expect(Sentry.captureException).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Log message',
        }),
      );
    });

    it('should handle error when stack is passed as a plain object without throwing', () => {
      const errorObject = { customField: 'value' };
      expect(() => {
        loggerService.error('Log message', errorObject, 'TestContext');
      }).not.toThrow();

      expect(Sentry.captureException).toHaveBeenCalled();
    });

    it('should handle error when stack is passed as a string', () => {
      expect(() => {
        loggerService.error(
          'Log message',
          'Error: trace at line 1',
          'TestContext',
        );
      }).not.toThrow();

      expect(Sentry.captureException).toHaveBeenCalled();
    });

    it('should handle error when message is an Error instance', () => {
      const errorInstance = new Error('Direct error message');
      expect(() => {
        loggerService.error(errorInstance);
      }).not.toThrow();

      expect(Sentry.captureException).toHaveBeenCalledWith(errorInstance);
    });
  });
});
