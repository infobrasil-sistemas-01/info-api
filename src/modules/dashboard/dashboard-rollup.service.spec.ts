import { Test, TestingModule } from '@nestjs/testing';
import { DashboardRollupService } from './dashboard-rollup.service';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';

describe('DashboardRollupService', () => {
  let service: DashboardRollupService;
  let mockPrisma: any;

  beforeEach(async () => {
    mockPrisma = {
      $executeRawUnsafe: jest.fn().mockResolvedValue(1),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardRollupService,
        { provide: RegistryPrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DashboardRollupService>(DashboardRollupService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('refreshRollupsWindow', () => {
    it('should execute upsert query for given hours window', async () => {
      await service.refreshRollupsWindow(48);
      expect(mockPrisma.$executeRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO dashboard_hourly_rollups'),
      );
      expect(mockPrisma.$executeRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining("INTERVAL '48 hours'"),
      );
    });
  });

  describe('updateRecentRollups', () => {
    it('should call refreshRollupsWindow with 48 hours', async () => {
      const spy = jest.spyOn(service, 'refreshRollupsWindow').mockResolvedValue();
      await service.updateRecentRollups();
      expect(spy).toHaveBeenCalledWith(48);
    });

    it('should handle error gracefully without throwing', async () => {
      jest.spyOn(service, 'refreshRollupsWindow').mockRejectedValue(new Error('DB connection fail'));
      await expect(service.updateRecentRollups()).resolves.not.toThrow();
    });
  });

  describe('syncHistoricalRollups', () => {
    it('should call refreshRollupsWindow with 720 hours', async () => {
      const spy = jest.spyOn(service, 'refreshRollupsWindow').mockResolvedValue();
      await service.syncHistoricalRollups();
      expect(spy).toHaveBeenCalledWith(720);
    });
  });
});
