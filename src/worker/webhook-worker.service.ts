import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import * as crypto from 'crypto';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

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
    // 1. Busca apenas assinaturas ATIVAS
    const subscriptions = await this.prisma.webhookSubscription.findMany({
      where: { isActive: true },
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

    // 1. Pedidos (orders)
    if (events.includes('order.created') || events.includes('order.updated')) {
      const orders = await queryPromise(
        `SELECT FIRST 20 PED_CODIGO, LOJ_CODIGO, PED_TOTAL, PED_SITUACAO, CLI_CODIGO, PED_DATA, PED_HORA
         FROM PEDIDOS
         WHERE PED_CODIGO > ?
         ORDER BY PED_CODIGO ASC`,
        [sub.lastOrderId],
      );

      if (orders.length > 0) {
        let maxSeenId = sub.lastOrderId;
        for (const ord of orders) {
          const pedCodigo = Number(ord.PED_CODIGO);
          if (pedCodigo > maxSeenId) maxSeenId = pedCodigo;

          const payload = {
            id: `evt_ord_${crypto.randomBytes(8).toString('hex')}`,
            event: 'order.created',
            timestamp: new Date().toISOString(),
            tenant: sub.user.user,
            data: {
              orderId: pedCodigo,
              storeId: ord.LOJ_CODIGO,
              status: ord.PED_SITUACAO,
              totalValue: Number(ord.PED_TOTAL) || 0,
              clientId: ord.CLI_CODIGO,
              createdAt: `${ord.PED_DATA || ''} ${ord.PED_HORA || ''}`.trim(),
              links: { self: `/api/v1/orders/${pedCodigo}` },
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
        }

        await this.prisma.webhookSubscription.update({
          where: { id: sub.id },
          data: { lastOrderId: maxSeenId, lastOrderSyncAt: new Date() },
        });
      }
    }

    // 2. Produtos (products)
    if (events.includes('product.created') || events.includes('product.updated')) {
      const products = await queryPromise(
        `SELECT FIRST 20 PRO_CODIGO, PRO_DESCRICAO, PRO_REFERENCIA, PRO_PRECOVENDA, PRO_ATIVO
         FROM PRODUTOS
         WHERE PRO_CODIGO > ?
         ORDER BY PRO_CODIGO ASC`,
        [sub.lastProductId],
      );

      if (products.length > 0) {
        let maxSeenId = sub.lastProductId;
        for (const prod of products) {
          const proCodigo = Number(prod.PRO_CODIGO);
          if (proCodigo > maxSeenId) maxSeenId = proCodigo;

          const payload = {
            id: `evt_prd_${crypto.randomBytes(8).toString('hex')}`,
            event: 'product.created',
            timestamp: new Date().toISOString(),
            tenant: sub.user.user,
            data: {
              productId: proCodigo,
              description: prod.PRO_DESCRICAO,
              reference: prod.PRO_REFERENCIA,
              price: Number(prod.PRO_PRECOVENDA) || 0,
              active: prod.PRO_ATIVO === 'S' || prod.PRO_ATIVO === 1,
              links: { self: `/api/v1/products/id/${proCodigo}` },
            },
          };

          await this.prisma.webhookDelivery.create({
            data: {
              subscriptionId: sub.id,
              event: 'product.created',
              payload: payload as any,
              status: 'PENDING',
            },
          });
        }

        await this.prisma.webhookSubscription.update({
          where: { id: sub.id },
          data: { lastProductId: maxSeenId, lastProductSyncAt: new Date() },
        });
      }
    }

    // 3. Entregas (deliveries)
    if (events.includes('delivery.created') || events.includes('delivery.updated')) {
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

    // 4. Contas a Pagar (account_payable)
    if (events.includes('account_payable.created') || events.includes('account_payable.updated')) {
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

    // 5. Contas a Receber (account_receivable)
    if (events.includes('account_receivable.created') || events.includes('account_receivable.updated')) {
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
