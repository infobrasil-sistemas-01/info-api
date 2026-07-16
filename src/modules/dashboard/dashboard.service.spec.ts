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
      user: {
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
      mockPrisma.requestLog.count.mockResolvedValueOnce(12); // currentRpm

      const result = await service.getSummary(start, end);

      expect(result).toEqual({
        totalRequests: 100,
        activeUsers: 2,
        successRate: 90,
        rateLimitHits: 5,
        p95Latency: 16,
        currentRpm: 12,
        averageRpm: 0.07,
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
      expect(mockPrisma.requestLog.count).toHaveBeenCalledTimes(4);
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
      mockPrisma.requestLog.count.mockResolvedValueOnce(0); // currentRpm

      const result = await service.getSummary(start, end);

      expect(result).toEqual({
        totalRequests: 0,
        activeUsers: 0,
        successRate: 100,
        rateLimitHits: 0,
        p95Latency: 0,
        currentRpm: 0,
        averageRpm: 0,
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
        { timestamp: '2026-07-02T12:00:00Z', count: 5, success: 5, clientError: 0, serverError: 0, error: 0 },
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
    it('should return recent HTTP request logs with pagination', async () => {
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
      mockPrisma.$queryRawUnsafe.mockResolvedValueOnce(mockResult); // Data query
      mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ total: 100 }]); // Count query

      const result = await service.getRequestLogs(start, end, 1, 50);

      expect(result).toEqual({
        data: mockResult,
        meta: {
          total: 100,
          page: 1,
          limit: 50,
          totalPages: 2,
        },
      });
      expect(mockPrisma.$queryRawUnsafe).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('LIMIT $3 OFFSET $4'),
        start,
        end,
        50,
        0,
      );
      expect(mockPrisma.$queryRawUnsafe).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('SELECT COUNT(rl.id)'),
        start,
        end,
      );
    });
  });

  describe('getDossierData', () => {
    const start = new Date('2026-07-01');
    const end = new Date('2026-07-02');

    describe('internal dossier', () => {
      it('should return aggregated data for all metrics', async () => {
        // mock for getSummary
        mockPrisma.requestLog.count.mockResolvedValueOnce(100); // Total
        mockPrisma.requestLog.groupBy.mockResolvedValueOnce([]); // Active
        mockPrisma.requestLog.count.mockResolvedValueOnce(95); // Success (2xx)
        mockPrisma.requestLog.count.mockResolvedValueOnce(0); // Rate limits (429)
        mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ p95: 12 }]); // Latency (getSummary)
        mockPrisma.requestLog.count.mockResolvedValueOnce(8); // Current RPM

        // mock for getTopUsers
        mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ userId: '1', totalRequests: 50 }]); 

        // mock for getTopEndpoints
        mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ path: '/test', totalRequests: 50 }]); 

        // mock for getStatusDistribution
        mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ statusClass: '2xx', count: 95 }]); 

        // mock for getDatabaseLoad
        mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ host: 'localhost', database: 'db', totalRequests: 100 }]); 

        // mock for getProactiveAlerts
        mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([]);

        // mock for getPlanDistribution
        mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ planName: 'Bronze', totalRequests: 100 }]);

        // mock for getTimeSeries
        mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ timestamp: '2026-07-01', count: 100, success: 95, clientError: 4, serverError: 1, error: 5 }]);

        // mock for getHeartbeatStatus
        mockPrisma.systemHeartbeat.findUnique.mockResolvedValueOnce({
          service: 'log-processor',
          timestamp: new Date(),
        });

        const result = await service.getDossierData('internal', start, end);

        expect(result.type).toBe('internal');
        expect(result.summary).toBeDefined();
        expect(result.topUsers).toBeDefined();
        expect(result.topEndpoints).toBeDefined();
        expect(result.statusDistribution).toBeDefined();
        expect(result.databaseLoad).toBeDefined();
        expect(result.proactiveAlerts).toBeDefined();
        expect(result.planDistribution).toBeDefined();
        expect(result.timeSeries).toBeDefined();
        expect(result.heartbeat).toBeDefined();
      });
    });

    describe('client dossier', () => {
      it('should throw error if userId is missing', async () => {
        await expect(service.getDossierData('client', start, end)).rejects.toThrow(
          'userId é obrigatório para dossiê do cliente',
        );
      });

      it('should throw error if user does not exist', async () => {
        mockPrisma.user.findUnique.mockResolvedValueOnce(null);
        await expect(service.getDossierData('client', start, end, 'user-id')).rejects.toThrow(
          'Usuário não encontrado',
        );
      });

      it('should return user metrics if user exists', async () => {
        const mockUser = {
          id: 'user-id',
          user: 'test-client',
          email: 'test@client.com',
          status: true,
          plan: {
            name: 'Plano Pro',
            reqMonth: 10000,
          },
        };
        mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);
        mockPrisma.requestLog.count.mockResolvedValueOnce(500); // monthlyRequests count

        // mock for getSummary(userId)
        mockPrisma.requestLog.count.mockResolvedValueOnce(200); // Total
        mockPrisma.requestLog.groupBy.mockResolvedValueOnce([]); // Active
        mockPrisma.requestLog.count.mockResolvedValueOnce(190); // Success (2xx)
        mockPrisma.requestLog.count.mockResolvedValueOnce(2); // Rate limits (429)
        mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ p95: 10 }]); // Latency
        mockPrisma.requestLog.count.mockResolvedValueOnce(15); // Current RPM

        // mock for getTopEndpoints(userId)
        mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ path: '/test', totalRequests: 200 }]);

        // mock for getStatusDistribution(userId)
        mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ statusClass: '2xx', count: 190 }]);

        // mock for getTimeSeries(userId)
        mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ timestamp: '2026-07-01', count: 200, success: 190, clientError: 8, serverError: 2, error: 10 }]);

        const result = await service.getDossierData('client', start, end, 'user-id');

        expect(result.type).toBe('client');
        expect(result.user).toEqual({
          id: 'user-id',
          username: 'test-client',
          email: 'test@client.com',
          status: true,
          planName: 'Plano Pro',
          planReqMonth: 10000,
          monthlyRequests: 500,
        });
        expect(result.summary).toBeDefined();
        expect(result.topEndpoints).toBeDefined();
        expect(result.statusDistribution).toBeDefined();
        expect(result.timeSeries).toBeDefined();
      });
    });
  });
});
