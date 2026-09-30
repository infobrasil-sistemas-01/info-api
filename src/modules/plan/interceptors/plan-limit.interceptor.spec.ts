import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { of } from 'rxjs';
import { PlanLimitInterceptor } from './plan-limit.interceptor';
import { PlanService } from '../plan.service';
import { SKIP_DATE_RANGE_LIMIT_KEY } from '../decorators/skip-date-range-limit.decorator';

describe('PlanLimitInterceptor', () => {
  let interceptor: PlanLimitInterceptor;
  let mockPlanService: jest.Mocked<PlanService>;
  let mockReflector: jest.Mocked<Reflector>;

  const mockNext = {
    handle: jest.fn().mockReturnValue(of({ success: true })),
  };

  const defaultLimits = {
    reqMin: 60,
    reqMonth: 10000,
    maxPageSize: 100,
    maxDateRangeDays: 7,
  };

  const createMockContext = (
    url: string = '/api/v1/orders',
    query: any = {},
    user: any = { sub: 'user-1' },
  ): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          url,
          method: 'GET',
          query,
          user,
          ip: '127.0.0.1',
        }),
        getResponse: () => ({
          statusCode: 200,
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    mockPlanService = {
      getUserLimits: jest.fn().mockResolvedValue(defaultLimits),
      getRequestCount: jest.fn().mockResolvedValue(0),
      logRequest: jest.fn().mockResolvedValue(undefined),
    } as any;

    mockReflector = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    } as any;

    interceptor = new PlanLimitInterceptor(mockPlanService, mockReflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Date Range Limiting', () => {
    it('should throw FORBIDDEN when date range exceeds maxDateRangeDays and skip is false', async () => {
      const context = createMockContext('/api/v1/orders', {
        startDate: '2026-09-01',
        endDate: '2026-09-30', // 29 days diff > 7 days
      });

      mockReflector.getAllAndOverride.mockReturnValue(false);

      await expect(interceptor.intercept(context, mockNext)).rejects.toThrow(
        new HttpException(
          `Seu plano permite consultas de no máximo 7 dias. Intervalo solicitado: 29 dias.`,
          HttpStatus.FORBIDDEN,
        ),
      );
    });

    it('should allow request when date range exceeds maxDateRangeDays but SkipDateRangeLimit is active', async () => {
      const context = createMockContext('/api/v1/orders/order-metrics', {
        startDate: '2026-09-01',
        endDate: '2026-09-30', // 29 days diff > 7 days
      });

      mockReflector.getAllAndOverride.mockImplementation((key) => {
        if (key === SKIP_DATE_RANGE_LIMIT_KEY) return true;
        return false;
      });

      const result$ = await interceptor.intercept(context, mockNext);
      await new Promise((resolve) => result$.subscribe(resolve));

      expect(mockNext.handle).toHaveBeenCalled();
    });

    it('should allow request when date range is within maxDateRangeDays', async () => {
      const context = createMockContext('/api/v1/orders', {
        startDate: '2026-09-01',
        endDate: '2026-09-05', // 4 days <= 7 days
      });

      mockReflector.getAllAndOverride.mockReturnValue(false);

      const result$ = await interceptor.intercept(context, mockNext);
      await new Promise((resolve) => result$.subscribe(resolve));

      expect(mockNext.handle).toHaveBeenCalled();
    });
  });
});
