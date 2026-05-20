import { Test, TestingModule } from '@nestjs/testing';
import { ProductGroupService } from './product-group.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('ProductGroupService', () => {
  let service: ProductGroupService;
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
        ProductGroupService,
        { provide: TenantConnectionService, useValue: mockTenantConnection },
      ],
    }).compile();

    service = module.get<ProductGroupService>(ProductGroupService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return paginated product groups', async () => {
      const mockGroups = [
        { GRU_CODIGO: 1, GRU_DESCRICAO: 'Group 1' },
        { GRU_CODIGO: 2, GRU_DESCRICAO: 'Group 2' },
      ];
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, mockGroups);
        },
      );

      const result = await service.get('cred-1', 1, 10);

      expect(result).toEqual(mockGroups);
    });

    it('should calculate correct pagination offset', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await service.get('cred-1', 3, 10);

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.any(String),
        [10, 20],
        expect.any(Function),
      );
    });

    it('should throw error when connection query fails', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(new Error('DB error'), null);
        },
      );

      await expect(service.get('cred-1')).rejects.toThrow('DB error');
    });
  });

  describe('getById', () => {
    it('should return a group when found', async () => {
      const mockGroup = { GRU_CODIGO: 1, GRU_DESCRICAO: 'Group 1' };
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, [mockGroup]);
        },
      );

      const result = await service.getById('cred-1', 1);

      expect(result).toEqual(mockGroup);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE M.GRU_CODIGO = ?'),
        [1],
        expect.any(Function),
      );
    });

    it('should return undefined when group is not found', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      const result = await service.getById('cred-1', 999);

      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should insert and return new product group', async () => {
      const inputDto = { GRU_DESCRICAO: 'New Group' };
      const expectedResult = { GRU_CODIGO: 5, GRU_DESCRICAO: 'New Group' };

      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, expectedResult);
        },
      );

      const result = await service.create('cred-1', inputDto);

      expect(result).toEqual(expectedResult);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO grupospro'),
        ['New Group'],
        expect.any(Function),
      );
    });
  });

  describe('update', () => {
    it('should update and return updated product group', async () => {
      const inputDto = { GRU_DESCRICAO: 'Updated Group' };
      const existingGroup = { GRU_CODIGO: 1, GRU_DESCRICAO: 'Old Group' };
      const updatedGroup = { GRU_CODIGO: 1, GRU_DESCRICAO: 'Updated Group' };

      let callCount = 0;
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          if (query.includes('SELECT')) {
            if (callCount === 0) {
              callCount++;
              callback(null, [existingGroup]);
            } else {
              callback(null, [updatedGroup]);
            }
          } else if (query.includes('UPDATE')) {
            callback(null, true);
          }
        },
      );

      const result = await service.update('cred-1', 1, inputDto);

      expect(result).toEqual(updatedGroup);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE grupospro SET GRU_DESCRICAO = ?'),
        ['Updated Group', 1],
        expect.any(Function),
      );
    });

    it('should throw NotFoundException if group does not exist', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await expect(
        service.update('cred-1', 999, { GRU_DESCRICAO: 'Updated' }),
      ).rejects.toThrow('Grupo não encontrado');
    });

    it('should return existing group if no updates are passed', async () => {
      const existingGroup = { GRU_CODIGO: 1, GRU_DESCRICAO: 'Old Group' };
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, [existingGroup]);
        },
      );

      const result = await service.update('cred-1', 1, {});

      expect(result).toEqual(existingGroup);
      expect(mockConnection.query).not.toHaveBeenCalledWith(
        expect.stringContaining('UPDATE'),
        expect.any(Array),
        expect.any(Function),
      );
    });
  });

  describe('FAILING: product group edge cases', () => {
    it('should throw error when page number is negative', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        },
      );

      await expect(service.get('cred-1', -1, 10)).rejects.toThrow();
    });

    it('should throw error when database connection times out', async () => {
      mockConnection.query.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(new Error('Connection timeout'), null);
        },
      );

      await expect(service.get('cred-1', 1, 10)).rejects.toThrow(
        'Connection timeout',
      );
    });
  });
});
