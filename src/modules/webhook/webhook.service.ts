import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { PermissionResolver } from 'src/infra/rbac/permission-resolver.service';
import {
  CreateWebhookDto,
  EVENT_PERMISSION_MAP,
  type SupportedWebhookEvent,
} from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import {
  WebhookDeliveryResponse,
  WebhookSubscriptionResponse,
} from './dto/webhook-response.dto';
import { assertPublicWebhookUrl } from './utils/webhook-security.util';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly prisma: RegistryPrismaService,
    private readonly tenantConnectionService: TenantConnectionService,
    private readonly permissionResolver: PermissionResolver,
  ) {}

  /**
   * Valida se o usuário autenticado possui permissões de GET para os eventos solicitados
   */
  private async validateEventPermissions(
    userId: string,
    events: SupportedWebhookEvent[],
  ) {
    const snap = await this.permissionResolver.resolve(userId);
    const missingPermissions: { event: string; requiredPermission: string }[] = [];

    for (const ev of events) {
      const required = EVENT_PERMISSION_MAP[ev];
      if (required && !snap.allowedKeys.has(required)) {
        missingPermissions.push({ event: ev, requiredPermission: required });
      }
    }

    if (missingPermissions.length > 0) {
      const details = missingPermissions
        .map((m) => `'${m.event}' (requer: ${m.requiredPermission})`)
        .join(', ');
      throw new ForbiddenException(
        `Você não possui permissão de leitura para os seguintes eventos solicitados: ${details}`,
      );
    }
  }

  /**
   * Gera uma chave secreta de assinatura HMAC segura no formato whsec_...
   */
  private generateSecretKey(): string {
    return `whsec_${crypto.randomBytes(24).toString('hex')}`;
  }

  /**
   * Assina o payload com HMAC-SHA256
   */
  public signPayload(secretKey: string, timestamp: number, payload: any): string {
    const signaturePayload = `${timestamp}.${typeof payload === 'string' ? payload : JSON.stringify(payload)}`;
    const hash = crypto
      .createHmac('sha256', secretKey)
      .update(signaturePayload)
      .digest('hex');
    return `t=${timestamp},v1=${hash}`;
  }

  /**
   * Obtém os IDs máximos atuais no Firebird para inicializar os cursores no momento da ativação (Cold Start)
   */
  private async getInitialHighWaterMarks(credentialsId?: string) {
    const marks = {
      lastOrderId: 0,
      lastProductId: 0,
      lastDeliveryId: 0,
      lastAccountPayableId: 0,
      lastAccountReceivableId: 0,
    };

    if (!credentialsId) return marks;

    try {
      const connection =
        await this.tenantConnectionService.getConnection(credentialsId);

      const queryMax = (sql: string): Promise<number> => {
        return new Promise((resolve) => {
          connection.query(sql, [], (err: any, result: any[]) => {
            if (err || !result || result.length === 0) {
              resolve(0);
              return;
            }
            const firstRow = result[0];
            const maxVal = Object.values(firstRow)[0] as number;
            resolve(Number(maxVal) || 0);
          });
        });
      };

      const [maxOrder, maxProduct, maxDelivery, maxPayable, maxReceivable] =
        await Promise.all([
          queryMax('SELECT COALESCE(MAX(VEN_NUMERO), 0) FROM VENDAS').catch(
            () => queryMax('SELECT COALESCE(MAX(PED_CODIGO), 0) FROM PEDIDOS'),
          ),
          queryMax('SELECT COALESCE(MAX(PRO_CODIGO), 0) FROM PRODUTOS'),
          queryMax('SELECT COALESCE(MAX(ENT_CODIGO), 0) FROM ENTREGAS').catch(
            () => 0,
          ),
          queryMax(
            'SELECT COALESCE(MAX(PAG_CODIGO), 0) FROM CONTAS_PAGAR',
          ).catch(() => 0),
          queryMax(
            'SELECT COALESCE(MAX(REC_CODIGO), 0) FROM CONTAS_RECEBER',
          ).catch(() => 0),
        ]);

      marks.lastOrderId = maxOrder;
      marks.lastProductId = maxProduct;
      marks.lastDeliveryId = maxDelivery;
      marks.lastAccountPayableId = maxPayable;
      marks.lastAccountReceivableId = maxReceivable;
    } catch (err: any) {
      this.logger.warn(
        `Falha ao obter IDs iniciais do Firebird (${credentialsId}). Iniciando em 0. Detalhes: ${err.message}`,
      );
    }

    return marks;
  }

  /**
   * Cria uma nova inscrição de Webhook para o usuário (1:1)
   */
  async create(
    userId: string,
    dto: CreateWebhookDto,
    credentialsId?: string,
  ): Promise<WebhookSubscriptionResponse> {
    const existing = await this.prisma.webhookSubscription.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new ConflictException(
        'O usuário já possui um Webhook configurado. Cada usuário possui direito a estritamente uma inscrição ativa.',
      );
    }

    // 1. Validação de Governança / RBAC dos eventos
    await this.validateEventPermissions(userId, dto.events);

    // 2. Validação profunda Anti-SSRF (sintaxe + resolução de DNS para faixas públicas)
    await assertPublicWebhookUrl(dto.targetUrl);

    const secretKey = this.generateSecretKey();
    const marks = await this.getInitialHighWaterMarks(credentialsId);

    const subscription = await this.prisma.webhookSubscription.create({
      data: {
        userId,
        targetUrl: dto.targetUrl,
        events: dto.events,
        secretKey,
        isActive: true,
        isPaused: false,
        consecutiveFailures: 0,
        lastOrderId: marks.lastOrderId,
        lastProductId: marks.lastProductId,
        lastDeliveryId: marks.lastDeliveryId,
        lastAccountPayableId: marks.lastAccountPayableId,
        lastAccountReceivableId: marks.lastAccountReceivableId,
      },
    });

    this.logger.log(
      `Webhook criado para o usuário ${userId}. Initial Marks: ${JSON.stringify(marks)}`,
    );

    return subscription;
  }

  /**
   * Retorna a inscrição do usuário logado
   */
  async getMine(userId: string): Promise<WebhookSubscriptionResponse | null> {
    return this.prisma.webhookSubscription.findUnique({
      where: { userId },
    });
  }

  /**
   * Atualiza a inscrição do usuário logado
   */
  async update(
    userId: string,
    dto: UpdateWebhookDto,
  ): Promise<WebhookSubscriptionResponse> {
    const subscription = await this.prisma.webhookSubscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Nenhum Webhook configurado para este usuário.');
    }

    if (dto.events && dto.events.length > 0) {
      await this.validateEventPermissions(userId, dto.events);
    }

    if (dto.targetUrl && dto.targetUrl !== subscription.targetUrl) {
      await assertPublicWebhookUrl(dto.targetUrl);
    }

    return this.prisma.webhookSubscription.update({
      where: { userId },
      data: {
        targetUrl: dto.targetUrl ?? subscription.targetUrl,
        events: dto.events ?? subscription.events,
        isActive: dto.isActive !== undefined ? dto.isActive : subscription.isActive,
      },
    });
  }

  /**
   * Despausa a subscrição após correção pelo próprio cliente
   */
  async unpause(userId: string): Promise<WebhookSubscriptionResponse> {
    const subscription = await this.prisma.webhookSubscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Nenhum Webhook configurado para este usuário.');
    }

    // Valida se o endpoint continua seguro e público
    await assertPublicWebhookUrl(subscription.targetUrl);

    return this.prisma.webhookSubscription.update({
      where: { userId },
      data: {
        isPaused: false,
        isActive: true,
        consecutiveFailures: 0,
        pausedAt: null,
        pauseReason: null,
      },
    });
  }

  /**
   * Rotaciona a chave secreta HMAC
   */
  async rotateSecret(userId: string): Promise<WebhookSubscriptionResponse> {
    const subscription = await this.prisma.webhookSubscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Nenhum Webhook configurado para este usuário.');
    }

    const secretKey = this.generateSecretKey();

    return this.prisma.webhookSubscription.update({
      where: { userId },
      data: { secretKey },
    });
  }

  /**
   * Remove a inscrição de Webhook
   */
  async delete(userId: string): Promise<{ success: boolean; message: string }> {
    const subscription = await this.prisma.webhookSubscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Nenhum Webhook configurado para este usuário.');
    }

    await this.prisma.webhookSubscription.delete({
      where: { userId },
    });

    return { success: true, message: 'Webhook removido com sucesso.' };
  }

  /**
   * Retorna as últimas entregas com limite configurável
   */
  async getDeliveries(
    userId: string,
    limit: number = 50,
  ): Promise<WebhookDeliveryResponse[]> {
    const subscription = await this.prisma.webhookSubscription.findUnique({
      where: { userId },
    });

    if (!subscription) return [];

    const deliveries = await this.prisma.webhookDelivery.findMany({
      where: { subscriptionId: subscription.id },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100),
    });

    return deliveries as unknown as WebhookDeliveryResponse[];
  }

  /**
   * Dispara um evento de teste imediato (Ping) para a URL do cliente e registra a entrega
   */
  async testWebhook(userId: string): Promise<{
    success: boolean;
    statusCode: number | null;
    durationMs: number;
    responseBody: string | null;
    message: string;
  }> {
    const subscription = await this.prisma.webhookSubscription.findUnique({
      where: { userId },
      include: { user: { select: { user: true } } },
    });

    if (!subscription) {
      throw new NotFoundException('Nenhum Webhook configurado para este usuário.');
    }

    // Validação de segurança anti-SSRF antes do disparo de teste
    await assertPublicWebhookUrl(subscription.targetUrl);

    const testPayload = {
      id: `evt_test_${crypto.randomBytes(8).toString('hex')}`,
      event: 'test.ping',
      timestamp: new Date().toISOString(),
      tenant: subscription.user.user,
      data: {
        message: 'Teste de conectividade do Webhook da InfoAPI executado com sucesso.',
        configuredEvents: subscription.events,
      },
    };

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = this.signPayload(
      subscription.secretKey,
      timestamp,
      testPayload,
    );

    const startTime = Date.now();
    let responseStatus: number | null = null;
    let responseBody: string | null = null;
    let lastError: string | null = null;
    let status: 'SUCCESS' | 'FAILED' = 'FAILED';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(subscription.targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'InfoApi-Webhooks/1.0',
          'X-Info-Signature': signature,
          'X-Info-Event': 'test.ping',
          'X-Info-Delivery-Id': testPayload.id,
        },
        body: JSON.stringify(testPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      responseStatus = response.status;
      const text = await response.text();
      responseBody = text.slice(0, 1000); // limita o corpo armazenado

      if (response.ok) {
        status = 'SUCCESS';
      } else {
        lastError = `HTTP ${response.status}: ${response.statusText}`;
      }
    } catch (err: any) {
      lastError = err.name === 'AbortError' ? 'Timeout de 5000ms atingido' : err.message;
    }

    const durationMs = Date.now() - startTime;

    // Registra a entrega de teste na tabela deliveries
    await this.prisma.webhookDelivery.create({
      data: {
        subscriptionId: subscription.id,
        event: 'test.ping',
        payload: testPayload as any,
        status,
        responseStatus,
        responseBody,
        durationMs,
        attempts: 1,
        lastError,
      },
    });

    return {
      success: status === 'SUCCESS',
      statusCode: responseStatus,
      durationMs,
      responseBody,
      message:
        status === 'SUCCESS'
          ? 'Webhook de teste recebido com sucesso pela ponta.'
          : `Falha ao testar webhook: ${lastError}`,
    };
  }

  /**
   * Reenvia uma entrega específica sob demanda
   */
  async resendDelivery(
    userId: string,
    deliveryId: string,
  ): Promise<{ success: boolean; message: string }> {
    const subscription = await this.prisma.webhookSubscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Webhook não encontrado para este usuário.');
    }

    const delivery = await this.prisma.webhookDelivery.findFirst({
      where: { id: deliveryId, subscriptionId: subscription.id },
    });

    if (!delivery) {
      throw new NotFoundException('Entrega não encontrada.');
    }

    await this.prisma.webhookDelivery.update({
      where: { id: delivery.id },
      data: {
        status: 'PENDING',
        nextRetryAt: new Date(),
        attempts: 0,
      },
    });

    return { success: true, message: 'Entrega reenfileirada para reenvio imediato.' };
  }

  /**
   * Métricas de Webhooks para o Dashboard do Administrador
   */
  async getAdminMetrics() {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalSubscriptions,
      activeSubscriptions,
      totalDeliveries24h,
      successDeliveries24h,
      failedDeliveries24h,
      deliveries7d,
      recentFailures,
    ] = await Promise.all([
      this.prisma.webhookSubscription.count(),
      this.prisma.webhookSubscription.count({ where: { isActive: true } }),
      this.prisma.webhookDelivery.count({
        where: { createdAt: { gte: twentyFourHoursAgo } },
      }),
      this.prisma.webhookDelivery.count({
        where: {
          createdAt: { gte: twentyFourHoursAgo },
          status: 'SUCCESS',
        },
      }),
      this.prisma.webhookDelivery.count({
        where: {
          createdAt: { gte: twentyFourHoursAgo },
          status: 'FAILED',
        },
      }),
      this.prisma.webhookDelivery.findMany({
        where: {
          createdAt: { gte: sevenDaysAgo },
          durationMs: { not: null },
        },
        select: { durationMs: true },
        take: 1000,
      }),
      this.prisma.webhookDelivery.findMany({
        where: { status: 'FAILED' },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          subscription: {
            include: {
              user: { select: { user: true } },
            },
          },
        },
      }),
    ]);

    const avgDurationMs =
      deliveries7d.length > 0
        ? Math.round(
            deliveries7d.reduce((acc, d) => acc + (d.durationMs || 0), 0) /
              deliveries7d.length,
          )
        : 0;

    const successRatePercent =
      totalDeliveries24h > 0
        ? Math.round((successDeliveries24h / totalDeliveries24h) * 100)
        : 100;

    return {
      totalSubscriptions,
      activeSubscriptions,
      totalDeliveries24h,
      successDeliveries24h,
      failedDeliveries24h,
      successRatePercent,
      avgDurationMs,
      recentFailures: recentFailures.map((f) => ({
        id: f.id,
        event: f.event,
        tenant: f.subscription?.user?.user ?? 'desconhecido',
        targetUrl: f.subscription?.targetUrl ?? '',
        responseStatus: f.responseStatus,
        lastError: f.lastError,
        createdAt: f.createdAt,
      })),
    };
  }
}
