import { Test, TestingModule } from '@nestjs/testing';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';

describe('CityController', () => {
  let controller: CityController;
  let mockService: any;

  beforeEach(async () => {
    mockService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityController],
      providers: [{ provide: CityService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CityController>(CityController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return list of cities', async () => {
      const mockResult = [
        { MUN_CODIGO: 2304400, MUN_NOME: 'FORTALEZA', EST_CODIGO: 23 },
      ];
      mockService.get.mockResolvedValue(mockResult);

      const user = { credentials_id: 'cred-1' };
      const query = { page: 1, pageSize: 50, search: 'FORTALEZA', stateId: 23 };

      const result = await controller.get(user, query);

      expect(result).toEqual(mockResult);
      expect(mockService.get).toHaveBeenCalledWith(
        'cred-1',
        1,
        50,
        'FORTALEZA',
        23,
      );
    });
  });
});
