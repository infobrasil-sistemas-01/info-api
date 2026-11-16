import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

describe('WebhookService', () => {
  let service: WebhookService;
  let prismaMock: any;
  let tenantConnectionServiceMock: any;

  beforeEach(async () => {
    prismaMock = {
      webhookSubscription: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      webhookDelivery: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
    };

    tenantConnectionServiceMock = {
      getConnection: jest.fn().mockResolvedValue({
        query: jest.fn((sql, params, cb) => cb(null, [{ max: 100 }])),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookService,
        { provide: RegistryPrismaService, useValue: prismaMock },
        { provide: TenantConnectionService, useValue: tenantConnectionServiceMock },
      ],
    }).compile();

    service = module.get<WebhookService>(WebhookService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar uma inscricao de webhook com secretKey e cursores cold-start', async () => {
      prismaMock.webhookSubscription.findUnique.mockResolvedValue(null);
      prismaMock.webhookSubscription.create.mockImplementation(({ data }: any) =>
        Promise.resolve({ id: 'wh_1', ...data }),
      );

      const result = await service.create(
        'user_1',
        {
          targetUrl: 'https://webhook.site/test',
          events: ['order.created'],
        },
        'cred_1',
      );

      expect(result.userId).toBe('user_1');
      expect(result.secretKey).toMatch(/^whsec_[a-f0-9]{48}$/);
      expect(result.targetUrl).toBe('https://webhook.site/test');
      expect(prismaMock.webhookSubscription.create).toHaveBeenCalled();
    });

    it('deve lancar ConflictException se o usuario ja possuir webhook (regra 1:1)', async () => {
      prismaMock.webhookSubscription.findUnique.mockResolvedValue({ id: 'wh_existente' });

      await expect(
        service.create(
          'user_1',
          {
            targetUrl: 'https://webhook.site/test',
            events: ['order.created'],
          },
          'cred_1',
        ),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('signPayload', () => {
    it('deve gerar assinatura HMAC-SHA256 valida', () => {
      const secret = 'whsec_test_secret_12345';
      const timestamp = 1794668000;
      const payload = { test: true };

      const signature = service.signPayload(secret, timestamp, payload);
      expect(signature).toMatch(/^t=1794668000,v1=[a-f0-9]{64}$/);
    });
  });

  describe('rotateSecret', () => {
    it('deve gerar nova chave secreta', async () => {
      prismaMock.webhookSubscription.findUnique.mockResolvedValue({
        id: 'wh_1',
        userId: 'user_1',
        secretKey: 'whsec_antiga',
      });
      prismaMock.webhookSubscription.update.mockImplementation(({ data }: any) =>
        Promise.resolve({ id: 'wh_1', userId: 'user_1', ...data }),
      );

      const result = await service.rotateSecret('user_1');
      expect(result.secretKey).not.toBe('whsec_antiga');
      expect(result.secretKey).toMatch(/^whsec_[a-f0-9]{48}$/);
    });

    it('deve lancar NotFoundException se o usuario nao possuir webhook', async () => {
      prismaMock.webhookSubscription.findUnique.mockResolvedValue(null);

      await expect(service.rotateSecret('user_inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
