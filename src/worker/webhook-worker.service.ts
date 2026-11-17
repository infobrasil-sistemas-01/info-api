import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import * as crypto from 'crypto';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { PermissionResolver } from 'src/infra/rbac/permission-resolver.service';
import { EmailService } from 'src/infra/email/email.service';
import { assertPublicWebhookUrl } from 'src/modules/webhook/utils/webhook-security.util';

function getBrazilDateTime(val?: Date | string | null): { dateStr: string; timeStr: string } {
  if (!val) {
    return getBrazilDateTime(new Date());
  }
  const d = val instanceof Date ? val : new Date(val);
  if (isNaN(d.getTime())) {
    const s = String(val).trim();
    if (s.length >= 10) return { dateStr: s.slice(0, 10), timeStr: '00:00:00' };
    return getBrazilDateTime(new Date());
  }
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || '00';
  return {
    dateStr: `${get('year')}-${get('month')}-${get('day')}`,
    timeStr: `${get('hour')}:${get('minute')}:${get('second')}`,
  };
}

function parseFirebirdDate(val: any): string {
  if (!val) return getBrazilDateTime(new Date()).dateStr;
  if (val instanceof Date) {
    return getBrazilDateTime(val).dateStr;
  }
  const s = String(val).trim();
  return s.length >= 10 ? s.slice(0, 10) : s;
}

function parseFirebirdTime(val: any): string {
  if (!val) return '00:00:00';
  if (val instanceof Date) {
    return getBrazilDateTime(val).timeStr;
  }
  const s = String(val).trim();
  if (s.length === 5) return `${s}:00`;
  return s.slice(0, 8);
}

function fromBrazilDateTimeToUtc(dateStr: string, timeStr: string): Date {
  const cleanDate = (dateStr || '').trim().slice(0, 10);
  const cleanTime = (timeStr || '00:00:00').trim().slice(0, 8);
  const normalizedTime = cleanTime.length === 5 ? `${cleanTime}:00` : cleanTime;
  return new Date(`${cleanDate}T${normalizedTime}-03:00`);
}

@Injectable()
export class WebhookWorkerService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(WebhookWorkerService.name);
  private isRunning = false;
  private pollerTimer?: NodeJS.Timeout;
  private dispatcherTimer?: NodeJS.Timeout;
  private cleanupTimer?: NodeJS.Timeout;

  constructor(
    private readonly prisma: RegistryPrismaService,
    private readonly tenantConnectionService: TenantConnectionService,
    private readonly permissionResolver: PermissionResolver,
    private readonly emailService: EmailService,
  ) {}

  onApplicationBootstrap() {
    this.logger.log('Iniciando Webhook Worker autônomo...');
    this.isRunning = true;
    this.startPollerLoop();
    this.startDispatcherLoop();
    this.startCleanupLoop();
  }

  onApplicationShutdown(signal?: string) {
    this.logger.log(`Encerrando Webhook Worker graciosamente (Signal: ${signal})...`);
    this.isRunning = false;
    if (this.pollerTimer) clearTimeout(this.pollerTimer);
    if (this.dispatcherTimer) clearTimeout(this.dispatcherTimer);
    if (this.cleanupTimer) clearTimeout(this.cleanupTimer);
  }

  /**
   * Assina o payload com HMAC-SHA256
   */
  private signPayload(secretKey: string, timestamp: number, payload: any): string {
    const signaturePayload = `${timestamp}.${typeof payload === 'string' ? payload : JSON.stringify(payload)}`;
    const hash = crypto
      .createHmac('sha256', secretKey)
      .update(signaturePayload)
      .digest('hex');
    return `t=${timestamp},v1=${hash}`;
  }

  // ==========================================
  // LOOP A: POLLER (Detecção nos Firebirds)
  // ==========================================
  private startPollerLoop() {
    const runPoller = async () => {
      if (!this.isRunning) return;
      try {
        await this.pollTenants();
      } catch (err: any) {
        this.logger.error(`Erro no loop do Poller de Webhooks: ${err.message}`, err.stack);
      } finally {
        if (this.isRunning) {
          this.pollerTimer = setTimeout(runPoller, 15000); // Executa a cada 15 segundos
        }
      }
    };

    this.pollerTimer = setTimeout(runPoller, 2000);
  }

  private async pollTenants() {
    // 1. Busca apenas assinaturas ATIVAS e NÃO PAUSADAS (Circuit Breaker)
    const subscriptions = await this.prisma.webhookSubscription.findMany({
      where: { isActive: true, isPaused: false },
      include: {
        user: {
          select: {
            id: true,
            user: true,
            dbCredentialsId: true,
          },
        },
      },
    });

    if (subscriptions.length === 0) return;

    for (const sub of subscriptions) {
      if (!this.isRunning) break;
      const credentialsId = sub.user.dbCredentialsId;
      if (!credentialsId) continue;

      try {
        await this.pollSingleTenant(sub, credentialsId);
      } catch (err: any) {
        this.logger.warn(
          `Falha ao executar polling para o tenant ${sub.user.user} (${sub.id}): ${err.message}`,
        );
      }
    }
  }

  private async pollSingleTenant(sub: any, credentialsId: string) {
    let connection: any;
    try {
      connection = await this.tenantConnectionService.getConnection(credentialsId);
    } catch {
      return; // Se o banco do cliente estiver inacessível, ignora silenciosamente nesta rodada
    }

    try {
      // Revalidação contínua de permissões em tempo de execução (Anti-TOCTOU)
      const snap = await this.permissionResolver.resolve(sub.user.id);
      const allowed = snap.allowedKeys;

      const queryPromise = (sql: string, params: any[] = []): Promise<any[]> => {
        return new Promise((resolve) => {
          connection.query(sql, params, (err: any, result: any[]) => {
            if (err || !result) {
              resolve([]);
            } else {
              resolve(result);
            }
          });
        });
      };

    const events = sub.events || [];

    // 1. Vendas / Pedidos (orders) - Requer permissão tenant.orders.view
    if (
      (events.includes('order.created') || events.includes('order.updated')) &&
      allowed.has('tenant.orders.view')
    ) {
      const sync = getBrazilDateTime(sub.lastOrderSyncAt);
      const nowBrazil = getBrazilDateTime(new Date());

      let syncDate = sync.dateStr;
      let syncTime = sync.timeStr;
      let lastOrderId = sub.lastOrderId || 0;

      // Proteção Anti-Drift: se o cursor estiver no futuro relativo ao relógio do Brasil (bug UTC),
      // reancora com lookback de 15 minutos para processar imediatamente eventos pendentes
      if (
        syncDate > nowBrazil.dateStr ||
        (syncDate === nowBrazil.dateStr && syncTime > nowBrazil.timeStr)
      ) {
        const lookback = new Date(Date.now() - 15 * 60 * 1000);
        const corrected = getBrazilDateTime(lookback);
        syncDate = corrected.dateStr;
        syncTime = corrected.timeStr;
        lastOrderId = 0;
      }

      const sales = await queryPromise(
        `SELECT FIRST 25
           V.VEN_NUMERO, V.LOJ_CODIGO, V.VEN_DATA, V.VEN_HORA,
           V.SIT_CODIGO, V.CLI_CODIGO, V.VEN_TOTALLIQUIDO, V.VEN_TOTALBRUTO
         FROM VENDAS V
         WHERE
           (V.VEN_DATA > ?)
           OR (
             V.VEN_DATA = ?
             AND (
               V.VEN_HORA > ?
               OR (V.VEN_HORA = ? AND V.VEN_NUMERO > ?)
             )
           )
         ORDER BY V.VEN_DATA ASC, V.VEN_HORA ASC, V.VEN_NUMERO ASC`,
        [syncDate, syncDate, syncTime, syncTime, lastOrderId],
      );

      if (sales.length > 0) {
        let maxSeenId = lastOrderId;
        let maxSyncAt = sub.lastOrderSyncAt;

        for (const sale of sales) {
          const venNumero = Number(sale.VEN_NUMERO);
          const saleDate = parseFirebirdDate(sale.VEN_DATA);
          const saleTime = parseFirebirdTime(sale.VEN_HORA);

          const payload = {
            id: `evt_ord_${crypto.randomBytes(8).toString('hex')}`,
            event: 'order.created',
            timestamp: new Date().toISOString(),
            tenant: sub.user.user,
            data: {
              orderId: venNumero,
              storeId: sale.LOJ_CODIGO,
              status: sale.SIT_CODIGO,
              totalValue: Number(sale.VEN_TOTALLIQUIDO ?? sale.VEN_TOTALBRUTO) || 0,
              clientId: sale.CLI_CODIGO,
              createdAt: `${saleDate} ${saleTime}`.trim(),
              links: { self: `/api/v1/orders/${venNumero}` },
            },
          };

          await this.prisma.webhookDelivery.create({
            data: {
              subscriptionId: sub.id,
              event: 'order.created',
              payload: payload as any,
              status: 'PENDING',
            },
          });

          maxSeenId = venNumero;
          maxSyncAt = fromBrazilDateTimeToUtc(saleDate, saleTime);
        }

        await this.prisma.webhookSubscription.update({
          where: { id: sub.id },
          data: { lastOrderId: maxSeenId, lastOrderSyncAt: maxSyncAt },
        });
      }
    }

    // 2. Produtos (products) - Requer permissão tenant.products.view
    if (
      (events.includes('product.created') || events.includes('product.updated')) &&
      allowed.has('tenant.products.view')
    ) {
      const sync = getBrazilDateTime(sub.lastProductSyncAt);
      const nowBrazil = getBrazilDateTime(new Date());

      let syncDate = sync.dateStr;
      let syncTime = sync.timeStr;
      let lastProductId = sub.lastProductId || 0;

      // Proteção Anti-Drift: se o cursor estiver no futuro relativo ao relógio do Brasil (bug UTC),
      // reancora com lookback de 15 minutos para processar imediatamente eventos pendentes
      if (
        syncDate > nowBrazil.dateStr ||
        (syncDate === nowBrazil.dateStr && syncTime > nowBrazil.timeStr)
      ) {
        const lookback = new Date(Date.now() - 15 * 60 * 1000);
        const corrected = getBrazilDateTime(lookback);
        syncDate = corrected.dateStr;
        syncTime = corrected.timeStr;
        lastProductId = 0;
      }

      const products = await queryPromise(
        `SELECT FIRST 25
           P.PRO_CODIGO, P.PRO_DESCRICAO, P.PRO_REFERENCIA, P.PRO_PRECOVENDA, P.PRO_ATIVO,
           P.PRO_DATACADASTRO, P.PRO_DATAALTERACAO, P.PRO_HORA
         FROM PRODUTOS P
         WHERE
           (COALESCE(P.PRO_DATAALTERACAO, P.PRO_DATACADASTRO) > ?)
           OR (
             COALESCE(P.PRO_DATAALTERACAO, P.PRO_DATACADASTRO) = ?
             AND (
               COALESCE(P.PRO_HORA, '00:00:00') > ?
               OR (COALESCE(P.PRO_HORA, '00:00:00') = ? AND P.PRO_CODIGO > ?)
             )
           )
         ORDER BY
           COALESCE(P.PRO_DATAALTERACAO, P.PRO_DATACADASTRO) ASC,
           COALESCE(P.PRO_HORA, '00:00:00') ASC,
           P.PRO_CODIGO ASC`,
        [syncDate, syncDate, syncTime, syncTime, lastProductId],
      );

      if (products.length > 0) {
        let maxSeenId = lastProductId;
        let maxSyncAt = sub.lastProductSyncAt;

        for (const prod of products) {
          const proCodigo = Number(prod.PRO_CODIGO);
          const dtCad = parseFirebirdDate(prod.PRO_DATACADASTRO);
          const dtAlt = parseFirebirdDate(prod.PRO_DATAALTERACAO);
          const hr = parseFirebirdTime(prod.PRO_HORA);

          const isCreated = !prod.PRO_DATACADASTRO || dtCad === dtAlt;
          const eventType = isCreated ? 'product.created' : 'product.updated';

          const payload = {
            id: `evt_prd_${crypto.randomBytes(8).toString('hex')}`,
            event: eventType,
            timestamp: new Date().toISOString(),
            tenant: sub.user.user,
            data: {
              productId: proCodigo,
              description: prod.PRO_DESCRICAO,
              reference: prod.PRO_REFERENCIA,
              price: Number(prod.PRO_PRECOVENDA) || 0,
              active: prod.PRO_ATIVO === 'S' || prod.PRO_ATIVO === 1,
              registeredAt: `${dtCad} ${hr}`.trim(),
              updatedAt: `${dtAlt} ${hr}`.trim(),
              links: { self: `/api/v1/products/id/${proCodigo}` },
            },
          };

          await this.prisma.webhookDelivery.create({
            data: {
              subscriptionId: sub.id,
              event: eventType,
              payload: payload as any,
              status: 'PENDING',
            },
          });

          maxSeenId = proCodigo;
          const latestDate = dtAlt || dtCad;
          maxSyncAt = fromBrazilDateTimeToUtc(latestDate, hr);
        }

        await this.prisma.webhookSubscription.update({
          where: { id: sub.id },
          data: { lastProductId: maxSeenId, lastProductSyncAt: maxSyncAt },
        });
      }
    }

    // 3. Entregas (deliveries) - Requer permissão tenant.deliveries.view
    if (
      (events.includes('delivery.created') || events.includes('delivery.updated')) &&
      allowed.has('tenant.deliveries.view')
    ) {
      const deliveries = await queryPromise(
        `SELECT FIRST 20 ENT_CODIGO, PED_CODIGO, LOJ_CODIGO, ENT_STATUS, MOT_CODIGO, ENT_DATA
         FROM ENTREGAS
         WHERE ENT_CODIGO > ?
         ORDER BY ENT_CODIGO ASC`,
        [sub.lastDeliveryId],
      );

      if (deliveries.length > 0) {
        let maxSeenId = sub.lastDeliveryId;
        for (const d of deliveries) {
          const entCodigo = Number(d.ENT_CODIGO);
          if (entCodigo > maxSeenId) maxSeenId = entCodigo;

          const payload = {
            id: `evt_del_${crypto.randomBytes(8).toString('hex')}`,
            event: 'delivery.created',
            timestamp: new Date().toISOString(),
            tenant: sub.user.user,
            data: {
              deliveryId: entCodigo,
              orderId: d.PED_CODIGO,
              storeId: d.LOJ_CODIGO,
              status: d.ENT_STATUS,
              driverId: d.MOT_CODIGO,
              deliveryDate: d.ENT_DATA,
              links: { self: `/api/v1/deliveries/${entCodigo}` },
            },
          };

          await this.prisma.webhookDelivery.create({
            data: {
              subscriptionId: sub.id,
              event: 'delivery.created',
              payload: payload as any,
              status: 'PENDING',
            },
          });
        }

        await this.prisma.webhookSubscription.update({
          where: { id: sub.id },
          data: { lastDeliveryId: maxSeenId, lastDeliverySyncAt: new Date() },
        });
      }
    }

    // 4. Contas a Pagar (account_payable) - Requer permissão tenant.account-payable.view
    if (
      (events.includes('account_payable.created') || events.includes('account_payable.updated')) &&
      allowed.has('tenant.account-payable.view')
    ) {
      const payables = await queryPromise(
        `SELECT FIRST 20 PAG_CODIGO, PAG_VALOR, PAG_VENCIMENTO, PAG_SITUACAO, FOR_CODIGO, LOJ_CODIGO
         FROM CONTAS_PAGAR
         WHERE PAG_CODIGO > ?
         ORDER BY PAG_CODIGO ASC`,
        [sub.lastAccountPayableId],
      );

      if (payables.length > 0) {
        let maxSeenId = sub.lastAccountPayableId;
        for (const p of payables) {
          const pagCodigo = Number(p.PAG_CODIGO);
          if (pagCodigo > maxSeenId) maxSeenId = pagCodigo;

          const payload = {
            id: `evt_pag_${crypto.randomBytes(8).toString('hex')}`,
            event: 'account_payable.created',
            timestamp: new Date().toISOString(),
            tenant: sub.user.user,
            data: {
              payableId: pagCodigo,
              storeId: p.LOJ_CODIGO,
              supplierId: p.FOR_CODIGO,
              value: Number(p.PAG_VALOR) || 0,
              dueDate: p.PAG_VENCIMENTO,
              situation: p.PAG_SITUACAO,
              links: { self: `/api/v1/account-payable/${pagCodigo}` },
            },
          };

          await this.prisma.webhookDelivery.create({
            data: {
              subscriptionId: sub.id,
              event: 'account_payable.created',
              payload: payload as any,
              status: 'PENDING',
            },
          });
        }

        await this.prisma.webhookSubscription.update({
          where: { id: sub.id },
          data: { lastAccountPayableId: maxSeenId, lastAccountPayableSyncAt: new Date() },
        });
      }
    }

    // 5. Contas a Receber (account_receivable) - Requer permissão tenant.account-receivable.view
    if (
      (events.includes('account_receivable.created') || events.includes('account_receivable.updated')) &&
      allowed.has('tenant.account-receivable.view')
    ) {
      const receivables = await queryPromise(
        `SELECT FIRST 20 REC_CODIGO, REC_VALOR, REC_VENCIMENTO, REC_SITUACAO, CLI_CODIGO, LOJ_CODIGO, PED_CODIGO
         FROM CONTAS_RECEBER
         WHERE REC_CODIGO > ?
         ORDER BY REC_CODIGO ASC`,
        [sub.lastAccountReceivableId],
      );

      if (receivables.length > 0) {
        let maxSeenId = sub.lastAccountReceivableId;
        for (const r of receivables) {
          const recCodigo = Number(r.REC_CODIGO);
          if (recCodigo > maxSeenId) maxSeenId = recCodigo;

          const payload = {
            id: `evt_rec_${crypto.randomBytes(8).toString('hex')}`,
            event: 'account_receivable.created',
            timestamp: new Date().toISOString(),
            tenant: sub.user.user,
            data: {
              receivableId: recCodigo,
              storeId: r.LOJ_CODIGO,
              clientId: r.CLI_CODIGO,
              orderId: r.PED_CODIGO,
              value: Number(r.REC_VALOR) || 0,
              dueDate: r.REC_VENCIMENTO,
              situation: r.REC_SITUACAO,
              links: { self: `/api/v1/account-receivable/${recCodigo}` },
            },
          };

          await this.prisma.webhookDelivery.create({
            data: {
              subscriptionId: sub.id,
              event: 'account_receivable.created',
              payload: payload as any,
              status: 'PENDING',
            },
          });
        }

        await this.prisma.webhookSubscription.update({
          where: { id: sub.id },
          data: { lastAccountReceivableId: maxSeenId, lastAccountReceivableSyncAt: new Date() },
        });
      }
    }
  } finally {
    if (connection) {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}

  // ==========================================
  // LOOP B: DISPATCHER (Despacho HTTP)
  // ==========================================
  private startDispatcherLoop() {
    const runDispatcher = async () => {
      if (!this.isRunning) return;
      try {
        await this.dispatchDeliveries();
      } catch (err: any) {
        this.logger.error(`Erro no loop do Dispatcher de Webhooks: ${err.message}`, err.stack);
      } finally {
        if (this.isRunning) {
          this.dispatcherTimer = setTimeout(runDispatcher, 5000); // Executa a cada 5 segundos
        }
      }
    };

    this.dispatcherTimer = setTimeout(runDispatcher, 3000);
  }

  private async dispatchDeliveries() {
    const now = new Date();

    const pendingDeliveries = await this.prisma.webhookDelivery.findMany({
      where: {
        OR: [
          { status: 'PENDING' },
          {
            status: 'FAILED',
            attempts: { lt: 4 },
            nextRetryAt: { lte: now },
          },
        ],
      },
      include: {
        subscription: true,
      },
      take: 25,
      orderBy: { createdAt: 'asc' },
    });

    if (pendingDeliveries.length === 0) return;

    for (const delivery of pendingDeliveries) {
      if (!this.isRunning) break;
      await this.dispatchSingle(delivery);
    }
  }

  private async dispatchSingle(delivery: any) {
    const sub = delivery.subscription;
    if (!sub || !sub.isActive) {
      await this.prisma.webhookDelivery.update({
        where: { id: delivery.id },
        data: { status: 'FAILED', lastError: 'Assinatura inativa ou removida' },
      });
      return;
    }

    if (sub.isPaused) {
      await this.prisma.webhookDelivery.update({
        where: { id: delivery.id },
        data: {
          status: 'FAILED',
          lastError: 'Assinatura pausada pelo Circuit Breaker',
        },
      });
      return;
    }

    // 1. Proteção em tempo de execução contra SSRF / DNS Rebinding
    try {
      await assertPublicWebhookUrl(sub.targetUrl);
    } catch (ssrfErr: any) {
      await this.prisma.webhookDelivery.update({
        where: { id: delivery.id },
        data: {
          status: 'FAILED',
          attempts: (delivery.attempts || 0) + 1,
          lastError: `SSRF_BLOCKED: ${ssrfErr.message}`,
          nextRetryAt: null,
        },
      });
      this.logger.error(
        `Disparo de webhook ${delivery.id} bloqueado por política Anti-SSRF (${sub.targetUrl}): ${ssrfErr.message}`,
      );
      return;
    }

    const payload = delivery.payload;
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = this.signPayload(sub.secretKey, timestamp, payload);

    const startTime = Date.now();
    let responseStatus: number | null = null;
    let responseBody: string | null = null;
    let lastError: string | null = null;
    let isSuccess = false;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // Timeout estrito de 3 segundos

      const response = await fetch(sub.targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'InfoApi-Webhooks/1.0',
          'X-Info-Signature': signature,
          'X-Info-Event': delivery.event,
          'X-Info-Delivery-Id': delivery.id,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      responseStatus = response.status;
      const text = await response.text();
      responseBody = text.slice(0, 1000);

      if (response.ok) {
        isSuccess = true;
      } else {
        lastError = `HTTP ${response.status}: ${response.statusText}`;
      }
    } catch (err: any) {
      lastError = err.name === 'AbortError' ? 'Timeout de 3000ms atingido' : err.message;
    }

    const durationMs = Date.now() - startTime;
    const attempts = (delivery.attempts || 0) + 1;

    if (isSuccess) {
      await this.prisma.webhookDelivery.update({
        where: { id: delivery.id },
        data: {
          status: 'SUCCESS',
          responseStatus,
          responseBody,
          durationMs,
          attempts,
          lastError: null,
          nextRetryAt: null,
        },
      });

      // Se havia falhas consecutivas registradas na subscrição, reseta pois o endpoint voltou a responder 2xx
      if (sub.consecutiveFailures > 0) {
        await this.prisma.webhookSubscription.update({
          where: { id: sub.id },
          data: { consecutiveFailures: 0 },
        });
      }
    } else {
      // Exponential backoff: tentativa 1 -> +2 min; tentativa 2 -> +10 min; tentativa 3 -> +30 min
      const retryMinutes = [2, 10, 30][attempts - 1] || 60;
      const nextRetryAt =
        attempts < 4 ? new Date(Date.now() + retryMinutes * 60 * 1000) : null;

      await this.prisma.webhookDelivery.update({
        where: { id: delivery.id },
        data: {
          status: 'FAILED',
          responseStatus,
          responseBody,
          durationMs,
          attempts,
          lastError,
          nextRetryAt,
        },
      });

      this.logger.warn(
        `Falha ao entregar webhook ${delivery.id} (${delivery.event}) para ${sub.targetUrl}. Tentativa ${attempts}/4. Erro: ${lastError}`,
      );

      // Quando este evento específico esgota todas as 4 tentativas (falha definitiva do evento):
      if (attempts >= 4) {
        const updatedSub = await this.prisma.webhookSubscription.update({
          where: { id: sub.id },
          data: { consecutiveFailures: { increment: 1 } },
          include: { user: { select: { email: true, user: true } } },
        });

        // Se acumulou 5 eventos consecutivos distintos com falha, aciona o Circuit Breaker
        if (updatedSub.consecutiveFailures >= 5) {
          await this.prisma.webhookSubscription.update({
            where: { id: sub.id },
            data: {
              isPaused: true,
              isActive: false,
              pausedAt: new Date(),
              pauseReason:
                'Circuito aberto: 5 eventos consecutivos distintos falharam na entrega.',
            },
          });

          this.logger.error(
            `Circuit Breaker acionado para a subscrição ${sub.id} (tenant: ${updatedSub.user.user}). Webhook pausado após 5 eventos distintos com falha.`,
          );

          if (updatedSub.user?.email) {
            await this.sendCircuitBreakerAlertEmail(
              updatedSub.user.email,
              updatedSub.user.user,
              sub.targetUrl,
            );
          }
        }
      }
    }
  }

  /**
   * Envia e-mail de alerta notificando a suspensão da subscrição por Circuit Breaker
   */
  private async sendCircuitBreakerAlertEmail(
    toEmail: string,
    username: string,
    targetUrl: string,
  ) {
    const subject =
      '⚠️ [Alerta de Integração] Webhooks pausados por indisponibilidade - InfoBrasil Sistemas';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <div style="background-color: #d9534f; padding: 15px 20px; border-radius: 6px 6px 0 0; color: #fff;">
          <h2 style="margin: 0; font-size: 20px;">Alerta de Indisponibilidade de Webhook</h2>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 6px 6px; background-color: #fff;">
          <p>Olá, <strong>${username}</strong>,</p>
          <p>Detectamos que o seu endpoint de webhook configurado na InfoAPI falhou em responder com sucesso após <strong>5 eventos consecutivos distintos</strong>.</p>
          <div style="background-color: #f8f9fa; border-left: 4px solid #d9534f; padding: 12px 16px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Endpoint afetado:</strong> <code>${targetUrl}</code></p>
            <p style="margin: 5px 0 0 0;"><strong>Status:</strong> <span style="color: #d9534f; font-weight: bold;">PAUSADO (Circuit Breaker)</span></p>
          </div>
          <p>Para proteger a estabilidade da integração e evitar consumo inútil de recursos, os disparos automáticos foram <strong>suspensos temporariamente</strong>.</p>
          <h3 style="font-size: 16px; color: #111;">Como resolver?</h3>
          <ol style="padding-left: 20px;">
            <li>Verifique os logs do seu servidor/integrador (ex: n8n, API externa) para assegurar que ele esteja acessível e respondendo com status HTTP 2xx em menos de 3 segundos.</li>
            <li>Acesse o seu <strong>Painel InfoAPI</strong> no menu <em>Configurações &gt; Webhooks</em>.</li>
            <li>Clique no botão <strong>"Reativar Webhook"</strong> após normalizar seu serviço. O sistema executará uma checagem de integridade e retomará as notificações.</li>
          </ol>
          <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;" />
          <p style="font-size: 12px; color: #888;">Mensagem automática gerada pelo subsistema de Webhooks da InfoBrasil Sistemas.</p>
        </div>
      </div>
    `;

    try {
      await this.emailService.sendEmail(toEmail, subject, html);
      this.logger.log(
        `E-mail de alerta do Circuit Breaker enviado com sucesso para ${toEmail}`,
      );
    } catch (err: any) {
      this.logger.error(
        `Falha ao enviar e-mail de alerta do Circuit Breaker para ${toEmail}: ${err.message}`,
      );
    }
  }

  // ==========================================
  // LOOP C: CLEANUP (Regra 3: Limpeza de 7 dias)
  // ==========================================
  private startCleanupLoop() {
    const runCleanup = async () => {
      if (!this.isRunning) return;
      try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const deleted = await this.prisma.webhookDelivery.deleteMany({
          where: {
            createdAt: { lt: sevenDaysAgo },
          },
        });
        if (deleted.count > 0) {
          this.logger.log(
            `Limpeza de retenção de 7 dias executada: ${deleted.count} entregas antigas removidas.`,
          );
        }
      } catch (err: any) {
        this.logger.error(`Erro ao executar limpeza de 7 dias: ${err.message}`);
      } finally {
        if (this.isRunning) {
          this.cleanupTimer = setTimeout(runCleanup, 6 * 60 * 60 * 1000); // Roda a cada 6 horas
        }
      }
    };

    this.cleanupTimer = setTimeout(runCleanup, 60000); // Primeira checagem após 1 minuto
  }
}
