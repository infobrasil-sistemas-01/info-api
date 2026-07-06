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
      systemHeartbeat: {
        findUnique: jest.fn(),
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
      mockPrisma.requestLog.groupBy.mockResolvedValueOnce([
        { userId: '1' },
        { userId: '2' },
      ]); // Active
      mockPrisma.requestLog.count.mockResolvedValueOnce(90); // Success (2xx)
      mockPrisma.requestLog.count.mockResolvedValueOnce(5); // Rate limits (429)
      mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ p95: 15.5 }]); // p95 latency

      const result = await service.getSummary(start, end);

      expect(result).toEqual({
        totalRequests: 100,
        activeUsers: 2,
        successRate: 90,
        rateLimitHits: 5,
        p95Latency: 16,
      });

      expect(mockPrisma.requestLog.count).toHaveBeenNthCalledWith(1, {
        where: {
          createdAt: { gte: start, lte: end },
          NOT: [
            { path: { startsWith: '/api/v1/dashboard' } },
            { path: { startsWith: '/api/v1/newsletter' } },
          ],
        },
      });
      expect(mockPrisma.requestLog.groupBy).toHaveBeenCalledWith({
        by: ['userId'],
        where: {
          createdAt: { gte: start, lte: end },
          NOT: [
            { path: { startsWith: '/api/v1/dashboard' } },
            { path: { startsWith: '/api/v1/newsletter' } },
          ],
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
      mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([]); // Latency

      const result = await service.getSummary(start, end);

      expect(result).toEqual({
        totalRequests: 0,
        activeUsers: 0,
        successRate: 100,
        rateLimitHits: 0,
        p95Latency: 0,
      });
    });
  });

  describe('getTopUsers', () => {
    it('should query top users with custom limit', async () => {
      const start = new Date('2026-07-01');
      const end = new Date('2026-07-02');
      const mockResult = [
        { userId: '1', username: 'client1', totalRequests: 50 },
      ];
      mockPrisma.$queryRawUnsafe.mockResolvedValue(mockResult);

      const result = await service.getTopUsers(start, end, 5);

      expect(result).toEqual(mockResult);
      expect(mockPrisma.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining("AND rl.path NOT LIKE '/api/v1/dashboard%'"),
        start,
        end,
        5,
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
        10,
      );
    });
  });

  describe('getTimeSeries', () => {
    it('should calculate intervals and query time series data', async () => {
      const start = new Date('2026-07-02T12:00:00Z');
      const end = new Date('2026-07-02T13:00:00Z'); // 1 hour difference -> interval 1m
      const mockResult = [
        { timestamp: '2026-07-02T12:00:00Z', count: 5, success: 5, error: 0 },
      ];
      mockPrisma.$queryRawUnsafe.mockResolvedValue(mockResult);

      const result = await service.getTimeSeries(start, end);

      expect(result).toEqual(mockResult);
      expect(mockPrisma.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining("DATE_TRUNC('minute', created_at)"),
        start,
        end,
      );
    });

    it('should respect custom interval when provided', async () => {
      const start = new Date('2026-07-02T12:00:00Z');
      const end = new Date('2026-07-02T13:00:00Z');
      mockPrisma.$queryRawUnsafe.mockResolvedValue([]);

      await service.getTimeSeries(start, end, '15m');

      expect(mockPrisma.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('floor(extract(epoch from created_at) / 900)'),
        start,
        end,
      );
    });
  });

  describe('getHeartbeatStatus', () => {
    it('should return ACTIVE if heartbeat timestamp is recent', async () => {
      const recentDate = new Date();
      mockPrisma.systemHeartbeat.findUnique.mockResolvedValueOnce({
        service: 'log-processor',
        timestamp: recentDate,
      });

      const result = await service.getHeartbeatStatus();
      expect(result).toEqual({
        status: 'ACTIVE',
        lastSeen: recentDate,
      });
      expect(mockPrisma.systemHeartbeat.findUnique).toHaveBeenCalledWith({
        where: { service: 'log-processor' },
      });
    });

    it('should return INACTIVE if heartbeat timestamp is old', async () => {
      const oldDate = new Date(Date.now() - 5 * 60 * 1000); // 5 mins ago
      mockPrisma.systemHeartbeat.findUnique.mockResolvedValueOnce({
        service: 'log-processor',
        timestamp: oldDate,
      });

      const result = await service.getHeartbeatStatus();
      expect(result).toEqual({
        status: 'INACTIVE',
        lastSeen: oldDate,
      });
    });

    it('should return INACTIVE if no heartbeat record found', async () => {
      mockPrisma.systemHeartbeat.findUnique.mockResolvedValueOnce(null);

      const result = await service.getHeartbeatStatus();
      expect(result).toEqual({
        status: 'INACTIVE',
        lastSeen: null,
      });
    });
  });

  describe('getRequestLogs', () => {
    it('should return recent HTTP request logs', async () => {
      const start = new Date('2026-07-01');
      const end = new Date('2026-07-02');
      const mockResult = [
        {
          timestamp: '2026-07-02T12:00:00Z',
          method: 'GET',
          path: '/api/v1/receipts',
          status: 200,
          durationMs: 15.4,
          username: 'admin',
          email: 'admin@test.com',
        },
      ];
      mockPrisma.$queryRawUnsafe.mockResolvedValueOnce(mockResult);

      const result = await service.getRequestLogs(start, end, 50);

      expect(result).toEqual(mockResult);
      expect(mockPrisma.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('FROM request_logs rl'),
        start,
        end,
        50,
      );
    });
  });
});
