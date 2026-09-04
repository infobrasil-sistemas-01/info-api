import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let mockHealthService: any;

  beforeEach(async () => {
    mockHealthService = {
      check: jest.fn().mockResolvedValue({
        status: 'ok',
        version: '1.0.0',
        uptime: 100,
        timestamp: new Date().toISOString(),
        databases: {
          postgres: { status: 'up' },
          firebird: { activePools: 0, cachedCredentials: 0, tenants: [] },
        },
      }),
      checkLiveness: jest.fn().mockResolvedValue({
        status: 'ok',
        version: '1.0.0',
        uptime: 100,
        timestamp: new Date().toISOString(),
        database: { status: 'up' },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: HealthService, useValue: mockHealthService }],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkLive', () => {
    it('should call healthService.checkLiveness and return status', async () => {
      const result = await controller.checkLive();

      expect(mockHealthService.checkLiveness).toHaveBeenCalled();
      expect(result.status).toBe('ok');
    });
  });

  describe('check', () => {
    it('should call healthService.check and return status', async () => {
      const result = await controller.check();

      expect(mockHealthService.check).toHaveBeenCalled();
      expect(result.status).toBe('ok');
    });
  });
});
