import { Test, TestingModule } from '@nestjs/testing';
import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import * as dns from 'dns';
import { WebhookService } from './webhook.service';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { PermissionResolver } from 'src/infra/rbac/permission-resolver.service';

jest.mock('dns', () => ({
  promises: {
    lookup: jest.fn().mockImplementation((hostname: string) => {
      if (hostname === 'api.github.com' || hostname === 'webhook.site') {
        return Promise.resolve([{ address: '140.82.121.4', family: 4 }]);
      }
      if (hostname === 'private-rebinding.com') {
        return Promise.resolve([{ address: '192.168.243.18', family: 4 }]);
      }
      return Promise.reject(new Error(`getaddrinfo ENOTFOUND ${hostname}`));
    }),
  },
}));

describe('WebhookService', () => {
  let service: WebhookService;
  let prismaMock: any;
  let tenantConnectionServiceMock: any;
  let permissionResolverMock: any;

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
        updateMany: jest.fn(),
        count: jest.fn(),
      },
      $transaction: jest.fn((cb: any) => cb(prismaMock)),
      user: {
        findUnique: jest.fn().mockResolvedValue({ dbCredentialsId: 'cred_1' }),
      },
    };

    tenantConnectionServiceMock = {
      getConnection: jest.fn().mockResolvedValue({
        query: jest.fn((sql, params, cb) => cb(null, [{ max: 100 }])),
      }),
      releaseConnection: jest.fn(),
    };

    permissionResolverMock = {
      resolve: jest.fn().mockResolvedValue({
        userId: 'user_1',
        roles: ['INTEGRATOR'],
        allowedKeys: new Set([
          'tenant.orders.view',
          'tenant.products.view',
          'tenant.deliveries.view',
          'tenant.account-payable.view',
          'tenant.account-receivable.view',
        ]),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookService,
        { provide: RegistryPrismaService, useValue: prismaMock },
        { provide: PermissionResolver, useValue: permissionResolverMock },
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
          targetUrl: 'https://api.github.com/webhook',
          events: ['order.created'],
        },
        'cred_1',
      );

      expect(result.userId).toBe('user_1');
      expect(result.secretKey).toMatch(/^whsec_[a-f0-9]{48}$/);
      expect(result.targetUrl).toBe('https://api.github.com/webhook');
      expect(prismaMock.webhookSubscription.create).toHaveBeenCalled();
    });

    it('deve lancar ForbiddenException se o usuario nao possuir a permissao GET do evento', async () => {
      permissionResolverMock.resolve.mockResolvedValue({
        userId: 'user_sem_pedidos',
        roles: ['READONLY'],
        allowedKeys: new Set(['tenant.products.view']), // apenas produtos, sem pedidos
      });

      await expect(
        service.create(
          'user_sem_pedidos',
          {
            targetUrl: 'https://api.github.com/webhook',
            events: ['order.created'],
          },
          'cred_1',
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve lancar BadRequestException para URL que viole regras anti-SSRF (ex: IP literal)', async () => {
      await expect(
        service.create(
          'user_1',
          {
            targetUrl: 'https://192.168.243.18/webhook',
            events: ['order.created'],
          },
          'cred_1',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve bloquear domínio público que resolva para IP privado via DNS Rebinding', async () => {
      await expect(
        service.create(
          'user_1',
          {
            targetUrl: 'https://private-rebinding.com/webhook',
            events: ['order.created'],
          },
          'cred_1',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lancar ConflictException se o usuario ja possuir webhook (regra 1:1)', async () => {
      prismaMock.webhookSubscription.findUnique.mockResolvedValue({ id: 'wh_existente' });

      await expect(
        service.create(
          'user_1',
          {
            targetUrl: 'https://api.github.com/webhook',
            events: ['order.created'],
          },
          'cred_1',
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('deve lancar BadRequestException se o usuario nao possuir dbCredentialsId configurado', async () => {
      prismaMock.webhookSubscription.findUnique.mockResolvedValue(null);
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        service.create(
          'user_sem_banco',
          {
            targetUrl: 'https://api.github.com/webhook',
            events: ['order.created'],
          },
          undefined,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve inicializar com cursores sentinela (-1) para os eventos assinados', async () => {
      prismaMock.webhookSubscription.findUnique.mockResolvedValue(null);
      let createdData: any;
      prismaMock.webhookSubscription.create.mockImplementation(({ data }: any) => {
        createdData = data;
        return Promise.resolve({ id: 'wh_1', ...data });
      });

      await service.create(
        'user_1',
        {
          targetUrl: 'https://api.github.com/webhook',
          events: ['order.created'],
        },
        'cred_1',
      );

      expect(createdData.lastOrderId).toBe(-1);
      expect(createdData.lastProductId).toBe(0);
      expect(createdData.lastDeliveryId).toBe(0);
      expect(createdData.lastAccountPayableId).toBe(0);
      expect(createdData.lastAccountReceivableId).toBe(0);
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

  describe('unpause', () => {
    it('deve despausar o webhook e zerar falhas consecutivas', async () => {
      prismaMock.webhookSubscription.findUnique.mockResolvedValue({
        id: 'wh_1',
        userId: 'user_1',
        targetUrl: 'https://api.github.com/webhook',
        isPaused: true,
        consecutiveFailures: 5,
      });

      prismaMock.webhookSubscription.update.mockImplementation(({ data }: any) =>
        Promise.resolve({ id: 'wh_1', userId: 'user_1', ...data }),
      );

      const result = await service.unpause('user_1');
      expect(result.isPaused).toBe(false);
      expect(result.consecutiveFailures).toBe(0);
      expect(result.pauseReason).toBeNull();
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

  describe('getDeliveries', () => {
    it('deve retornar lista paginada com meta quando page for informado', async () => {
      prismaMock.webhookSubscription.findUnique.mockResolvedValue({
        id: 'wh_1',
        userId: 'user_1',
      });
      prismaMock.webhookDelivery.findMany.mockResolvedValue([
        { id: 'del_1', event: 'order.created', status: 'FAILED' },
      ]);
      prismaMock.webhookDelivery.count.mockResolvedValue(30);

      const result: any = await service.getDeliveries('user_1', 25, 2);

      expect(prismaMock.webhookDelivery.findMany).toHaveBeenCalledWith({
        where: { subscriptionId: 'wh_1' },
        orderBy: { createdAt: 'desc' },
        skip: 25,
        take: 25,
      });
      expect(result).toEqual({
        data: [{ id: 'del_1', event: 'order.created', status: 'FAILED' }],
        meta: { total: 30, page: 2, limit: 25, totalPages: 2 },
      });
    });
  });

  describe('update (toggle isActive)', () => {
    it('deve permitir ativar/desativar livremente e limpar pausa do Circuit Breaker ao reativar', async () => {
      prismaMock.webhookSubscription.findUnique.mockResolvedValue({
        id: 'wh_1',
        userId: 'user_1',
        targetUrl: 'https://api.github.com/webhook',
        events: ['order.created'],
        isActive: false,
        isPaused: true,
        lastOrderId: BigInt(10),
        lastProductId: BigInt(0),
        lastDeliveryId: BigInt(0),
        lastAccountPayableId: BigInt(0),
        lastAccountReceivableId: BigInt(0),
      });
      prismaMock.webhookSubscription.update.mockImplementation(({ data }: any) =>
        Promise.resolve({ id: 'wh_1', userId: 'user_1', ...data }),
      );

      const result = await service.update('user_1', { isActive: true });
      expect(result.isActive).toBe(true);
      expect(result.isPaused).toBe(false);
      expect(result.consecutiveFailures).toBe(0);
    });
  });

  describe('resendDelivery', () => {
    it('deve rejeitar reenvio de entrega com status SUCCESS ou HTTP 2XX', async () => {
      prismaMock.webhookSubscription.findUnique.mockResolvedValue({
        id: 'wh_1',
        userId: 'user_1',
        targetUrl: 'https://api.github.com/webhook',
        isPaused: false,
      });
      prismaMock.webhookDelivery.findFirst.mockResolvedValue({
        id: 'del_1',
        subscriptionId: 'wh_1',
        status: 'SUCCESS',
        responseStatus: 200,
      });

      await expect(service.resendDelivery('user_1', 'del_1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('bulkResendDeliveries', () => {
    it('deve reenfileirar apenas entregas FAILED/PENDING nao-2XX e reativar webhook pausado', async () => {
      prismaMock.webhookSubscription.findUnique.mockResolvedValue({
        id: 'wh_1',
        userId: 'user_1',
        targetUrl: 'https://api.github.com/webhook',
        isPaused: true,
      });
      prismaMock.webhookDelivery.updateMany.mockResolvedValue({ count: 2 });
      prismaMock.webhookSubscription.update.mockResolvedValue({
        id: 'wh_1',
        isPaused: false,
        isActive: true,
      });

      const result = await service.bulkResendDeliveries('user_1', [
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440002',
      ]);

      expect(prismaMock.webhookDelivery.updateMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: [
              '550e8400-e29b-41d4-a716-446655440001',
              '550e8400-e29b-41d4-a716-446655440002',
            ],
          },
          subscriptionId: 'wh_1',
          status: { in: ['FAILED', 'PENDING'] },
          OR: [
            { responseStatus: null },
            { responseStatus: { lt: 200 } },
            { responseStatus: { gte: 300 } },
          ],
        },
        data: expect.objectContaining({
          status: 'PENDING',
          attempts: 0,
        }),
      });
      expect(prismaMock.webhookSubscription.update).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.count).toBe(2);
      expect(result.reactivated).toBe(true);
    });

    it('deve lancar NotFoundException quando nenhuma entrega elegivel for atualizada', async () => {
      prismaMock.webhookSubscription.findUnique.mockResolvedValue({
        id: 'wh_1',
        userId: 'user_1',
        targetUrl: 'https://api.github.com/webhook',
        isPaused: false,
      });
      prismaMock.webhookDelivery.updateMany.mockResolvedValue({ count: 0 });

      await expect(
        service.bulkResendDeliveries('user_1', [
          '550e8400-e29b-41d4-a716-446655440001',
        ]),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
