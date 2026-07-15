import { Test, TestingModule } from '@nestjs/testing';
import { PlanService } from './plan.service';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { EmailService } from 'src/infra/email/email.service';
import { EnvService } from 'src/config/env/env.service';

describe('PlanService', () => {
  let service: PlanService;
  let mockPrisma: any;
  let mockEmailService: any;
  let mockEnvService: any;

  beforeEach(async () => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
      },
      requestLog: {
        create: jest.fn(),
        count: jest.fn(),
      },
      usageAlertLog: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    };

    mockEmailService = {
      sendEmail: jest.fn().mockResolvedValue({}),
    };

    mockEnvService = {
      get: jest.fn((key: string) => {
        if (key === 'HOST') return 'localhost';
        if (key === 'PORT') return '3000';
        return '';
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanService,
        { provide: RegistryPrismaService, useValue: mockPrisma },
        { provide: EmailService, useValue: mockEmailService },
        { provide: EnvService, useValue: mockEnvService },
      ],
    }).compile();

    service = module.get<PlanService>(PlanService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserLimits', () => {
    it('should return default free limits if user or plan is not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      const limits = await service.getUserLimits('user1');
      expect(limits.name).toEqual('Free');
      expect(limits.reqMonth).toEqual(10000);
    });

    it('should return user plan limits if found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user1',
        plan: {
          name: 'Professional',
          reqMin: 100,
          reqMonth: 50000,
          maxPageSize: 500,
          maxDateRangeDays: 30,
        },
      });
      const limits = await service.getUserLimits('user1');
      expect(limits.name).toEqual('Professional');
      expect(limits.reqMonth).toEqual(50000);
    });
  });

  describe('logRequest', () => {
    it('should log request and check alert if success is true', async () => {
      mockPrisma.requestLog.create.mockResolvedValue({});
      jest.spyOn(service as any, 'checkAndSendUsageAlert').mockResolvedValue(undefined);

      await service.logRequest('user1', 'GET', '/api/products', 200, '127.0.0.1', 50, true);

      expect(mockPrisma.requestLog.create).toHaveBeenCalled();
      expect((service as any).checkAndSendUsageAlert).toHaveBeenCalledWith('user1');
    });
  });

  describe('checkAndSendUsageAlert', () => {
    it('should not send email if user is under 80% usage', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user1',
        user: 'testuser',
        email: 'test@example.com',
        plan: { reqMonth: 10000 },
      });
      mockPrisma.requestLog.count.mockResolvedValue(5000); // 50%

      await (service as any).checkAndSendUsageAlert('user1');

      expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
    });

    it('should send email if user reaches 80% and has not been alerted this month', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user1',
        user: 'testuser',
        email: 'test@example.com',
        plan: { reqMonth: 10000 },
      });
      mockPrisma.requestLog.count.mockResolvedValue(8500); // 85%
      
      // Simulate no alert sent this month
      mockPrisma.usageAlertLog.findFirst.mockResolvedValue(null);
      mockPrisma.usageAlertLog.create.mockResolvedValue({});

      await (service as any).checkAndSendUsageAlert('user1');

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        'test@example.com',
        'Alerta de Uso: Limite de Requisições Mensais Atingido em 80%',
        expect.stringContaining('testuser'),
      );
      expect(mockPrisma.usageAlertLog.create).toHaveBeenCalledWith({
        data: {
          userId: 'user1',
          alertType: 'MONTHLY_80',
        },
      });
    });

    it('should not send email if user is at 80% but was already alerted this month', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user1',
        user: 'testuser',
        email: 'test@example.com',
        plan: { reqMonth: 10000 },
      });
      mockPrisma.requestLog.count.mockResolvedValue(8500);

      // Simulate alert already sent this month
      mockPrisma.usageAlertLog.findFirst.mockResolvedValue({
        id: 'log1',
        userId: 'user1',
        alertType: 'MONTHLY_80',
        sentAt: new Date(),
      });

      await (service as any).checkAndSendUsageAlert('user1');

      expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
    });

    it('should send email if user is at 80% and last alert was sent in a previous month (current month findFirst returns null)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user1',
        user: 'testuser',
        email: 'test@example.com',
        plan: { reqMonth: 10000 },
      });
      mockPrisma.requestLog.count.mockResolvedValue(8500);

      // Simulate no alert sent in the current month (findFirst returns null)
      mockPrisma.usageAlertLog.findFirst.mockResolvedValue(null);
      mockPrisma.usageAlertLog.create.mockResolvedValue({});

      await (service as any).checkAndSendUsageAlert('user1');

      expect(mockEmailService.sendEmail).toHaveBeenCalled();
      expect(mockPrisma.usageAlertLog.create).toHaveBeenCalled();
    });
  });

  describe('getRequestCount', () => {
    it('should query request count for minute timeframe and exclude status 429', async () => {
      mockPrisma.requestLog.count.mockResolvedValue(5);
      const count = await service.getRequestCount('user1', 'minute');
      expect(count).toBe(5);
      expect(mockPrisma.requestLog.count).toHaveBeenCalledWith({
        where: {
          userId: 'user1',
          createdAt: { gte: expect.any(Date) },
          status: { not: 429 },
        },
      });
    });

    it('should query request count for month timeframe and exclude status 429', async () => {
      mockPrisma.requestLog.count.mockResolvedValue(120);
      const count = await service.getRequestCount('user1', 'month');
      expect(count).toBe(120);
      expect(mockPrisma.requestLog.count).toHaveBeenCalledWith({
        where: {
          userId: 'user1',
          createdAt: { gte: expect.any(Date) },
          status: { not: 429 },
        },
      });
    });
  });
});

