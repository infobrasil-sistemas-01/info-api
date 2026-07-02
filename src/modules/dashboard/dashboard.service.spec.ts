import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let mockPrisma: any;

  beforeEach(async () => {
    mockPrisma = {
      requestLog: {
        count: jest.fn(),
        groupBy: jest.fn(),
      },
      $queryRawUnsafe: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: RegistryPrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSummary', () => {
    it('should return correct summary stats', async () => {
      const start = new Date('2026-07-01');
      const end = new Date('2026-07-02');

      mockPrisma.requestLog.count.mockResolvedValueOnce(100); // Total
      mockPrisma.requestLog.groupBy.mockResolvedValueOnce([{ userId: '1' }, { userId: '2' }]); // Active
      mockPrisma.requestLog.count.mockResolvedValueOnce(90); // Success (2xx)
      mockPrisma.requestLog.count.mockResolvedValueOnce(5); // Rate limits (429)

      const result = await service.getSummary(start, end);

      expect(result).toEqual({
        totalRequests: 100,
        activeUsers: 2,
        successRate: 90,
        rateLimitHits: 5,
      });

      expect(mockPrisma.requestLog.count).toHaveBeenNthCalledWith(1, {
        where: {
          createdAt: { gte: start, lte: end },
          path: { not: { startsWith: '/api/v1/dashboard' } },
        },
      });
      expect(mockPrisma.requestLog.groupBy).toHaveBeenCalledWith({
        by: ['userId'],
        where: {
          createdAt: { gte: start, lte: end },
          path: { not: { startsWith: '/api/v1/dashboard' } },
        },
      });
      expect(mockPrisma.requestLog.count).toHaveBeenCalledTimes(3);
      expect(mockPrisma.requestLog.groupBy).toHaveBeenCalledTimes(1);
    });

    it('should handle division by zero for successRate', async () => {
      const start = new Date('2026-07-01');
      const end = new Date('2026-07-02');

      mockPrisma.requestLog.count.mockResolvedValueOnce(0); // Total
      mockPrisma.requestLog.groupBy.mockResolvedValueOnce([]); // Active
      mockPrisma.requestLog.count.mockResolvedValueOnce(0); // Success (2xx)
      mockPrisma.requestLog.count.mockResolvedValueOnce(0); // Rate limits (429)

      const result = await service.getSummary(start, end);

      expect(result).toEqual({
        totalRequests: 0,
        activeUsers: 0,
        successRate: 100,
        rateLimitHits: 0,
      });
    });
  });

  describe('getTopUsers', () => {
    it('should query top users with custom limit', async () => {
      const start = new Date('2026-07-01');
      const end = new Date('2026-07-02');
      const mockResult = [{ userId: '1', username: 'client1', totalRequests: 50 }];
      mockPrisma.$queryRawUnsafe.mockResolvedValue(mockResult);

      const result = await service.getTopUsers(start, end, 5);

      expect(result).toEqual(mockResult);
      expect(mockPrisma.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining("AND rl.path NOT LIKE '/api/v1/dashboard%'"),
        start,
        end,
        5
      );
    });
  });

  describe('getTopEndpoints', () => {
    it('should query top endpoints with regexp_replace', async () => {
      const start = new Date('2026-07-01');
      const end = new Date('2026-07-02');
      const mockResult = [{ path: '/api/v1/products/:id', totalRequests: 120 }];
      mockPrisma.$queryRawUnsafe.mockResolvedValue(mockResult);

      const result = await service.getTopEndpoints(start, end, 10);

      expect(result).toEqual(mockResult);
      expect(mockPrisma.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining("AND path NOT LIKE '/api/v1/dashboard%'"),
        start,
        end,
        10
      );
    });
  });
});
