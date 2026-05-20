import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeRoleController } from './employee-role.controller';
import { EmployeeRoleService } from './employee-role.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';

describe('EmployeeRoleController', () => {
  let controller: EmployeeRoleController;
  let employeeRoleService: jest.Mocked<EmployeeRoleService>;

  const mockEmployeeRoleService = {
    get: jest.fn(),
  };

  const mockReq = {
    credentials_id: 'cred-1',
  } as any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeRoleController],
      providers: [
        { provide: EmployeeRoleService, useValue: mockEmployeeRoleService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<EmployeeRoleController>(EmployeeRoleController);
    employeeRoleService = module.get(EmployeeRoleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should call employeeRoleService.get with all parameters', async () => {
      mockEmployeeRoleService.get.mockResolvedValue([
        { FCA_CODIGO: 1, FCA_NOME: 'Role 1' },
      ]);

      const result = await controller.get(mockReq, {
        page: 2,
        pageSize: 20,
        search: 'search term',
      });

      expect(employeeRoleService.get).toHaveBeenCalledWith(
        'cred-1',
        2,
        20,
        'search term',
      );
      expect(result).toEqual([{ FCA_CODIGO: 1, FCA_NOME: 'Role 1' }]);
    });
  });
});
