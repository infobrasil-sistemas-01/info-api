import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { EmailService } from 'src/infra/email/email.service';
import { EnvService } from 'src/config/env/env.service';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let mockPrisma: any;
  let mockEmailService: any;
  let mockEnvService: any;

  beforeEach(async () => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      plan: {
        findUnique: jest.fn(),
      },
      requestLog: {
        deleteMany: jest.fn().mockResolvedValue({ count: 10 }),
      },
      usageAlertLog: {
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    };

    mockEmailService = {
      sendEmail: jest.fn().mockResolvedValue(true),
    };

    mockEnvService = {
      get: jest.fn().mockReturnValue('development'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: RegistryPrismaService, useValue: mockPrisma },
        { provide: EmailService, useValue: mockEmailService },
        { provide: EnvService, useValue: mockEnvService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('update', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.update('user-1', { status: false })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should reset monthly requests when transitioning from free plan (null) to paid plan', async () => {
      const freeUser = {
        id: 'user-1',
        planId: null,
        plan: null,
      };

      const paidPlan = {
        id: 'plan-paid-1',
        name: 'Pro',
        price: '99.90',
      };

      mockPrisma.user.findUnique.mockResolvedValue(freeUser);
      mockPrisma.plan.findUnique.mockResolvedValue(paidPlan);
      mockPrisma.user.update.mockResolvedValue({ id: 'user-1', user: 'test' });

      await service.update('user-1', { planId: 'plan-paid-1' });

      expect(mockPrisma.requestLog.deleteMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          createdAt: { gte: expect.any(Date) },
        },
      });

      expect(mockPrisma.usageAlertLog.deleteMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          sentAt: { gte: expect.any(Date) },
        },
      });

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-1' },
          data: { planId: 'plan-paid-1' },
        }),
      );
    });

    it('should reset monthly requests when transitioning from free plan (price=0) to paid plan', async () => {
      const freeUser = {
        id: 'user-1',
        planId: 'plan-free',
        plan: { id: 'plan-free', name: 'Free', price: '0.00' },
      };

      const paidPlan = {
        id: 'plan-paid-1',
        name: 'Enterprise',
        price: '299.90',
      };

      mockPrisma.user.findUnique.mockResolvedValue(freeUser);
      mockPrisma.plan.findUnique.mockResolvedValue(paidPlan);
      mockPrisma.user.update.mockResolvedValue({ id: 'user-1', user: 'test' });

      await service.update('user-1', { planId: 'plan-paid-1' });

      expect(mockPrisma.requestLog.deleteMany).toHaveBeenCalled();
      expect(mockPrisma.usageAlertLog.deleteMany).toHaveBeenCalled();
    });

    it('should NOT reset monthly requests when transitioning from paid plan to another paid plan', async () => {
      const paidUser = {
        id: 'user-1',
        planId: 'plan-paid-1',
        plan: { id: 'plan-paid-1', name: 'Basic', price: '49.90' },
      };

      const newPaidPlan = {
        id: 'plan-paid-2',
        name: 'Enterprise',
        price: '299.90',
      };

      mockPrisma.user.findUnique.mockResolvedValue(paidUser);
      mockPrisma.plan.findUnique.mockResolvedValue(newPaidPlan);
      mockPrisma.user.update.mockResolvedValue({ id: 'user-1', user: 'test' });

      await service.update('user-1', { planId: 'plan-paid-2' });

      expect(mockPrisma.requestLog.deleteMany).not.toHaveBeenCalled();
      expect(mockPrisma.usageAlertLog.deleteMany).not.toHaveBeenCalled();
    });

    it('should NOT reset monthly requests when transitioning from paid plan to free plan', async () => {
      const paidUser = {
        id: 'user-1',
        planId: 'plan-paid-1',
        plan: { id: 'plan-paid-1', name: 'Basic', price: '49.90' },
      };

      const freePlan = {
        id: 'plan-free-1',
        name: 'Free',
        price: '0.00',
      };

      mockPrisma.user.findUnique.mockResolvedValue(paidUser);
      mockPrisma.plan.findUnique.mockResolvedValue(freePlan);
      mockPrisma.user.update.mockResolvedValue({ id: 'user-1', user: 'test' });

      await service.update('user-1', { planId: 'plan-free-1' });

      expect(mockPrisma.requestLog.deleteMany).not.toHaveBeenCalled();
      expect(mockPrisma.usageAlertLog.deleteMany).not.toHaveBeenCalled();
    });

    it('should NOT reset monthly requests when updating user without changing planId', async () => {
      const currentUser = {
        id: 'user-1',
        planId: null,
        plan: null,
      };

      mockPrisma.user.findUnique.mockResolvedValue(currentUser);
      mockPrisma.user.update.mockResolvedValue({
        id: 'user-1',
        user: 'updated',
      });

      await service.update('user-1', { email: 'newemail@test.com' });

      expect(mockPrisma.requestLog.deleteMany).not.toHaveBeenCalled();
      expect(mockPrisma.usageAlertLog.deleteMany).not.toHaveBeenCalled();
    });
  });
});
