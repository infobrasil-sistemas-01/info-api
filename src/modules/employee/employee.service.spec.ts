import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let mockTenantConnection: any;

  const mockConnection = {
    query: jest.fn(),
  };

  beforeAll(async () => {
    mockTenantConnection = {
      getConnection: jest.fn().mockResolvedValue(mockConnection),
      releaseConnection: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        { provide: TenantConnectionService, useValue: mockTenantConnection },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return paginated employees', async () => {
      const mockEmployees = [
        { FUN_CODIGO: 1, FUN_NOME: 'Employee 1' },
        { FUN_CODIGO: 2, FUN_NOME: 'Employee 2' },
      ];
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, mockEmployees);
        },
      );

      const result = await service.get('cred-1', 1, 1, 10);

      expect(result).toEqual(mockEmployees);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT FIRST ? SKIP ?'),
        expect.arrayContaining([10, 0, 1]),
        expect.any(Function),
      );
    });

    it('should apply situation filter when provided', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await service.get('cred-1', 1, 1, 10, undefined, 'A');

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('FUN_SITUACAO = ?'),
        expect.arrayContaining([10, 0, 1, 'A']),
        expect.any(Function),
      );
    });

    it('should throw BadRequestException when search has less than 3 characters', async () => {
      await expect(
        service.get('cred-1', 1, 1, 10, 'ab'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should apply search filter when provided with 3+ characters', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await service.get('cred-1', 1, 1, 10, 'abc');

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('FUN_NOME LIKE ? OR FUN_APELIDO LIKE ?'),
        expect.arrayContaining([10, 0, 1, '%abc%', '%abc%']),
        expect.any(Function),
      );
    });
  });

  describe('getById', () => {
    it('should return employee by id', async () => {
      const mockEmployee = { FUN_CODIGO: 1, FUN_NOME: 'Employee Test' };
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, [mockEmployee]);
        },
      );

      const result = await service.getById('cred-1', 1);

      expect(result).toEqual(mockEmployee);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE FUN_CODIGO = ?'),
        [1],
        expect.any(Function),
      );
    });
  });
});
