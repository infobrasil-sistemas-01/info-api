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
        return new Promise((resolve, reject) => {
          connection.query(sql, params, (err: any, result: any[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(result || []);
            }
          });
        });
      };

      const queryMaxId = async (
        sqlPrimary: string,
        sqlFallback?: string,
      ): Promise<number> => {
        try {
          const rows = await queryPromise(sqlPrimary);
          if (rows && rows.length > 0) {
            const firstRow = rows[0];
            const maxVal = Object.values(firstRow)[0] as number;
            return Number(maxVal) || 0;
          }
        } catch (err: any) {
          if (sqlFallback) {
            try {
              const fbRows = await queryPromise(sqlFallback);
              if (fbRows && fbRows.length > 0) {
                const firstRow = fbRows[0];
                const maxVal = Object.values(firstRow)[0] as number;
                return Number(maxVal) || 0;
              }
            } catch (fbErr: any) {
              this.logger.warn(`Query fallback de ancoragem falhou: ${fbErr.message}`);
            }
          } else {
            this.logger.warn(`Query de ancoragem falhou: ${err.message}`);
          }
        }
        return 0;
      };

    const events = sub.events || [];

    // 1. Vendas / Pedidos (orders) - Requer permissão tenant.orders.view
    // Abordagem 1: Sequência Monotônica Estrita por ID (Generator do Firebird)
    if (
      (events.includes('order.created') || events.includes('order.updated')) &&
      allowed.has('tenant.orders.view')
    ) {
      let lastOrderId = sub.lastOrderId ?? -1;
      let wasColdStart = false;

      // Proteção contra Cold-Start: se lastOrderId for -1 (novo webhook) ou 0 (legado desancorado)
      if (lastOrderId === -1 || lastOrderId === 0) {
        const currentMax = await queryMaxId(
          'SELECT COALESCE(MAX(VEN_NUMERO), 0) AS MAX_ID FROM VENDAS',
          'SELECT COALESCE(MAX(PED_CODIGO), 0) AS MAX_ID FROM PEDIDOS',
        );

        if (lastOrderId === -1 || currentMax > 0) {
          this.logger.log(
            `[Cold-Start Webhook] Ancorando cursor de pedidos da sub ${sub.id} (tenant: ${sub.user.user}): lastOrderId = ${currentMax}`,
          );
          await this.prisma.webhookSubscription.update({
            where: { id: sub.id },
            data: { lastOrderId: currentMax, lastOrderSyncAt: new Date() },
          });
          sub.lastOrderId = currentMax;
          lastOrderId = currentMax;
          wasColdStart = true;
        }
      }

      if (!wasColdStart && lastOrderId >= 0) {
        const sales = await queryPromise(
        `SELECT FIRST 25
           V.VEN_NUMERO, V.LOJ_CODIGO, LOJ.LOJ_NOME, LOJ.LOJ_FANTASIA,
           V.VEN_DATA, V.VEN_HORA,
           V.SIT_CODIGO, S.SIT_DESCRICAO,
           V.CLI_CODIGO, C.CLI_NOME, C.CLI_CPF_CNPJ, C.CLI_FONE, C.CLI_EMAIL,
           V.FUN_CODIGO, F.FUN_NOME,
           V.USU_CODIGO, U.USU_APELIDO,
           V.VEN_NUMSITE, V.VEN_TIPO,
           V.VEN_TOTALBRUTO, V.VEN_TOTALDESC, V.VEN_TOTALLIQUIDO,
           V.FP1_CODIGO, FPG1.FPG_DESCRICAO AS FPG1_DESCRICAO, V.VEN_TOTALPP1,
           V.FP2_CODIGO, FPG2.FPG_DESCRICAO AS FPG2_DESCRICAO, V.VEN_TOTALPP2,
           V.FP3_CODIGO, FPG3.FPG_DESCRICAO AS FPG3_DESCRICAO, V.VEN_TOTALPP3,
           V.FP4_CODIGO, FPG4.FPG_DESCRICAO AS FPG4_DESCRICAO, V.VEN_TOTALPP4
         FROM VENDAS V
         LEFT JOIN LOJAS LOJ ON LOJ.LOJ_CODIGO = V.LOJ_CODIGO
         LEFT JOIN SITUACAO S ON S.SIT_CODIGO = V.SIT_CODIGO
         LEFT JOIN CLIENTES C ON C.CLI_CODIGO = V.CLI_CODIGO
         LEFT JOIN FUNCIONARIOS F ON F.FUN_CODIGO = V.FUN_CODIGO
         LEFT JOIN USUARIOS U ON U.USU_CODIGO = V.USU_CODIGO
         LEFT JOIN FORMASPAG FPG1 ON FPG1.FPG_CODIGO = V.FP1_CODIGO
         LEFT JOIN FORMASPAG FPG2 ON FPG2.FPG_CODIGO = V.FP2_CODIGO
         LEFT JOIN FORMASPAG FPG3 ON FPG3.FPG_CODIGO = V.FP3_CODIGO
         LEFT JOIN FORMASPAG FPG4 ON FPG4.FPG_CODIGO = V.FP4_CODIGO
         WHERE V.VEN_NUMERO > ?
         ORDER BY V.VEN_NUMERO ASC`,
        [lastOrderId],
      );

      if (sales.length > 0) {
        let maxSeenId = lastOrderId;
        const saleIds = sales.map((s: any) => Number(s.VEN_NUMERO)).filter(Boolean);
        const itemsByOrder = new Map<number, any[]>();

        if (saleIds.length > 0) {
          try {
            const rawItems = await queryPromise(
              `SELECT 
                 IV.VEN_NUMERO, IV.PRO_CODIGO, P.PRO_DESCRICAO, P.PRO_UNIDADE,
                 IV.IVD_QTDE, IV.IVD_PRECO, IV.IVD_DESCONTO, IV.IVD_TOTAL, IV.IVD_LIQUIDO
               FROM ITENSVEN IV
               LEFT JOIN PRODUTOS P ON P.PRO_CODIGO = IV.PRO_CODIGO
               WHERE IV.VEN_NUMERO IN (${saleIds.join(',')})
               ORDER BY IV.VEN_NUMERO ASC`,
            );

            for (const item of rawItems) {
              const orderId = Number(item.VEN_NUMERO);
              if (!itemsByOrder.has(orderId)) {
                itemsByOrder.set(orderId, []);
              }
              itemsByOrder.get(orderId)!.push({
                productId: Number(item.PRO_CODIGO),
                description: item.PRO_DESCRICAO ? String(item.PRO_DESCRICAO).trim() : null,
                unit: item.PRO_UNIDADE ? String(item.PRO_UNIDADE).trim() : null,
                quantity: Number(item.IVD_QTDE) || 0,
                unitPrice: Number(item.IVD_PRECO) || 0,
                discount: Number(item.IVD_DESCONTO) || 0,
                total: Number(item.IVD_TOTAL) || 0,
                netTotal: Number(item.IVD_LIQUIDO) || 0,
              });
            }
          } catch (err: any) {
            this.logger.warn(`Erro ao carregar itens de venda para webhook (${saleIds}): ${err.message}`);
          }
        }

        for (const sale of sales) {
          const venNumero = Number(sale.VEN_NUMERO);
          if (venNumero > maxSeenId) maxSeenId = venNumero;

          const saleDate = parseFirebirdDate(sale.VEN_DATA);
          const saleTime = parseFirebirdTime(sale.VEN_HORA);

          const payments: Array<{ code: number; name: string; value: number }> = [];
          if (sale.FP1_CODIGO && Number(sale.FP1_CODIGO) > 0) {
            const val1 =
              sale.VEN_TOTALPP1 !== null && sale.VEN_TOTALPP1 !== undefined
                ? Number(sale.VEN_TOTALPP1)
                : Number(sale.VEN_TOTALLIQUIDO || 0);
            payments.push({
              code: Number(sale.FP1_CODIGO),
              name: sale.FPG1_DESCRICAO ? String(sale.FPG1_DESCRICAO).trim() : 'Forma de Pagamento 1',
              value: Number(Number(val1).toFixed(2)),
            });
          }
          if (sale.FP2_CODIGO && Number(sale.FP2_CODIGO) > 0) {
            payments.push({
              code: Number(sale.FP2_CODIGO),
              name: sale.FPG2_DESCRICAO ? String(sale.FPG2_DESCRICAO).trim() : 'Forma de Pagamento 2',
              value: Number((Number(sale.VEN_TOTALPP2) || 0).toFixed(2)),
            });
          }
          if (sale.FP3_CODIGO && Number(sale.FP3_CODIGO) > 0) {
            payments.push({
              code: Number(sale.FP3_CODIGO),
              name: sale.FPG3_DESCRICAO ? String(sale.FPG3_DESCRICAO).trim() : 'Forma de Pagamento 3',
              value: Number((Number(sale.VEN_TOTALPP3) || 0).toFixed(2)),
            });
          }
          if (sale.FP4_CODIGO && Number(sale.FP4_CODIGO) > 0) {
            payments.push({
              code: Number(sale.FP4_CODIGO),
              name: sale.FPG4_DESCRICAO ? String(sale.FPG4_DESCRICAO).trim() : 'Forma de Pagamento 4',
              value: Number((Number(sale.VEN_TOTALPP4) || 0).toFixed(2)),
            });
          }

          const statusDesc = sale.SIT_DESCRICAO
            ? String(sale.SIT_DESCRICAO).trim()
            : sale.SIT_CODIGO === 2
              ? 'FECHADO'
              : sale.SIT_CODIGO === 3
                ? 'CANCELADO'
                : 'ABERTO';

          const isCreated = !sale.SIT_CODIGO || sale.SIT_CODIGO === 1;
          let eventType = isCreated ? 'order.created' : 'order.updated';
          if (!events.includes(eventType)) {
            if (events.includes('order.created')) eventType = 'order.created';
            else if (events.includes('order.updated')) eventType = 'order.updated';
          }

          const payload = {
            id: `evt_ord_${crypto.randomBytes(8).toString('hex')}`,
            event: eventType,
            timestamp: new Date().toISOString(),
            tenant: sub.user.user,
            data: {
              orderId: venNumero,
              siteOrderNumber: sale.VEN_NUMSITE ? String(sale.VEN_NUMSITE).trim() : null,
              orderType: sale.VEN_TIPO ? String(sale.VEN_TIPO).trim() : null,
              store: {
                id: Number(sale.LOJ_CODIGO),
                name: sale.LOJ_NOME ? String(sale.LOJ_NOME).trim() : null,
                tradeName: sale.LOJ_FANTASIA ? String(sale.LOJ_FANTASIA).trim() : null,
              },
              status: {
                code: Number(sale.SIT_CODIGO),
                description: statusDesc,
              },
              customer: sale.CLI_CODIGO
                ? {
                    id: Number(sale.CLI_CODIGO),
                    name: sale.CLI_NOME ? String(sale.CLI_NOME).trim() : null,
                    cpfCnpj: sale.CLI_CPF_CNPJ ? String(sale.CLI_CPF_CNPJ).trim() : null,
                    phone: sale.CLI_FONE ? String(sale.CLI_FONE).trim() : null,
                    email: sale.CLI_EMAIL ? String(sale.CLI_EMAIL).trim() : null,
                  }
                : null,
              seller: sale.FUN_CODIGO
                ? {
                    id: Number(sale.FUN_CODIGO),
                    name: sale.FUN_NOME ? String(sale.FUN_NOME).trim() : null,
                  }
                : null,
              operator: sale.USU_CODIGO
                ? {
                    id: Number(sale.USU_CODIGO),
                    username: sale.USU_APELIDO ? String(sale.USU_APELIDO).trim() : null,
                  }
                : null,
              totals: {
                gross: Number(sale.VEN_TOTALBRUTO) || 0,
                discount: Number(sale.VEN_TOTALDESC) || 0,
                net: Number(sale.VEN_TOTALLIQUIDO ?? sale.VEN_TOTALBRUTO) || 0,
              },
              payments,
              items: itemsByOrder.get(venNumero) || [],
              issuedAt: `${saleDate} ${saleTime}`.trim(),
              links: {
                self: `/api/v1/orders/${venNumero}`,
                items: `/api/v1/orders/${venNumero}/items`,
              },
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
        }

        await this.prisma.webhookSubscription.update({
          where: { id: sub.id },
          data: { lastOrderId: maxSeenId, lastOrderSyncAt: new Date() },
        });
      }
    }
  }

    // 2. Produtos (products) - Requer permissão tenant.products.view
    if (
      (events.includes('product.created') || events.includes('product.updated')) &&
      allowed.has('tenant.products.view')
    ) {
      let lastProductId = sub.lastProductId ?? -1;
      let wasColdStart = false;

      if (lastProductId === -1) {
        const currentMax = await queryMaxId(
          'SELECT COALESCE(MAX(PRO_CODIGO), 0) AS MAX_ID FROM PRODUTOS',
        );
        const now = new Date();
        this.logger.log(
          `[Cold-Start Webhook] Ancorando cursor de produtos da sub ${sub.id} (tenant: ${sub.user.user}): lastProductId = ${currentMax}`,
        );
        await this.prisma.webhookSubscription.update({
          where: { id: sub.id },
          data: { lastProductId: currentMax, lastProductSyncAt: now },
        });
        sub.lastProductId = currentMax;
        sub.lastProductSyncAt = now;
        lastProductId = currentMax;
        wasColdStart = true;
      }

      if (!wasColdStart && lastProductId >= 0) {
        const sync = getBrazilDateTime(sub.lastProductSyncAt);
        const nowBrazil = getBrazilDateTime(new Date());

        let syncDate = sync.dateStr;
        let syncTime = sync.timeStr;

        // Proteção Anti-Drift: só reancora se o cursor estiver mais de 1 hora no futuro (ex: bug UTC)
        const nowUtc = Date.now();
        const cursorUtc = new Date(sub.lastProductSyncAt).getTime();
        if (cursorUtc - nowUtc > 60 * 60 * 1000) {
          syncDate = nowBrazil.dateStr;
          syncTime = nowBrazil.timeStr;
        }

      const products = await queryPromise(
        `SELECT FIRST 25
           P.PRO_CODIGO, P.PRO_CODIGOBAR, P.PRO_DESCRICAO, P.PRO_UNIDADE,
           P.PRO_DATAALTERACAO,
           P.MAR_CODIGO, M.MAR_DESCRICAO,
           P.GRU_CODIGO, G.GRU_DESCRICAO
         FROM PRODUTOS P
         LEFT JOIN MARCAS M ON P.MAR_CODIGO = M.MAR_CODIGO
         LEFT JOIN GRUPOSPRO G ON P.GRU_CODIGO = G.GRU_CODIGO
         WHERE
           P.PRO_DATAALTERACAO > ?
           OR (P.PRO_DATAALTERACAO = ? AND P.PRO_CODIGO > ?)
         ORDER BY
           P.PRO_DATAALTERACAO ASC,
           P.PRO_CODIGO ASC`,
        [syncDate, syncDate, lastProductId],
      );

      if (products.length > 0) {
        let maxSeenId = lastProductId;
        let maxSyncAt = sub.lastProductSyncAt;

        const prodIds = products.map((p: any) => Number(p.PRO_CODIGO)).filter(Boolean);
        const stockByProduct = new Map<number, any[]>();

        if (prodIds.length > 0) {
          try {
            const rawStock = await queryPromise(
              `SELECT E.PRO_CODIGO, E.LOJ_CODIGO, E.EST_ATUAL, E.EST_APOIO
               FROM ESTOQUE E
               WHERE E.PRO_CODIGO IN (${prodIds.join(',')})
               ORDER BY E.PRO_CODIGO ASC, E.LOJ_CODIGO ASC`,
            );

            for (const st of rawStock) {
              const pid = Number(st.PRO_CODIGO);
              if (!stockByProduct.has(pid)) {
                stockByProduct.set(pid, []);
              }
              stockByProduct.get(pid)!.push({
                storeId: Number(st.LOJ_CODIGO),
                current: Number(st.EST_ATUAL) || 0,
                support: Number(st.EST_APOIO) || 0,
              });
            }
          } catch (err: any) {
            this.logger.warn(`Erro ao carregar estoque para produtos (${prodIds.join(',')}): ${err.message}`);
          }
        }

        for (const prod of products) {
          const proCodigo = Number(prod.PRO_CODIGO);
          const dtAlt = parseFirebirdDate(prod.PRO_DATAALTERACAO);

          let eventType = events.includes('product.updated')
            ? 'product.updated'
            : 'product.created';

          const payload = {
            id: `evt_prd_${crypto.randomBytes(8).toString('hex')}`,
            event: eventType,
            timestamp: new Date().toISOString(),
            tenant: sub.user.user,
            data: {
              productId: proCodigo,
              barcode: prod.PRO_CODIGOBAR ? String(prod.PRO_CODIGOBAR).trim() : null,
              description: prod.PRO_DESCRICAO ? String(prod.PRO_DESCRICAO).trim() : null,
              unit: prod.PRO_UNIDADE ? String(prod.PRO_UNIDADE).trim() : null,
              brand: prod.MAR_CODIGO
                ? {
                    id: Number(prod.MAR_CODIGO),
                    name: prod.MAR_DESCRICAO ? String(prod.MAR_DESCRICAO).trim() : null,
                  }
                : null,
              group: prod.GRU_CODIGO
                ? {
                    id: Number(prod.GRU_CODIGO),
                    name: prod.GRU_DESCRICAO ? String(prod.GRU_DESCRICAO).trim() : null,
                  }
                : null,
              stock: stockByProduct.get(proCodigo) || [],
              updatedAt: dtAlt,
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
          maxSyncAt = fromBrazilDateTimeToUtc(dtAlt, '00:00:00');
        }

        await this.prisma.webhookSubscription.update({
          where: { id: sub.id },
          data: { lastProductId: maxSeenId, lastProductSyncAt: maxSyncAt },
        });
      }
    }
  }

    // 3. Entregas (deliveries) - Requer permissão tenant.deliveries.view
    if (
      (events.includes('delivery.created') || events.includes('delivery.updated')) &&
      allowed.has('tenant.deliveries.view')
    ) {
      let lastDeliveryId = sub.lastDeliveryId ?? -1;
      let wasColdStart = false;

      if (lastDeliveryId === -1) {
        const currentMax = await queryMaxId(
          'SELECT COALESCE(MAX(ENT_NUMERO), 0) AS MAX_ID FROM ENTREGAS',
          'SELECT COALESCE(MAX(ENT_CODIGO), 0) AS MAX_ID FROM ENTREGAS',
        );
        const now = new Date();
        this.logger.log(
          `[Cold-Start Webhook] Ancorando cursor de entregas da sub ${sub.id} (tenant: ${sub.user.user}): lastDeliveryId = ${currentMax}`,
        );
        await this.prisma.webhookSubscription.update({
          where: { id: sub.id },
          data: { lastDeliveryId: currentMax, lastDeliverySyncAt: now },
        });
        sub.lastDeliveryId = currentMax;
        sub.lastDeliverySyncAt = now;
        lastDeliveryId = currentMax;
        wasColdStart = true;
      }

      if (!wasColdStart && lastDeliveryId >= 0) {
        const sync = getBrazilDateTime(sub.lastDeliverySyncAt);
        const nowBrazil = getBrazilDateTime(new Date());

        let syncDate = sync.dateStr;
        let syncTime = sync.timeStr;

        // Proteção Anti-Drift: só reancora se o cursor estiver mais de 1 hora no futuro (ex: bug UTC)
        const nowUtc = Date.now();
        const cursorUtc = new Date(sub.lastDeliverySyncAt).getTime();
        if (cursorUtc - nowUtc > 60 * 60 * 1000) {
          syncDate = nowBrazil.dateStr;
          syncTime = nowBrazil.timeStr;
        }

      const deliveries = await queryPromise(
        `SELECT FIRST 25 
           E.ENT_NUMERO, E.VEN_NUMERO, V.LOJ_CODIGO, 
           E.PRE_CODIGO, P.PRE_NOME, 
           E.SIT_CODIGO, 
           E.TBS_CODIGO, T.TBS_DESCRICAO, 
           E.VEI_PLACA, E.ENT_DATA, E.ENT_HORA, E.ENT_DATABAIXA
         FROM ENTREGAS E
         LEFT JOIN PRESTADORES P ON P.PRE_CODIGO = E.PRE_CODIGO
         LEFT JOIN VENDAS V ON V.VEN_NUMERO = E.VEN_NUMERO
         LEFT JOIN TABELA_STATUS T ON T.TBS_CODIGO = E.TBS_CODIGO
         WHERE
           (COALESCE(E.ENT_DATABAIXA, E.ENT_DATA) > ?)
           OR (
             COALESCE(E.ENT_DATABAIXA, E.ENT_DATA) = ?
             AND (
               COALESCE(E.ENT_HORA, '00:00:00') > ?
               OR (COALESCE(E.ENT_HORA, '00:00:00') = ? AND E.ENT_NUMERO > ?)
             )
           )
         ORDER BY
           COALESCE(E.ENT_DATABAIXA, E.ENT_DATA) ASC,
           COALESCE(E.ENT_HORA, '00:00:00') ASC,
           E.ENT_NUMERO ASC`,
        [syncDate, syncDate, syncTime, syncTime, lastDeliveryId],
      );

      if (deliveries.length > 0) {
        let maxSeenId = lastDeliveryId;
        let maxSyncAt = sub.lastDeliverySyncAt;

        for (const d of deliveries) {
          const entNumero = Number(d.ENT_NUMERO);
          const entDate = parseFirebirdDate(d.ENT_DATA);
          const entBaixa = d.ENT_DATABAIXA ? parseFirebirdDate(d.ENT_DATABAIXA) : null;
          const entTime = parseFirebirdTime(d.ENT_HORA);

          const isUpdated = !!entBaixa || (d.TBS_CODIGO !== null && Number(d.TBS_CODIGO) > 1);
          let eventType = isUpdated ? 'delivery.updated' : 'delivery.created';
          if (!events.includes(eventType)) {
            if (events.includes('delivery.created')) eventType = 'delivery.created';
            else if (events.includes('delivery.updated')) eventType = 'delivery.updated';
          }

          const payload = {
            id: `evt_del_${crypto.randomBytes(8).toString('hex')}`,
            event: eventType,
            timestamp: new Date().toISOString(),
            tenant: sub.user.user,
            data: {
              deliveryId: entNumero,
              orderId: d.VEN_NUMERO ? Number(d.VEN_NUMERO) : null,
              storeId: d.LOJ_CODIGO ? Number(d.LOJ_CODIGO) : null,
              driver: d.PRE_CODIGO
                ? {
                    id: Number(d.PRE_CODIGO),
                    name: d.PRE_NOME ? String(d.PRE_NOME).trim() : null,
                  }
                : null,
              vehiclePlate: d.VEI_PLACA ? String(d.VEI_PLACA).trim() : null,
              status: {
                code:
                  d.TBS_CODIGO !== null && d.TBS_CODIGO !== undefined
                    ? Number(d.TBS_CODIGO)
                    : null,
                description: d.TBS_DESCRICAO ? String(d.TBS_DESCRICAO).trim() : null,
                situation:
                  d.SIT_CODIGO !== null && d.SIT_CODIGO !== undefined
                    ? Number(d.SIT_CODIGO)
                    : null,
              },
              deliveryDate: entDate,
              deliveryTime: entTime,
              completionDate: entBaixa,
              links: { self: `/api/v1/deliveries/${entNumero}` },
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

          maxSeenId = entNumero;
          const latestDate = entBaixa || entDate;
          maxSyncAt = fromBrazilDateTimeToUtc(latestDate, entTime);
        }

        await this.prisma.webhookSubscription.update({
          where: { id: sub.id },
          data: { lastDeliveryId: maxSeenId, lastDeliverySyncAt: maxSyncAt },
        });
      }
    }
  }

    // 4. Contas a Pagar (account_payable) - Requer permissão tenant.account-payable.view
    if (
      (events.includes('account_payable.created') || events.includes('account_payable.updated')) &&
      allowed.has('tenant.account-payable.view')
    ) {
      let lastAccountPayableId = sub.lastAccountPayableId ?? -1;
      let wasColdStart = false;

      if (lastAccountPayableId === -1) {
        const currentMax = await queryMaxId(
          'SELECT COALESCE(MAX(PAG_NUMERO), 0) AS MAX_ID FROM CONTASPAGAR',
          'SELECT COALESCE(MAX(PAG_CODIGO), 0) AS MAX_ID FROM CONTAS_PAGAR',
        );
        const now = new Date();
        this.logger.log(
          `[Cold-Start Webhook] Ancorando cursor de contas a pagar da sub ${sub.id} (tenant: ${sub.user.user}): lastAccountPayableId = ${currentMax}`,
        );
        await this.prisma.webhookSubscription.update({
          where: { id: sub.id },
          data: { lastAccountPayableId: currentMax, lastAccountPayableSyncAt: now },
        });
        sub.lastAccountPayableId = currentMax;
        sub.lastAccountPayableSyncAt = now;
        lastAccountPayableId = currentMax;
        wasColdStart = true;
      }

      if (!wasColdStart && lastAccountPayableId >= 0) {
        const sync = getBrazilDateTime(sub.lastAccountPayableSyncAt);
        const nowBrazil = getBrazilDateTime(new Date());

        let syncDate = sync.dateStr;

        // Proteção Anti-Drift: só reancora se o cursor estiver mais de 1 hora no futuro (ex: bug UTC)
        const nowUtc = Date.now();
        const cursorUtc = new Date(sub.lastAccountPayableSyncAt).getTime();
        if (cursorUtc - nowUtc > 60 * 60 * 1000) {
          syncDate = nowBrazil.dateStr;
        }

      const payables = await queryPromise(
        `SELECT FIRST 25 
           CP.PAG_NUMERO, CP.LOJ_CODIGO, CP.CRE_CODIGO, C.CRE_NOME, 
           CP.PAG_VALOR, CP.PAG_SITUACAO, CP.PAG_DATAVENC, CP.PAG_DATAMOV, CP.PAG_DATAPAG
         FROM CONTASPAGAR CP
         LEFT JOIN CREDORES C ON CP.CRE_CODIGO = C.CRE_CODIGO
         WHERE
           (COALESCE(CP.PAG_DATAPAG, CP.PAG_DATAMOV) > ?)
           OR (
             COALESCE(CP.PAG_DATAPAG, CP.PAG_DATAMOV) = ?
             AND CP.PAG_NUMERO > ?
           )
         ORDER BY
           COALESCE(CP.PAG_DATAPAG, CP.PAG_DATAMOV) ASC,
           CP.PAG_NUMERO ASC`,
        [syncDate, syncDate, lastAccountPayableId],
      );

      if (payables.length > 0) {
        let maxSeenId = lastAccountPayableId;
        let maxSyncAt = sub.lastAccountPayableSyncAt;

        for (const p of payables) {
          const pagNumero = Number(p.PAG_NUMERO);
          const dtMov = parseFirebirdDate(p.PAG_DATAMOV);
          const dtPag = p.PAG_DATAPAG ? parseFirebirdDate(p.PAG_DATAPAG) : null;
          const dueDate = parseFirebirdDate(p.PAG_DATAVENC);

          const isUpdated = !!dtPag || p.PAG_SITUACAO === 'L';
          let eventType = isUpdated ? 'account_payable.updated' : 'account_payable.created';
          if (!events.includes(eventType)) {
            if (events.includes('account_payable.created')) eventType = 'account_payable.created';
            else if (events.includes('account_payable.updated')) eventType = 'account_payable.updated';
          }

          const payload = {
            id: `evt_pag_${crypto.randomBytes(8).toString('hex')}`,
            event: eventType,
            timestamp: new Date().toISOString(),
            tenant: sub.user.user,
            data: {
              payableId: pagNumero,
              storeId: p.LOJ_CODIGO ? Number(p.LOJ_CODIGO) : null,
              supplier: p.CRE_CODIGO
                ? {
                    id: Number(p.CRE_CODIGO),
                    name: p.CRE_NOME ? String(p.CRE_NOME).trim() : null,
                  }
                : null,
              value: Number(p.PAG_VALOR) || 0,
              issueDate: dtMov,
              paymentDate: dtPag,
              dueDate,
              situation: p.PAG_SITUACAO ? String(p.PAG_SITUACAO).trim() : null,
              links: { self: `/api/v1/account-payable/${pagNumero}` },
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

          maxSeenId = pagNumero;
          const latestDate = dtPag || dtMov;
          maxSyncAt = fromBrazilDateTimeToUtc(latestDate, '00:00:00');
        }

        await this.prisma.webhookSubscription.update({
          where: { id: sub.id },
          data: { lastAccountPayableId: maxSeenId, lastAccountPayableSyncAt: maxSyncAt },
        });
      }
    }
  }

    // 5. Contas a Receber (account_receivable) - Requer permissão tenant.account-receivable.view
    if (
      (events.includes('account_receivable.created') || events.includes('account_receivable.updated')) &&
      allowed.has('tenant.account-receivable.view')
    ) {
      let lastAccountReceivableId = sub.lastAccountReceivableId ?? -1;
      let wasColdStart = false;

      if (lastAccountReceivableId === -1) {
        const currentMax = await queryMaxId(
          'SELECT COALESCE(MAX(REC_NUMERO), 0) AS MAX_ID FROM CONTASRECEBER',
          'SELECT COALESCE(MAX(REC_CODIGO), 0) AS MAX_ID FROM CONTAS_RECEBER',
        );
        const now = new Date();
        this.logger.log(
          `[Cold-Start Webhook] Ancorando cursor de contas a receber da sub ${sub.id} (tenant: ${sub.user.user}): lastAccountReceivableId = ${currentMax}`,
        );
        await this.prisma.webhookSubscription.update({
          where: { id: sub.id },
          data: { lastAccountReceivableId: currentMax, lastAccountReceivableSyncAt: now },
        });
        sub.lastAccountReceivableId = currentMax;
        sub.lastAccountReceivableSyncAt = now;
        lastAccountReceivableId = currentMax;
        wasColdStart = true;
      }

      if (!wasColdStart && lastAccountReceivableId >= 0) {
        const receivables = await queryPromise(
          `SELECT FIRST 25 
             REC.REC_NUMERO, CLI.LOJ_CODIGO, REC.CLI_CODIGO, CLI.CLI_NOME, CLI.CLI_CPF_CNPJ,
             REC.REC_VALOR, REC.REC_SITUACAO, REC.REC_DATAVENC
           FROM CONTASRECEBER REC
           LEFT JOIN CLIENTES CLI ON CLI.CLI_CODIGO = REC.CLI_CODIGO
           WHERE REC.REC_NUMERO > ?
           ORDER BY REC.REC_NUMERO ASC`,
          [lastAccountReceivableId],
        );

        if (receivables.length > 0) {
          let maxSeenId = lastAccountReceivableId;

          for (const r of receivables) {
            const recNumero = Number(r.REC_NUMERO);
            const dueDate = parseFirebirdDate(r.REC_DATAVENC);

            let eventType = 'account_receivable.created';
            if (!events.includes(eventType)) {
              if (events.includes('account_receivable.updated')) eventType = 'account_receivable.updated';
            }

            const payload = {
              id: `evt_rec_${crypto.randomBytes(8).toString('hex')}`,
              event: eventType,
              timestamp: new Date().toISOString(),
              tenant: sub.user.user,
              data: {
                receivableId: recNumero,
                storeId: r.LOJ_CODIGO ? Number(r.LOJ_CODIGO) : null,
                customer: r.CLI_CODIGO
                  ? {
                      id: Number(r.CLI_CODIGO),
                      name: r.CLI_NOME ? String(r.CLI_NOME).trim() : null,
                      cpfCnpj: r.CLI_CPF_CNPJ ? String(r.CLI_CPF_CNPJ).trim() : null,
                    }
                  : null,
                value: Number(r.REC_VALOR) || 0,
                dueDate,
                situation: r.REC_SITUACAO ? String(r.REC_SITUACAO).trim() : null,
                links: { self: `/api/v1/account-receivable/${recNumero}` },
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

            maxSeenId = recNumero;
          }

          await this.prisma.webhookSubscription.update({
            where: { id: sub.id },
            data: { lastAccountReceivableId: maxSeenId, lastAccountReceivableSyncAt: new Date() },
          });
        }
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
