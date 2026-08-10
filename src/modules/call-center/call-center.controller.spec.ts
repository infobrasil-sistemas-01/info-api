import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { CallCenterController } from './call-center.controller';
import { CallCenterService } from './call-center.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';

describe('CallCenterController', () => {
  let controller: CallCenterController;
  let service: jest.Mocked<CallCenterService>;

  beforeEach(async () => {
    const mockService = {
      get: jest.fn(),
      getById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CallCenterController],
      providers: [
        {
          provide: CallCenterService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CallCenterController>(CallCenterController);
    service = module.get(CallCenterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCallCenters', () => {
    it('should call callCenterService.get with credentialsId and query parameters', async () => {
      const req: any = {
        authContext: { credentialsId: 'cred-123' },
      };
      const query = { page: 1, pageSize: 20 };
      const expectedResult = [{ CAL_NUMERO: 1 }];

      service.get.mockResolvedValue(expectedResult as any);

      const result = await controller.getCallCenters(req, query);

      expect(service.get).toHaveBeenCalledWith('cred-123', query);
      expect(result).toEqual(expectedResult);
    });

    it('should throw UnauthorizedException if credentialsId is missing', () => {
      const req: any = { authContext: {} };

      expect(() => controller.getCallCenters(req, {})).toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getCallCenterById', () => {
    it('should call callCenterService.getById with credentialsId and id', async () => {
      const req: any = {
        authContext: { credentialsId: 'cred-123' },
      };
      const expectedResult = { CAL_NUMERO: 123 };

      service.getById.mockResolvedValue(expectedResult as any);

      const result = await controller.getCallCenterById(req, 123);

      expect(service.getById).toHaveBeenCalledWith('cred-123', 123);
      expect(result).toEqual(expectedResult);
    });

    it('should throw UnauthorizedException if credentialsId is missing', () => {
      const req: any = { authContext: {} };

      expect(() => controller.getCallCenterById(req, 123)).toThrow(
        UnauthorizedException,
      );
    });
  });
});
