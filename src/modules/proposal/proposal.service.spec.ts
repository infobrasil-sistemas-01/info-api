import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('ProposalService', () => {
  let service: ProposalService;
  let mockTenantConnectionService: any;
  let mockConnection: any;
  let mockTransaction: any;

  beforeEach(async () => {
    mockTransaction = {
      query: jest.fn(),
      commit: jest.fn((cb) => cb(null)),
      rollback: jest.fn((cb) => (cb ? cb() : undefined)),
    };

    mockConnection = {
      query: jest.fn(),
      startTransaction: jest.fn((cb) => cb(null, mockTransaction)),
    };

    mockTenantConnectionService = {
      getConnection: jest.fn().mockResolvedValue(mockConnection),
      releaseConnection: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProposalService,
        {
          provide: TenantConnectionService,
          useValue: mockTenantConnectionService,
        },
      ],
    }).compile();

    service = module.get<ProposalService>(ProposalService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return paginated proposals with total when includeCount is true', async () => {
      const mockRows = [{ PRO_NUMERO: 105, CLI_CODIGO: 10, PRO_GERADA: 'N' }];
      mockConnection.query
        .mockImplementationOnce((sql: string, params: any[], cb: any) => {
          cb(null, mockRows);
        })
        .mockImplementationOnce((sql: string, params: any[], cb: any) => {
          cb(null, [{ TOTAL: 1 }]);
        });

      const result = await service.get(
        'cred_1',
        1,
        { page: 1, pageSize: 10, proGerada: 'N' },
        true,
      );

      expect(result.data).toEqual(mockRows);
      expect(result.total).toBe(1);
      expect(mockTenantConnectionService.releaseConnection).toHaveBeenCalledWith(
        mockConnection,
      );
    });

    it('should throw BadRequestException when page < 1', async () => {
      await expect(
        service.get('cred_1', 1, { page: 0, pageSize: 10 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getById', () => {
    it('should return proposal header with ITENS', async () => {
      const header = { PRO_NUMERO: 105, LOJ_CODIGO: 1, PRO_GERADA: 'N' };
      const items = [{ IPR_NUMERO: 501, PRO_NUMERO: 105, PRO_CODIGO: '001' }];

      mockConnection.query
        .mockImplementationOnce((sql: string, params: any[], cb: any) => {
          cb(null, [header]);
        })
        .mockImplementationOnce((sql: string, params: any[], cb: any) => {
          cb(null, items);
        });

      const result = await service.getById('cred_1', 1, 105);

      expect(result).toEqual({ ...header, ITENS: items });
    });

    it('should throw NotFoundException when proposal does not exist', async () => {
      mockConnection.query.mockImplementationOnce(
        (sql: string, params: any[], cb: any) => {
          cb(null, []);
        },
      );

      await expect(service.getById('cred_1', 1, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create proposal with PRO_GERADA = N and items atomically', async () => {
      // 1. ESTOQUE lookup
      mockConnection.query.mockImplementationOnce(
        (sql: string, params: any[], cb: any) => {
          cb(null, [{ PRO_CODIGO: '001', PRO_PRECO1: 50, PRO_PRECO2: 45 }]);
        },
      );

      // 2. Transaction header insert + item insert
      mockTransaction.query
        .mockImplementationOnce((sql: string, params: any[], cb: any) => {
          expect(sql).toContain("GEN_ID(GEN_NUMEROPRO, 1)");
          expect(sql).toContain("PRO_GERADA");
          cb(null, [{ PRO_NUMERO: 105 }]);
        })
        .mockImplementationOnce((sql: string, params: any[], cb: any) => {
          expect(sql).toContain("GEN_ID(GEN_NUMEROIPR, 1)");
          cb(null, []);
        });

      // 3. getById after create
      const createdHeader = { PRO_NUMERO: 105, PRO_GERADA: 'N', PRO_TOTALLIQUIDO: 90 };
      const createdItems = [{ IPR_NUMERO: 501, PRO_NUMERO: 105, PRO_CODIGO: '001', IPR_PRECO: 45, IPR_TOTAL: 90 }];
      mockConnection.query
        .mockImplementationOnce((sql: string, params: any[], cb: any) => {
          cb(null, [createdHeader]);
        })
        .mockImplementationOnce((sql: string, params: any[], cb: any) => {
          cb(null, createdItems);
        });

      const result = await service.create('cred_1', 1, 10, {
        FUN_CODIGO: 2,
        SIT_CODIGO: 1,
        CLI_CODIGO: 15,
        ITENS: [{ PRO_CODIGO: '001', IPR_QTDE: 2 }],
      });

      expect(result).toEqual({ ...createdHeader, ITENS: createdItems });
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should throw BadRequestException if product does not exist', async () => {
      mockConnection.query.mockImplementationOnce(
        (sql: string, params: any[], cb: any) => {
          cb(null, []);
        },
      );

      await expect(
        service.create('cred_1', 1, 10, {
          FUN_CODIGO: 2,
          SIT_CODIGO: 1,
          CLI_CODIGO: 15,
          ITENS: [{ PRO_CODIGO: '999', IPR_QTDE: 1 }],
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should reject update when PRO_GERADA is S', async () => {
      mockConnection.query
        .mockImplementationOnce((sql: string, params: any[], cb: any) => {
          cb(null, [{ PRO_NUMERO: 105, LOJ_CODIGO: 1, PRO_GERADA: 'S' }]);
        })
        .mockImplementationOnce((sql: string, params: any[], cb: any) => {
          cb(null, []);
        });

      await expect(
        service.update('cred_1', 1, 105, { PRO_OBS: 'Nova obs' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update header and atomically replace items when ITENS is provided', async () => {
      const existingHeader = {
        PRO_NUMERO: 105,
        LOJ_CODIGO: 1,
        PRO_GERADA: 'N',
        PRO_PRECO: '2',
      };

      // Initial getById
      mockConnection.query
        .mockImplementationOnce((sql: string, params: any[], cb: any) => {
          cb(null, [existingHeader]);
        })
        .mockImplementationOnce((sql: string, params: any[], cb: any) => {
          cb(null, []);
        })
        // ESTOQUE lookup for new ITENS
        .mockImplementationOnce((sql: string, params: any[], cb: any) => {
          cb(null, [{ PRO_CODIGO: '002', PRO_PRECO1: 30, PRO_PRECO2: 25 }]);
        })
        // Final getById
        .mockImplementationOnce((sql: string, params: any[], cb: any) => {
          cb(null, [{ ...existingHeader, PRO_OBS: 'Atualizada' }]);
        })
        .mockImplementationOnce((sql: string, params: any[], cb: any) => {
          cb(null, [{ IPR_NUMERO: 502, PRO_CODIGO: '002', IPR_QTDE: 3 }]);
        });

      mockTransaction.query
        .mockImplementationOnce((sql: string, params: any[], cb: any) => {
          expect(sql).toContain('UPDATE PROPOSTAS SET');
          cb(null, []);
        })
        .mockImplementationOnce((sql: string, params: any[], cb: any) => {
          expect(sql).toContain('DELETE FROM ITENSPRO WHERE PRO_NUMERO = ?');
          cb(null, []);
        })
        .mockImplementationOnce((sql: string, params: any[], cb: any) => {
          expect(sql).toContain('INSERT INTO ITENSPRO');
          cb(null, []);
        });

      const result = await service.update('cred_1', 1, 105, {
        PRO_OBS: 'Atualizada',
        ITENS: [{ PRO_CODIGO: '002', IPR_QTDE: 3 }],
      });

      expect(result.PRO_OBS).toBe('Atualizada');
      expect(mockTransaction.commit).toHaveBeenCalled();
    });
  });
});
