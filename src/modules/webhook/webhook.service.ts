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
    private readonly permissionResolver: PermissionResolver,
  ) { }

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
   * Cria uma nova inscrição de Webhook para o usuário (1:1).
   * Abordagem 1: Lazy Watermark via Sentinela (-1) no Worker (Desacoplamento Assíncrono).
   * O POST /webhooks responde imediatamente (< 20ms) sem travar no Firebird remoto.
   * Marcamos -1 nos cursores dos eventos assinados para que o Worker faça a auto-calibração no primeiro tick.
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

    // 1. Resolução segura de dbCredentialsId (caso não venha na claim do JWT)
    let effectiveCredentialsId = credentialsId;
    if (!effectiveCredentialsId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { dbCredentialsId: true },
      });
      effectiveCredentialsId = user?.dbCredentialsId ?? undefined;
    }

    if (!effectiveCredentialsId) {
      throw new BadRequestException(
        'Usuário não possui credenciais de banco de dados (dbCredentialsId) configuradas.',
      );
    }

    // 2. Validação de Governança / RBAC dos eventos
    await this.validateEventPermissions(userId, dto.events);

    // 3. Validação profunda Anti-SSRF (sintaxe + resolução de DNS para faixas públicas)
    await assertPublicWebhookUrl(dto.targetUrl);

    const secretKey = this.generateSecretKey();

    const hasOrder = dto.events.some((e) => e.startsWith('order.'));
    const hasProduct = dto.events.some((e) => e.startsWith('product.'));
    const hasDelivery = dto.events.some((e) => e.startsWith('delivery.'));
    const hasPayable = dto.events.some((e) => e.startsWith('account_payable.'));
    const hasReceivable = dto.events.some((e) => e.startsWith('account_receivable.'));

    const now = new Date();
    const subscription = await this.prisma.webhookSubscription.create({
      data: {
        userId,
        targetUrl: dto.targetUrl,
        events: dto.events,
        secretKey,
        isActive: true,
        isPaused: false,
        consecutiveFailures: 0,
        lastOrderId: hasOrder ? -1 : 0,
        lastProductId: hasProduct ? -1 : 0,
        lastDeliveryId: hasDelivery ? -1 : 0,
        lastAccountPayableId: hasPayable ? -1 : 0,
        lastAccountReceivableId: hasReceivable ? -1 : 0,
        lastOrderSyncAt: now,
        lastProductSyncAt: now,
        lastDeliverySyncAt: now,
        lastAccountPayableSyncAt: now,
        lastAccountReceivableSyncAt: now,
      },
    });

    this.logger.log(
      `Webhook criado para o usuário ${userId} com sentinelas cold-start (-1). URL: ${dto.targetUrl}`,
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
    } else if (dto.isActive === true && subscription.isPaused) {
      await assertPublicWebhookUrl(subscription.targetUrl);
    }

    const dataToUpdate: any = {
      targetUrl: dto.targetUrl ?? subscription.targetUrl,
      events: dto.events ?? subscription.events,
      isActive: dto.isActive !== undefined ? dto.isActive : subscription.isActive,
    };

    if (dto.isActive === true && subscription.isPaused) {
      dataToUpdate.isPaused = false;
      dataToUpdate.consecutiveFailures = 0;
      dataToUpdate.pausedAt = null;
      dataToUpdate.pauseReason = null;
    }

    if (dto.events && dto.events.length > 0) {
      if (
        dto.events.some((e) => e.startsWith('order.')) &&
        (subscription.lastOrderId === null || Number(subscription.lastOrderId) === 0)
      ) {
        dataToUpdate.lastOrderId = -1;
      }
      if (
        dto.events.some((e) => e.startsWith('product.')) &&
        (subscription.lastProductId === null || Number(subscription.lastProductId) === 0)
      ) {
        dataToUpdate.lastProductId = -1;
      }
      if (
        dto.events.some((e) => e.startsWith('delivery.')) &&
        (subscription.lastDeliveryId === null || Number(subscription.lastDeliveryId) === 0)
      ) {
        dataToUpdate.lastDeliveryId = -1;
      }
      if (
        dto.events.some((e) => e.startsWith('account_payable.')) &&
        (subscription.lastAccountPayableId === null || Number(subscription.lastAccountPayableId) === 0)
      ) {
        dataToUpdate.lastAccountPayableId = -1;
      }
      if (
        dto.events.some((e) => e.startsWith('account_receivable.')) &&
        (subscription.lastAccountReceivableId === null || Number(subscription.lastAccountReceivableId) === 0)
      ) {
        dataToUpdate.lastAccountReceivableId = -1;
      }
    }

    return this.prisma.webhookSubscription.update({
      where: { userId },
      data: dataToUpdate,
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
   * Retorna as últimas entregas com limite e paginação configurável
   */
  async getDeliveries(
    userId: string,
    limit: number = 50,
    page?: number,
  ): Promise<
    | WebhookDeliveryResponse[]
    | {
      data: WebhookDeliveryResponse[];
      meta: { total: number; page: number; limit: number; totalPages: number };
    }
  > {
    const safeLimit = Math.min(Math.max(limit || 25, 1), 100);
    const subscription = await this.prisma.webhookSubscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      if (page !== undefined) {
        return {
          data: [],
          meta: { total: 0, page: 1, limit: safeLimit, totalPages: 1 },
        };
      }
      return [];
    }

    if (page !== undefined) {
      const safePage = Math.max(page || 1, 1);
      const skip = (safePage - 1) * safeLimit;

      const [deliveries, total] = await Promise.all([
        this.prisma.webhookDelivery.findMany({
          where: { subscriptionId: subscription.id },
          orderBy: { createdAt: 'desc' },
          skip,
          take: safeLimit,
        }),
        this.prisma.webhookDelivery.count({
          where: { subscriptionId: subscription.id },
        }),
      ]);

      return {
        data: deliveries as unknown as WebhookDeliveryResponse[],
        meta: {
          total,
          page: safePage,
          limit: safeLimit,
          totalPages: Math.max(Math.ceil(total / safeLimit), 1),
        },
      };
    }

    const deliveries = await this.prisma.webhookDelivery.findMany({
      where: { subscriptionId: subscription.id },
      orderBy: { createdAt: 'desc' },
      take: safeLimit,
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
   * Reativa automaticamente a subscrição se estiver pausada pelo Circuit Breaker
   */
  private async reactivateSubscriptionIfPaused(
    subscription: { id: string; isPaused: boolean; targetUrl: string },
    tx: any,
  ): Promise<boolean> {
    if (!subscription.isPaused) return false;

    await tx.webhookSubscription.update({
      where: { id: subscription.id },
      data: {
        isPaused: false,
        isActive: true,
        consecutiveFailures: 0,
        pausedAt: null,
        pauseReason: null,
      },
    });
    return true;
  }

  /**
   * Reenvia uma entrega específica sob demanda (apenas status diferente de 2XX)
   */
  async resendDelivery(
    userId: string,
    deliveryId: string,
  ): Promise<{ success: boolean; reactivated: boolean; message: string }> {
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

    const isHttp2xx =
      delivery.responseStatus !== null &&
      delivery.responseStatus !== undefined &&
      delivery.responseStatus >= 200 &&
      delivery.responseStatus < 300;

    if (delivery.status === 'SUCCESS' || isHttp2xx) {
      throw new BadRequestException(
        'Apenas entregas com falha ou pendentes (status diferente de 2XX) podem ser reenviadas.',
      );
    }

    if (subscription.isPaused) {
      await assertPublicWebhookUrl(subscription.targetUrl);
    }

    const reactivated = await this.prisma.$transaction(async (tx) => {
      await tx.webhookDelivery.update({
        where: { id: delivery.id },
        data: {
          status: 'PENDING',
          nextRetryAt: new Date(),
          attempts: 0,
        },
      });
      return this.reactivateSubscriptionIfPaused(subscription, tx);
    });

    return {
      success: true,
      reactivated,
      message: reactivated
        ? 'Webhook reativado automaticamente e entrega reenfileirada para reenvio imediato.'
        : 'Entrega reenfileirada para reenvio imediato.',
    };
  }

  /**
   * Reenvia múltiplas entregas em lote sob demanda (apenas FAILED/PENDING com status diferente de 2XX)
   */
  async bulkResendDeliveries(
    userId: string,
    deliveryIds: string[],
  ): Promise<{
    success: boolean;
    count: number;
    reactivated: boolean;
    message: string;
  }> {
    const subscription = await this.prisma.webhookSubscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Webhook não encontrado para este usuário.');
    }

    const uniqueIds = Array.from(new Set(deliveryIds));

    if (subscription.isPaused) {
      await assertPublicWebhookUrl(subscription.targetUrl);
    }

    const { count, reactivated } = await this.prisma.$transaction(async (tx) => {
      const result = await tx.webhookDelivery.updateMany({
        where: {
          id: { in: uniqueIds },
          subscriptionId: subscription.id,
          status: { in: ['FAILED', 'PENDING'] },
          OR: [
            { responseStatus: null },
            { responseStatus: { lt: 200 } },
            { responseStatus: { gte: 300 } },
          ],
        },
        data: {
          status: 'PENDING',
          nextRetryAt: new Date(),
          attempts: 0,
        },
      });

      if (result.count === 0) {
        throw new NotFoundException(
          'Nenhuma entrega elegível (FAILED/PENDING com status diferente de 2XX) encontrada para reenvio.',
        );
      }

      const wasReactivated = await this.reactivateSubscriptionIfPaused(
        subscription,
        tx,
      );

      return { count: result.count, reactivated: wasReactivated };
    });

    return {
      success: true,
      count,
      reactivated,
      message: reactivated
        ? `Webhook reativado automaticamente e ${count} entrega(s) reenfileirada(s) para reenvio imediato.`
        : `${count} entrega(s) reenfileirada(s) para reenvio imediato.`,
    };
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
