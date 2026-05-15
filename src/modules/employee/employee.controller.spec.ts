import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let employeeService: jest.Mocked<EmployeeService>;

  const mockEmployeeService = {
    get: jest.fn(),
    getById: jest.fn(),
  };

  const mockReq = {
    credentials_id: 'cred-1',
    store_id: 1,
  } as any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [{ provide: EmployeeService, useValue: mockEmployeeService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<EmployeeController>(EmployeeController);
    employeeService = module.get(EmployeeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should call employeeService.get with all parameters', async () => {
      mockEmployeeService.get.mockResolvedValue([{ FUN_CODIGO: 1 }]);

      const result = await controller.get(
        mockReq,
        {
          storeId: 1,
          page: 2,
          pageSize: 20,
          search: 'search term',
          situation: 'A',
        }
      );

      expect(employeeService.get).toHaveBeenCalledWith(
        'cred-1',
        1,
        2,
        20,
        'search term',
        'A'
      );
      expect(result).toEqual([{ FUN_CODIGO: 1 }]);
    });
  });

  describe('getById', () => {
    it('should call employeeService.getById with id', async () => {
      const mockEmployee = { FUN_CODIGO: 123, FUN_NOME: 'Emp 1' };
      mockEmployeeService.getById.mockResolvedValue(mockEmployee);

      const result = await controller.getById(mockReq, 123);

      expect(employeeService.getById).toHaveBeenCalledWith(
        'cred-1',
        123
      );
      expect(result).toEqual(mockEmployee);
    });
  });
});
