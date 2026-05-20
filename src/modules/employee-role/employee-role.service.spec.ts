import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { EmployeeRoleService } from './employee-role.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('EmployeeRoleService', () => {
  let service: EmployeeRoleService;
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
        EmployeeRoleService,
        { provide: TenantConnectionService, useValue: mockTenantConnection },
      ],
    }).compile();

    service = module.get<EmployeeRoleService>(EmployeeRoleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return paginated employee roles', async () => {
      const mockRoles = [
        { FCA_CODIGO: 1, FCA_NOME: 'Role 1' },
        { FCA_CODIGO: 2, FCA_NOME: 'Role 2' },
      ];
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, mockRoles);
        },
      );

      const result = await service.get('cred-1', 1, 10);

      expect(result).toEqual(mockRoles);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT FIRST ? SKIP ?'),
        expect.arrayContaining([10, 0]),
        expect.any(Function),
      );
    });

    it('should throw BadRequestException when search has less than 3 characters', async () => {
      await expect(service.get('cred-1', 1, 10, 'ab')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should apply search filter when provided with 3+ characters', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await service.get('cred-1', 1, 10, 'abc');

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('FCA_NOME LIKE ?'),
        expect.arrayContaining([10, 0, '%ABC%']),
        expect.any(Function),
      );
    });
  });
});
