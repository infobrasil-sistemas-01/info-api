import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationRequestService } from './integration-request.service';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { EmailService } from 'src/infra/email/email.service';
import { EnvService } from 'src/config/env/env.service';

describe('IntegrationRequestService', () => {
  let service: IntegrationRequestService;
  let mockPrisma: any;
  let mockEmailService: any;
  let mockEnvService: any;

  beforeEach(async () => {
    mockPrisma = {
      integrationRequest: {
        create: jest.fn().mockImplementation((args) => ({
          id: 'req-1',
          ...args.data,
          createdAt: new Date(),
        })),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn().mockImplementation((args) => ({
          id: args.where.id,
          ...args.data,
        })),
        delete: jest.fn().mockResolvedValue({ id: 'req-1' }),
      },
    };

    mockEmailService = {
      sendEmail: jest.fn().mockResolvedValue(true),
      sendToSupport: jest.fn().mockResolvedValue(true),
    };

    mockEnvService = {
      get: jest.fn().mockImplementation((key) => {
        if (key === 'NODE_ENV') return 'test';
        if (key === 'PORT') return 3000;
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntegrationRequestService,
        { provide: RegistryPrismaService, useValue: mockPrisma },
        { provide: EmailService, useValue: mockEmailService },
        { provide: EnvService, useValue: mockEnvService },
      ],
    }).compile();

    service = module.get<IntegrationRequestService>(IntegrationRequestService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CSV store lookup', () => {
    it('should read and parse stores from docs/relatorio_lojas.csv', () => {
      const stores = service.getStoresFromCsv();
      expect(Array.isArray(stores)).toBe(true);
      expect(stores.length).toBeGreaterThan(0);

      const first = stores[0];
      expect(first).toHaveProperty('host');
      expect(first).toHaveProperty('port');
      expect(first).toHaveProperty('alias');
      expect(first).toHaveProperty('cname');
      expect(first).toHaveProperty('cnpj');
    });

    it('should find store by CNPJ regardless of formatting', () => {
      // 53813096000173 is 4PADEL in CSV
      const storeClean = service.getStoreByCnpj('53813096000173');
      expect(storeClean).not.toBeNull();
      expect(storeClean?.alias).toBe('4padel');
      expect(storeClean?.host).toBe('db4padel.iprojectti.com.br');
      expect(storeClean?.port).toBe(3056);

      const storeFormatted = service.getStoreByCnpj('53.813.096/0001-73');
      expect(storeFormatted).not.toBeNull();
      expect(storeFormatted?.alias).toBe('4padel');
    });

    it('should return null for non-existent or empty CNPJ', () => {
      expect(service.getStoreByCnpj('')).toBeNull();
      expect(service.getStoreByCnpj(null)).toBeNull();
      expect(service.getStoreByCnpj('00000000000000')).toBeNull();
    });
  });

  describe('create', () => {
    it('should automatically resolve and populate database options from CSV when CNPJ matches', async () => {
      const dto = {
        clientName: '4PADEL TEST',
        legalName: '4PADEL LTDA',
        cnpj: '53.813.096/0001-73',
        modules: ['Produtos'],
        scopes: [{ resource: 'products', actions: ['read' as const] }],
        objective: 'Integração para testes automatizados',
        technicalContact: {
          name: 'Tech Test',
          email: 'tech@test.com',
          phone: '11999999999',
        },
        responsiblePerson: {
          name: 'Resp Test',
          email: 'resp@test.com',
          phone: '11999999999',
        },
      };

      const result = await service.create(dto);

      expect(mockPrisma.integrationRequest.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            cnpj: '53.813.096/0001-73',
            database: {
              host: 'db4padel.iprojectti.com.br',
              port: 3056,
              database: '4padel',
            },
          }),
        }),
      );
      expect(result.database).toEqual({
        host: 'db4padel.iprojectti.com.br',
        port: 3056,
        database: '4padel',
      });
    });

    it('should use default DATACENTER if CNPJ is not found in CSV and no database is provided', async () => {
      const dto = {
        clientName: 'Cliente Novo Desconhecido',
        legalName: 'Cliente Desconhecido LTDA',
        cnpj: '99.999.999/9999-99',
        modules: ['Produtos'],
        scopes: [{ resource: 'products', actions: ['read' as const] }],
        objective: 'Objetivo de teste sem loja no CSV',
        technicalContact: {
          name: 'Tech Test',
          email: 'tech@test.com',
          phone: '11999999999',
        },
        responsiblePerson: {
          name: 'Resp Test',
          email: 'resp@test.com',
          phone: '11999999999',
        },
      };

      await service.create(dto);

      expect(mockPrisma.integrationRequest.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            database: {
              host: 'DATACENTER',
              port: 0,
              database: 'DATACENTER',
            },
          }),
        }),
      );
    });
  });

  describe('syncDatabasesByCnpj', () => {
    it('should iterate over requests and update database connection for matching CNPJs', async () => {
      mockPrisma.integrationRequest.findMany.mockResolvedValue([
        {
          id: 'req-1',
          clientName: '4Padel Client',
          cnpj: '53813096000173',
          database: { host: 'DATACENTER', port: 0, database: 'DATACENTER' },
        },
        {
          id: 'req-2',
          clientName: 'Sem CNPJ',
          cnpj: null,
          database: null,
        },
        {
          id: 'req-3',
          clientName: 'CNPJ Inexistente',
          cnpj: '99999999999999',
          database: { host: 'OLD', port: 3050, database: 'OLD' },
        },
      ]);

      const result = await service.syncDatabasesByCnpj();

      expect(result.total).toBe(3);
      expect(result.updatedCount).toBe(1);
      expect(result.notFoundCount).toBe(2);

      expect(mockPrisma.integrationRequest.update).toHaveBeenCalledTimes(1);
      expect(mockPrisma.integrationRequest.update).toHaveBeenCalledWith({
        where: { id: 'req-1' },
        data: {
          database: {
            host: 'db4padel.iprojectti.com.br',
            port: 3056,
            database: '4padel',
          },
        },
      });
    });
  });
});
