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

function parseFirebirdDate(val: any): string | null {
  if (!val) return null;
  if (val instanceof Date) {
    const y = val.getFullYear();
    const m = String(val.getMonth() + 1).padStart(2, '0');
    const d = String(val.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  const s = String(val).trim();
  return s.length >= 10 ? s.slice(0, 10) : s || null;
}

function parseFirebirdTime(val: any): string {
  if (!val) return '00:00:00';
  if (val instanceof Date) {
    const h = String(val.getHours()).padStart(2, '0');
    const m = String(val.getMinutes()).padStart(2, '0');
    const s = String(val.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }
  const s = String(val).trim();
  if (s.length === 5) return `${s}:00`;
  return s.slice(0, 8);
}

function fromBrazilDateTimeToUtc(dateStr: string, timeStr: string): Date {
  const cleanDate = (dateStr || '').trim().slice(0, 10);
  const cleanTime = (timeStr || '00:00:00').trim();
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

  // Cursor em memória para varredura sequencial de alterações em ESTOQUE
  private readonly lastStockSweepProductIdBySub = new Map<string, string>();

  /**
   * Converte linha da tabela ESTOQUE para objeto com preços estruturados por tabela no padrão do ERP
   */
  private mapStockRow(st: any) {
    const tabelasPreco: { TABELA: number; PRECO: number; PRECO_PROMOCIONAL: number | null }[] = [];
    for (let i = 1; i <= 12; i++) {
      const rawPrice = st[`PRO_PRECO${i}`];
      const priceNum = rawPrice != null ? Number(rawPrice) : 0;
      if (priceNum > 0) {
        const rawPromo = st[`PRO_PRECOP${i}`];
        const promoNum = rawPromo != null ? Number(rawPromo) : null;
        tabelasPreco.push({
          TABELA: i,
          PRECO: priceNum,
          PRECO_PROMOCIONAL: promoNum !== null && promoNum > 0 ? promoNum : null,
        });
      }
    }

    const table1 = tabelasPreco.find((p) => p.TABELA === 1);
    const defaultPrice = table1 ? table1.PRECO : (tabelasPreco[0]?.PRECO ?? 0);
    const defaultPromoPrice = table1 ? table1.PRECO_PROMOCIONAL : (tabelasPreco[0]?.PRECO_PROMOCIONAL ?? null);

    return {
      LOJ_CODIGO: Number(st.LOJ_CODIGO),
      EST_ATUAL: Number(st.EST_ATUAL) || 0,
      EST_APOIO: Number(st.EST_APOIO) || 0,
      PRECO: defaultPrice,
      PRECO_PROMOCIONAL: defaultPromoPrice,
      TABELAS_PRECO: tabelasPreco,
    };
  }

  /**
   * Calcula hash determinístico MD5 de um objeto ou nó de dados canônico
   */
  private computeDataHash(data: any): string {
    return crypto
      .createHash('md5')
      .update(JSON.stringify(data))
      .digest('hex');
  }

  /**
   * Filtra entidades cujos estados atuais diferem do último hash persistido no PostgreSQL.
   * Retorna os entityIds que sofreram alteração real ou que são inéditos.
   */
  private async filterModifiedEntities(
    tenantId: string,
    entityType: string,
    items: Array<{ id: string; hash: string }>,
  ): Promise<Set<string>> {
    if (items.length === 0) return new Set();

    const ids = items.map((i) => i.id);
    const storedStates = await this.prisma.webhookEntityState.findMany({
      where: {
        tenantId,
        entityType,
        entityId: { in: ids },
      },
      select: {
        entityId: true,
        stateHash: true,
      },
    });

    const storedMap = new Map<string, string>();
    for (const st of storedStates) {
      storedMap.set(st.entityId, st.stateHash);
    }

    const modifiedIds = new Set<string>();
    for (const item of items) {
      const existingHash = storedMap.get(item.id);
      if (!existingHash || existingHash !== item.hash) {
        modifiedIds.add(item.id);
      }
    }

    return modifiedIds;
  }

  /**
   * Grava ou atualiza os hashes de estado das entidades no PostgreSQL de forma durável
   */
  private async saveEntityStates(
    tenantId: string,
    entityType: string,
    items: Array<{ id: string; hash: string }>,
    tx?: any,
  ): Promise<void> {
    if (items.length === 0) return;
    const client = tx || this.prisma;

    for (const item of items) {
      await client.webhookEntityState.upsert({
        where: {
          tenantId_entityType_entityId: {
            tenantId,
            entityType,
            entityId: item.id,
          },
        },
        create: {
          tenantId,
          entityType,
          entityId: item.id,
          stateHash: item.hash,
        },
        update: {
          stateHash: item.hash,
        },
      });
    }
  }

  constructor(
    private readonly prisma: RegistryPrismaService,
    private readonly tenantConnectionService: TenantConnectionService,
    private readonly permissionResolver: PermissionResolver,
    private readonly emailService: EmailService,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Iniciando Webhook Worker autônomo (CDC com State Store durável)...');
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
        let lastOrderId = sub.lastOrderId !== undefined && sub.lastOrderId !== null ? BigInt(sub.lastOrderId) : -1n;
        let wasColdStart = false;

        // Proteção contra Cold-Start: se lastOrderId for -1 (novo webhook) ou 0 (legado desancorado)
        if (lastOrderId === -1n || lastOrderId === 0n) {
          const currentMax = await queryMaxId(
            'SELECT COALESCE(MAX(VEN_NUMERO), 0) AS MAX_ID FROM VENDAS',
            'SELECT COALESCE(MAX(PED_CODIGO), 0) AS MAX_ID FROM PEDIDOS',
          );

          if (lastOrderId === -1n || currentMax > 0) {
            const currentMaxBig = BigInt(currentMax);
            this.logger.log(
              `[Cold-Start Webhook] Ancorando cursor de pedidos da sub ${sub.id} (tenant: ${sub.user.user}): lastOrderId = ${currentMaxBig}`,
            );
            await this.prisma.webhookSubscription.update({
              where: { id: sub.id },
              data: { lastOrderId: currentMaxBig, lastOrderSyncAt: new Date() },
            });
            sub.lastOrderId = currentMaxBig;
            lastOrderId = currentMaxBig;
            wasColdStart = true;
          }
        }

        if (!wasColdStart && lastOrderId >= 0n) {
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
            [lastOrderId.toString()],
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

            const candidateOrders: Array<{ id: string; hash: string; eventType: string; payload: any }> = [];

            for (const sale of sales) {
              const venNumero = Number(sale.VEN_NUMERO);
              if (BigInt(venNumero) > maxSeenId) maxSeenId = BigInt(venNumero);

              const saleDate = parseFirebirdDate(sale.VEN_DATA) || getBrazilDateTime(new Date()).dateStr;
              const saleTime = parseFirebirdTime(sale.VEN_HORA);

              const payments: Array<{ CODIGO: number; DESCRICAO: string; VALOR: number }> = [];
              if (sale.FP1_CODIGO && Number(sale.FP1_CODIGO) > 0) {
                const val1 =
                  sale.VEN_TOTALPP1 !== null && sale.VEN_TOTALPP1 !== undefined
                    ? Number(sale.VEN_TOTALPP1)
                    : Number(sale.VEN_TOTALLIQUIDO || 0);
                payments.push({
                  CODIGO: Number(sale.FP1_CODIGO),
                  DESCRICAO: sale.FPG1_DESCRICAO ? String(sale.FPG1_DESCRICAO).trim() : 'Forma de Pagamento 1',
                  VALOR: Number(Number(val1).toFixed(2)),
                });
              }
              if (sale.FP2_CODIGO && Number(sale.FP2_CODIGO) > 0) {
                payments.push({
                  CODIGO: Number(sale.FP2_CODIGO),
                  DESCRICAO: sale.FPG2_DESCRICAO ? String(sale.FPG2_DESCRICAO).trim() : 'Forma de Pagamento 2',
                  VALOR: Number((Number(sale.VEN_TOTALPP2) || 0).toFixed(2)),
                });
              }
              if (sale.FP3_CODIGO && Number(sale.FP3_CODIGO) > 0) {
                payments.push({
                  CODIGO: Number(sale.FP3_CODIGO),
                  DESCRICAO: sale.FPG3_DESCRICAO ? String(sale.FPG3_DESCRICAO).trim() : 'Forma de Pagamento 3',
                  VALOR: Number((Number(sale.VEN_TOTALPP3) || 0).toFixed(2)),
                });
              }
              if (sale.FP4_CODIGO && Number(sale.FP4_CODIGO) > 0) {
                payments.push({
                  CODIGO: Number(sale.FP4_CODIGO),
                  DESCRICAO: sale.FPG4_DESCRICAO ? String(sale.FPG4_DESCRICAO).trim() : 'Forma de Pagamento 4',
                  VALOR: Number((Number(sale.VEN_TOTALPP4) || 0).toFixed(2)),
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

              const payloadData = {
                VEN_NUMERO: venNumero,
                VEN_NUMSITE: sale.VEN_NUMSITE ? String(sale.VEN_NUMSITE).trim() : null,
                VEN_TIPO: sale.VEN_TIPO ? String(sale.VEN_TIPO).trim() : null,
                LOJ_CODIGO: Number(sale.LOJ_CODIGO),
                LOJ_NOME: sale.LOJ_NOME ? String(sale.LOJ_NOME).trim() : null,
                LOJ_FANTASIA: sale.LOJ_FANTASIA ? String(sale.LOJ_FANTASIA).trim() : null,
                SIT_CODIGO: Number(sale.SIT_CODIGO),
                SIT_DESCRICAO: statusDesc,
                CLI_CODIGO: sale.CLI_CODIGO ? Number(sale.CLI_CODIGO) : null,
                CLI_NOME: sale.CLI_NOME ? String(sale.CLI_NOME).trim() : null,
                CLI_CPF_CNPJ: sale.CLI_CPF_CNPJ ? String(sale.CLI_CPF_CNPJ).trim() : null,
                CLI_FONE: sale.CLI_FONE ? String(sale.CLI_FONE).trim() : null,
                CLI_EMAIL: sale.CLI_EMAIL ? String(sale.CLI_EMAIL).trim() : null,
                FUN_CODIGO: sale.FUN_CODIGO ? Number(sale.FUN_CODIGO) : null,
                FUN_NOME: sale.FUN_NOME ? String(sale.FUN_NOME).trim() : null,
                USU_CODIGO: sale.USU_CODIGO ? Number(sale.USU_CODIGO) : null,
                USU_APELIDO: sale.USU_APELIDO ? String(sale.USU_APELIDO).trim() : null,
                VEN_TOTALBRUTO: Number(sale.VEN_TOTALBRUTO) || 0,
                VEN_TOTALDESC: Number(sale.VEN_TOTALDESC) || 0,
                VEN_TOTALLIQUIDO: Number(sale.VEN_TOTALLIQUIDO ?? sale.VEN_TOTALBRUTO) || 0,
                FORMAS_PAGAMENTO: payments,
                ITENS: itemsByOrder.get(venNumero) || [],
                VEN_DATA: saleDate,
                VEN_HORA: saleTime,
                links: {
                  self: `/api/v1/orders/${venNumero}`,
                  items: `/api/v1/orders/${venNumero}/items`,
                },
              };

              const dataHash = this.computeDataHash(payloadData);
              const payload = {
                id: `evt_ord_${crypto.randomBytes(8).toString('hex')}`,
                event: eventType,
                timestamp: new Date().toISOString(),
                tenant: sub.user.user,
                data: payloadData,
              };

              candidateOrders.push({
                id: String(venNumero),
                hash: dataHash,
                eventType,
                payload,
              });
            }

            const modifiedOrderIds = await this.filterModifiedEntities(
              sub.user.user,
              'order',
              candidateOrders.map((c) => ({ id: c.id, hash: c.hash })),
            );

            const deliveriesToCreate: any[] = [];
            const statesToPersist: Array<{ id: string; hash: string }> = [];

            for (const cand of candidateOrders) {
              if (modifiedOrderIds.has(cand.id)) {
                deliveriesToCreate.push({
                  subscriptionId: sub.id,
                  event: cand.eventType,
                  payload: cand.payload as any,
                  status: 'PENDING',
                });
                statesToPersist.push({ id: cand.id, hash: cand.hash });
              }
            }

            await this.prisma.$transaction(async (tx) => {
              if (deliveriesToCreate.length > 0) {
                await tx.webhookDelivery.createMany({
                  data: deliveriesToCreate,
                });
              }
              if (statesToPersist.length > 0) {
                await this.saveEntityStates(sub.user.user, 'order', statesToPersist, tx);
              }
              await tx.webhookSubscription.update({
                where: { id: sub.id },
                data: { lastOrderId: maxSeenId, lastOrderSyncAt: new Date() },
              });
            });
          }
        }
      }

      // 2. Produtos (products) - Requer permissão tenant.products.view
      if (
        (events.includes('product.created') || events.includes('product.updated')) &&
        allowed.has('tenant.products.view')
      ) {
        let lastProductId = sub.lastProductId !== undefined && sub.lastProductId !== null ? BigInt(sub.lastProductId) : -1n;
        let wasColdStart = false;

        if (lastProductId === -1n) {
          const currentMax = await queryMaxId(
            'SELECT COALESCE(MAX(PRO_CODIGO), 0) AS MAX_ID FROM PRODUTOS',
          );
          const currentMaxBig = BigInt(currentMax);
          const now = new Date();
          this.logger.log(
            `[Cold-Start Webhook] Ancorando cursor de produtos da sub ${sub.id} (tenant: ${sub.user.user}): lastProductId = ${currentMaxBig}`,
          );
          await this.prisma.webhookSubscription.update({
            where: { id: sub.id },
            data: { lastProductId: currentMaxBig, lastProductSyncAt: now },
          });
          sub.lastProductId = currentMaxBig;
          sub.lastProductSyncAt = now;
          lastProductId = currentMaxBig;
          wasColdStart = true;
        }

        if (!wasColdStart && lastProductId >= 0n) {
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
           P.PRO_DATACADASTRO, P.PRO_DATAALTERACAO, P.PRO_HORA,
           P.MAR_CODIGO, M.MAR_DESCRICAO,
           P.GRU_CODIGO, G.GRU_DESCRICAO
         FROM PRODUTOS P
         LEFT JOIN MARCAS M ON P.MAR_CODIGO = M.MAR_CODIGO
         LEFT JOIN GRUPOSPRO G ON P.GRU_CODIGO = G.GRU_CODIGO
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
            [syncDate, syncDate, syncTime, syncTime, lastProductId.toString()],
          );

          const stockSelectCols = `
        E.PRO_CODIGO, E.LOJ_CODIGO, E.EST_ATUAL, E.EST_APOIO, E.EST_DTALTERACAO,
        E.PRO_PRECO1, E.PRO_PRECO2, E.PRO_PRECO3, E.PRO_PRECO4, E.PRO_PRECO5, E.PRO_PRECO6,
        E.PRO_PRECO7, E.PRO_PRECO8, E.PRO_PRECO9, E.PRO_PRECO10, E.PRO_PRECO11, E.PRO_PRECO12,
        E.PRO_PRECOP1, E.PRO_PRECOP2, E.PRO_PRECOP3, E.PRO_PRECOP4, E.PRO_PRECOP5, E.PRO_PRECOP6,
        E.PRO_PRECOP7, E.PRO_PRECOP8, E.PRO_PRECOP9, E.PRO_PRECOP10, E.PRO_PRECOP11, E.PRO_PRECOP12
      `;

          const candidateProducts: Array<{ id: string; hash: string; eventType: string; payload: any }> = [];
          let maxSeenId = lastProductId;
          let maxSyncAt = sub.lastProductSyncAt;

          // 2.a Processamento de PRODUTOS (novos cadastros e alterações cadastrais)
          if (products.length > 0) {
            const prodIds = products.map((p: any) => String(p.PRO_CODIGO).trim()).filter(Boolean);
            const stockByProduct = new Map<string, any[]>();

            if (prodIds.length > 0) {
              try {
                const inPlaceholders = prodIds.map(() => '?').join(',');
                const rawStock = await queryPromise(
                  `SELECT ${stockSelectCols}
               FROM ESTOQUE E
               WHERE E.PRO_CODIGO IN (${inPlaceholders})
               ORDER BY E.PRO_CODIGO ASC, E.LOJ_CODIGO ASC`,
                  prodIds,
                );

                for (const st of rawStock) {
                  const pid = String(st.PRO_CODIGO).trim();
                  if (!stockByProduct.has(pid)) {
                    stockByProduct.set(pid, []);
                  }
                  stockByProduct.get(pid)!.push(this.mapStockRow(st));
                }
              } catch (err: any) {
                this.logger.warn(`Erro ao carregar estoque para produtos (${prodIds.join(',')}): ${err.message}`);
              }
            }

            for (const prod of products) {
              const proCodigoStr = String(prod.PRO_CODIGO).trim();
              const proCodigoNum = Number(prod.PRO_CODIGO);
              const proCodigoId = Number.isSafeInteger(proCodigoNum) ? proCodigoNum : proCodigoStr;
              const dtCad = parseFirebirdDate(prod.PRO_DATACADASTRO) || getBrazilDateTime(new Date()).dateStr;
              const dtAlt = parseFirebirdDate(prod.PRO_DATAALTERACAO);
              const hr = parseFirebirdTime(prod.PRO_HORA);

              const isCreated = !dtAlt || dtCad === dtAlt;
              let eventType = isCreated ? 'product.created' : 'product.updated';
              if (!events.includes(eventType)) {
                if (events.includes('product.created')) eventType = 'product.created';
                else if (events.includes('product.updated')) eventType = 'product.updated';
              }

              const stockList = stockByProduct.get(proCodigoStr) || [];
              const payloadData = {
                PRO_CODIGO: proCodigoId,
                PRO_CODIGOBAR: prod.PRO_CODIGOBAR ? String(prod.PRO_CODIGOBAR).trim() : null,
                PRO_DESCRICAO: prod.PRO_DESCRICAO ? String(prod.PRO_DESCRICAO).trim() : null,
                PRO_UNIDADE: prod.PRO_UNIDADE ? String(prod.PRO_UNIDADE).trim() : null,
                MAR_CODIGO: prod.MAR_CODIGO ? Number(prod.MAR_CODIGO) : null,
                MAR_DESCRICAO: prod.MAR_DESCRICAO ? String(prod.MAR_DESCRICAO).trim() : null,
                GRU_CODIGO: prod.GRU_CODIGO ? Number(prod.GRU_CODIGO) : null,
                GRU_DESCRICAO: prod.GRU_DESCRICAO ? String(prod.GRU_DESCRICAO).trim() : null,
                ESTOQUE: stockList,
                PRO_DATACADASTRO: `${dtCad} ${hr}`.trim(),
                PRO_DATAALTERACAO: `${dtAlt || dtCad} ${hr}`.trim(),
                links: { self: `/api/v1/products/id/${proCodigoStr}` },
              };

              const dataHash = this.computeDataHash(payloadData);
              const payload = {
                id: `evt_prd_${crypto.randomBytes(8).toString('hex')}`,
                event: eventType,
                timestamp: new Date().toISOString(),
                tenant: sub.user.user,
                data: payloadData,
              };

              candidateProducts.push({
                id: proCodigoStr,
                hash: dataHash,
                eventType,
                payload,
              });

              maxSeenId = BigInt(proCodigoStr);
              const latestDate = dtAlt || dtCad;
              maxSyncAt = fromBrazilDateTimeToUtc(latestDate, hr);
            }
          }

          // 2.b Varredura de alterações em ESTOQUE (para disparar product.updated)
          if (events.includes('product.updated')) {
            const todayStr = getBrazilDateTime(new Date()).dateStr;
            const lastStockProCode = this.lastStockSweepProductIdBySub.get(sub.id) || '';

            try {
              const modifiedStockProds = await queryPromise(
                `SELECT FIRST 25 E.PRO_CODIGO
             FROM ESTOQUE E
             WHERE E.EST_DTALTERACAO >= ? AND E.PRO_CODIGO > ?
             GROUP BY E.PRO_CODIGO
             ORDER BY E.PRO_CODIGO ASC`,
                [todayStr, lastStockProCode],
              );

              if (modifiedStockProds.length > 0) {
                const stockProdIds = modifiedStockProds
                  .map((r: any) => String(r.PRO_CODIGO).trim())
                  .filter(Boolean);

                const lastInBatch = stockProdIds[stockProdIds.length - 1];
                if (modifiedStockProds.length < 25) {
                  this.lastStockSweepProductIdBySub.set(sub.id, '');
                } else {
                  this.lastStockSweepProductIdBySub.set(sub.id, lastInBatch);
                }

                // Filtra produtos que já foram processados nesta mesma iteração por PRODUTOS
                const idsToLoad = stockProdIds.filter(
                  (pid) => !products.some((p: any) => String(p.PRO_CODIGO).trim() === pid),
                );

                if (idsToLoad.length > 0) {
                  const inPlaceholders = idsToLoad.map(() => '?').join(',');
                  const rawStockBatch = await queryPromise(
                    `SELECT ${stockSelectCols}
                 FROM ESTOQUE E
                 WHERE E.PRO_CODIGO IN (${inPlaceholders})
                 ORDER BY E.PRO_CODIGO ASC, E.LOJ_CODIGO ASC`,
                    idsToLoad,
                  );

                  const stockItemsByProd = new Map<string, any[]>();
                  for (const st of rawStockBatch) {
                    const pid = String(st.PRO_CODIGO).trim();
                    if (!stockItemsByProd.has(pid)) {
                      stockItemsByProd.set(pid, []);
                    }
                    stockItemsByProd.get(pid)!.push(this.mapStockRow(st));
                  }

                  const updatePlaceholders = idsToLoad.map(() => '?').join(',');
                  const updatedProdsDetails = await queryPromise(
                    `SELECT
                   P.PRO_CODIGO, P.PRO_CODIGOBAR, P.PRO_DESCRICAO, P.PRO_UNIDADE,
                   P.PRO_DATACADASTRO, P.PRO_DATAALTERACAO, P.PRO_HORA,
                   P.MAR_CODIGO, M.MAR_DESCRICAO,
                   P.GRU_CODIGO, G.GRU_DESCRICAO
                 FROM PRODUTOS P
                 LEFT JOIN MARCAS M ON P.MAR_CODIGO = M.MAR_CODIGO
                 LEFT JOIN GRUPOSPRO G ON P.GRU_CODIGO = G.GRU_CODIGO
                 WHERE P.PRO_CODIGO IN (${updatePlaceholders})`,
                    idsToLoad,
                  );

                  for (const prod of updatedProdsDetails) {
                    const proCodigoStr = String(prod.PRO_CODIGO).trim();
                    const proCodigoNum = Number(prod.PRO_CODIGO);
                    const proCodigoId = Number.isSafeInteger(proCodigoNum) ? proCodigoNum : proCodigoStr;
                    const dtCad = parseFirebirdDate(prod.PRO_DATACADASTRO) || todayStr;
                    const dtAlt = parseFirebirdDate(prod.PRO_DATAALTERACAO) || todayStr;
                    const hr = parseFirebirdTime(prod.PRO_HORA);

                    const payloadData = {
                      PRO_CODIGO: proCodigoId,
                      PRO_CODIGOBAR: prod.PRO_CODIGOBAR ? String(prod.PRO_CODIGOBAR).trim() : null,
                      PRO_DESCRICAO: prod.PRO_DESCRICAO ? String(prod.PRO_DESCRICAO).trim() : null,
                      PRO_UNIDADE: prod.PRO_UNIDADE ? String(prod.PRO_UNIDADE).trim() : null,
                      MAR_CODIGO: prod.MAR_CODIGO ? Number(prod.MAR_CODIGO) : null,
                      MAR_DESCRICAO: prod.MAR_DESCRICAO ? String(prod.MAR_DESCRICAO).trim() : null,
                      GRU_CODIGO: prod.GRU_CODIGO ? Number(prod.GRU_CODIGO) : null,
                      GRU_DESCRICAO: prod.GRU_DESCRICAO ? String(prod.GRU_DESCRICAO).trim() : null,
                      ESTOQUE: stockItemsByProd.get(proCodigoStr) || [],
                      PRO_DATACADASTRO: `${dtCad} ${hr}`.trim(),
                      PRO_DATAALTERACAO: `${dtAlt} ${hr}`.trim(),
                      links: { self: `/api/v1/products/id/${proCodigoStr}` },
                    };

                    const dataHash = this.computeDataHash(payloadData);
                    const payload = {
                      id: `evt_prd_${crypto.randomBytes(8).toString('hex')}`,
                      event: 'product.updated',
                      timestamp: new Date().toISOString(),
                      tenant: sub.user.user,
                      data: payloadData,
                    };

                    candidateProducts.push({
                      id: proCodigoStr,
                      hash: dataHash,
                      eventType: 'product.updated',
                      payload,
                    });
                  }
                }
              } else {
                this.lastStockSweepProductIdBySub.set(sub.id, '');
              }
            } catch (err: any) {
              this.logger.warn(`Erro na varredura de alterações em ESTOQUE da sub ${sub.id}: ${err.message}`);
            }
          }

          const modifiedProductIds = await this.filterModifiedEntities(
            sub.user.user,
            'product',
            candidateProducts.map((c) => ({ id: c.id, hash: c.hash })),
          );

          const deliveriesToCreate: any[] = [];
          const statesToPersist: Array<{ id: string; hash: string }> = [];

          for (const cand of candidateProducts) {
            if (modifiedProductIds.has(cand.id)) {
              deliveriesToCreate.push({
                subscriptionId: sub.id,
                event: cand.eventType,
                payload: cand.payload as any,
                status: 'PENDING',
              });
              statesToPersist.push({ id: cand.id, hash: cand.hash });
            }
          }

          if (deliveriesToCreate.length > 0 || products.length > 0) {
            if (
              products.length > 0 &&
              deliveriesToCreate.length === 0 &&
              maxSyncAt.getTime() <= new Date(sub.lastProductSyncAt).getTime() &&
              maxSeenId === lastProductId
            ) {
              maxSyncAt = new Date(maxSyncAt.getTime() + 1000);
            }

            await this.prisma.$transaction(async (tx) => {
              if (deliveriesToCreate.length > 0) {
                await tx.webhookDelivery.createMany({
                  data: deliveriesToCreate,
                });
              }
              if (statesToPersist.length > 0) {
                await this.saveEntityStates(sub.user.user, 'product', statesToPersist, tx);
              }
              if (products.length > 0) {
                await tx.webhookSubscription.update({
                  where: { id: sub.id },
                  data: { lastProductId: maxSeenId, lastProductSyncAt: maxSyncAt },
                });
                sub.lastProductId = maxSeenId;
                sub.lastProductSyncAt = maxSyncAt;
              }
            });
          }
        }
      }

      // 3. Entregas (deliveries) - Requer permissão tenant.deliveries.view
      if (
        (events.includes('delivery.created') || events.includes('delivery.updated')) &&
        allowed.has('tenant.deliveries.view')
      ) {
        let lastDeliveryId = sub.lastDeliveryId !== undefined && sub.lastDeliveryId !== null ? BigInt(sub.lastDeliveryId) : -1n;
        let wasColdStart = false;

        if (lastDeliveryId === -1n) {
          const currentMax = await queryMaxId(
            'SELECT COALESCE(MAX(ENT_NUMERO), 0) AS MAX_ID FROM ENTREGAS',
            'SELECT COALESCE(MAX(ENT_CODIGO), 0) AS MAX_ID FROM ENTREGAS',
          );
          const currentMaxBig = BigInt(currentMax);
          const now = new Date();
          this.logger.log(
            `[Cold-Start Webhook] Ancorando cursor de entregas da sub ${sub.id} (tenant: ${sub.user.user}): lastDeliveryId = ${currentMaxBig}`,
          );
          await this.prisma.webhookSubscription.update({
            where: { id: sub.id },
            data: { lastDeliveryId: currentMaxBig, lastDeliverySyncAt: now },
          });
          sub.lastDeliveryId = currentMaxBig;
          sub.lastDeliverySyncAt = now;
          lastDeliveryId = currentMaxBig;
          wasColdStart = true;
        }

        if (!wasColdStart && lastDeliveryId >= 0n) {
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
            [syncDate, syncDate, syncTime, syncTime, lastDeliveryId.toString()],
          );

          if (deliveries.length > 0) {
            let maxSeenId = lastDeliveryId;
            let maxSyncAt = sub.lastDeliverySyncAt;
            const candidateDeliveries: Array<{ id: string; hash: string; eventType: string; payload: any }> = [];

            for (const d of deliveries) {
              const entNumero = Number(d.ENT_NUMERO);
              const entDate = parseFirebirdDate(d.ENT_DATA) || getBrazilDateTime(new Date()).dateStr;
              const entBaixa = d.ENT_DATABAIXA ? parseFirebirdDate(d.ENT_DATABAIXA) : null;
              const entTime = parseFirebirdTime(d.ENT_HORA);

              const isUpdated = !!entBaixa || (d.TBS_CODIGO !== null && Number(d.TBS_CODIGO) > 1);
              let eventType = isUpdated ? 'delivery.updated' : 'delivery.created';
              if (!events.includes(eventType)) {
                if (events.includes('delivery.created')) eventType = 'delivery.created';
                else if (events.includes('delivery.updated')) eventType = 'delivery.updated';
              }

              const payloadData = {
                ENT_NUMERO: entNumero,
                VEN_NUMERO: d.VEN_NUMERO ? Number(d.VEN_NUMERO) : null,
                LOJ_CODIGO: d.LOJ_CODIGO ? Number(d.LOJ_CODIGO) : null,
                PRE_CODIGO: d.PRE_CODIGO ? Number(d.PRE_CODIGO) : null,
                PRE_NOME: d.PRE_NOME ? String(d.PRE_NOME).trim() : null,
                VEI_PLACA: d.VEI_PLACA ? String(d.VEI_PLACA).trim() : null,
                TBS_CODIGO:
                  d.TBS_CODIGO !== null && d.TBS_CODIGO !== undefined
                    ? Number(d.TBS_CODIGO)
                    : null,
                TBS_DESCRICAO: d.TBS_DESCRICAO ? String(d.TBS_DESCRICAO).trim() : null,
                SIT_CODIGO:
                  d.SIT_CODIGO !== null && d.SIT_CODIGO !== undefined
                    ? Number(d.SIT_CODIGO)
                    : null,
                ENT_DATA: entDate,
                ENT_HORA: entTime,
                ENT_DATABAIXA: entBaixa,
                links: { self: `/api/v1/deliveries/${entNumero}` },
              };

              const dataHash = this.computeDataHash(payloadData);
              const payload = {
                id: `evt_del_${crypto.randomBytes(8).toString('hex')}`,
                event: eventType,
                timestamp: new Date().toISOString(),
                tenant: sub.user.user,
                data: payloadData,
              };

              candidateDeliveries.push({
                id: String(entNumero),
                hash: dataHash,
                eventType,
                payload,
              });

              maxSeenId = BigInt(entNumero);
              const latestDate = entBaixa || entDate;
              maxSyncAt = fromBrazilDateTimeToUtc(latestDate, entTime);
            }

            const modifiedDeliveryIds = await this.filterModifiedEntities(
              sub.user.user,
              'delivery',
              candidateDeliveries.map((c) => ({ id: c.id, hash: c.hash })),
            );

            const deliveriesToCreate: any[] = [];
            const statesToPersist: Array<{ id: string; hash: string }> = [];

            for (const cand of candidateDeliveries) {
              if (modifiedDeliveryIds.has(cand.id)) {
                deliveriesToCreate.push({
                  subscriptionId: sub.id,
                  event: cand.eventType,
                  payload: cand.payload as any,
                  status: 'PENDING',
                });
                statesToPersist.push({ id: cand.id, hash: cand.hash });
              }
            }

            await this.prisma.$transaction(async (tx) => {
              if (deliveriesToCreate.length > 0) {
                await tx.webhookDelivery.createMany({
                  data: deliveriesToCreate,
                });
              }
              if (statesToPersist.length > 0) {
                await this.saveEntityStates(sub.user.user, 'delivery', statesToPersist, tx);
              }
              await tx.webhookSubscription.update({
                where: { id: sub.id },
                data: { lastDeliveryId: maxSeenId, lastDeliverySyncAt: maxSyncAt },
              });
            });
          }
        }
      }

      // 4. Contas a Pagar (account_payable) - Requer permissão tenant.account-payable.view
      if (
        (events.includes('account_payable.created') || events.includes('account_payable.updated')) &&
        allowed.has('tenant.account-payable.view')
      ) {
        let lastAccountPayableId = sub.lastAccountPayableId !== undefined && sub.lastAccountPayableId !== null ? BigInt(sub.lastAccountPayableId) : -1n;
        let wasColdStart = false;

        if (lastAccountPayableId === -1n) {
          const currentMax = await queryMaxId(
            'SELECT COALESCE(MAX(PAG_NUMERO), 0) AS MAX_ID FROM CONTASPAGAR',
            'SELECT COALESCE(MAX(PAG_CODIGO), 0) AS MAX_ID FROM CONTAS_PAGAR',
          );
          const currentMaxBig = BigInt(currentMax);
          const now = new Date();
          this.logger.log(
            `[Cold-Start Webhook] Ancorando cursor de contas a pagar da sub ${sub.id} (tenant: ${sub.user.user}): lastAccountPayableId = ${currentMaxBig}`,
          );
          await this.prisma.webhookSubscription.update({
            where: { id: sub.id },
            data: { lastAccountPayableId: currentMaxBig, lastAccountPayableSyncAt: now },
          });
          sub.lastAccountPayableId = currentMaxBig;
          sub.lastAccountPayableSyncAt = now;
          lastAccountPayableId = currentMaxBig;
          wasColdStart = true;
        }

        if (!wasColdStart && lastAccountPayableId >= 0n) {
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
            [syncDate, syncDate, lastAccountPayableId.toString()],
          );

          if (payables.length > 0) {
            let maxSeenId = lastAccountPayableId;
            let maxSyncAt = sub.lastAccountPayableSyncAt;
            const candidatePayables: Array<{ id: string; hash: string; eventType: string; payload: any }> = [];

            for (const p of payables) {
              const pagNumero = Number(p.PAG_NUMERO);
              const dtMov = parseFirebirdDate(p.PAG_DATAMOV) || getBrazilDateTime(new Date()).dateStr;
              const dtPag = p.PAG_DATAPAG ? parseFirebirdDate(p.PAG_DATAPAG) : null;
              const dueDate = parseFirebirdDate(p.PAG_DATAVENC);

              const isUpdated = !!dtPag || p.PAG_SITUACAO === 'L';
              let eventType = isUpdated ? 'account_payable.updated' : 'account_payable.created';
              if (!events.includes(eventType)) {
                if (events.includes('account_payable.created')) eventType = 'account_payable.created';
                else if (events.includes('account_payable.updated')) eventType = 'account_payable.updated';
              }

              const payloadData = {
                PAG_NUMERO: pagNumero,
                LOJ_CODIGO: p.LOJ_CODIGO ? Number(p.LOJ_CODIGO) : null,
                CRE_CODIGO: p.CRE_CODIGO ? Number(p.CRE_CODIGO) : null,
                CRE_NOME: p.CRE_NOME ? String(p.CRE_NOME).trim() : null,
                PAG_VALOR: Number(p.PAG_VALOR) || 0,
                PAG_DATAMOV: dtMov,
                PAG_DATAPAG: dtPag,
                PAG_DATAVENC: dueDate,
                PAG_SITUACAO: p.PAG_SITUACAO ? String(p.PAG_SITUACAO).trim() : null,
                links: { self: `/api/v1/account-payable/${pagNumero}` },
              };

              const dataHash = this.computeDataHash(payloadData);
              const payload = {
                id: `evt_pag_${crypto.randomBytes(8).toString('hex')}`,
                event: eventType,
                timestamp: new Date().toISOString(),
                tenant: sub.user.user,
                data: payloadData,
              };

              candidatePayables.push({
                id: String(pagNumero),
                hash: dataHash,
                eventType,
                payload,
              });

              maxSeenId = BigInt(pagNumero);
              const latestDate = dtPag || dtMov;
              maxSyncAt = fromBrazilDateTimeToUtc(latestDate, '00:00:00');
            }

            const modifiedPayableIds = await this.filterModifiedEntities(
              sub.user.user,
              'account_payable',
              candidatePayables.map((c) => ({ id: c.id, hash: c.hash })),
            );

            const deliveriesToCreate: any[] = [];
            const statesToPersist: Array<{ id: string; hash: string }> = [];

            for (const cand of candidatePayables) {
              if (modifiedPayableIds.has(cand.id)) {
                deliveriesToCreate.push({
                  subscriptionId: sub.id,
                  event: cand.eventType,
                  payload: cand.payload as any,
                  status: 'PENDING',
                });
                statesToPersist.push({ id: cand.id, hash: cand.hash });
              }
            }

            await this.prisma.$transaction(async (tx) => {
              if (deliveriesToCreate.length > 0) {
                await tx.webhookDelivery.createMany({
                  data: deliveriesToCreate,
                });
              }
              if (statesToPersist.length > 0) {
                await this.saveEntityStates(sub.user.user, 'account_payable', statesToPersist, tx);
              }
              await tx.webhookSubscription.update({
                where: { id: sub.id },
                data: { lastAccountPayableId: maxSeenId, lastAccountPayableSyncAt: maxSyncAt },
              });
            });
          }
        }
      }

      // 5. Contas a Receber (account_receivable) - Requer permissão tenant.account-receivable.view
      if (
        (events.includes('account_receivable.created') || events.includes('account_receivable.updated')) &&
        allowed.has('tenant.account-receivable.view')
      ) {
        let lastAccountReceivableId = sub.lastAccountReceivableId !== undefined && sub.lastAccountReceivableId !== null ? BigInt(sub.lastAccountReceivableId) : -1n;
        let wasColdStart = false;

        if (lastAccountReceivableId === -1n) {
          const currentMax = await queryMaxId(
            'SELECT COALESCE(MAX(REC_NUMERO), 0) AS MAX_ID FROM CONTASRECEBER',
            'SELECT COALESCE(MAX(REC_CODIGO), 0) AS MAX_ID FROM CONTAS_RECEBER',
          );
          const currentMaxBig = BigInt(currentMax);
          const now = new Date();
          this.logger.log(
            `[Cold-Start Webhook] Ancorando cursor de contas a receber da sub ${sub.id} (tenant: ${sub.user.user}): lastAccountReceivableId = ${currentMaxBig}`,
          );
          await this.prisma.webhookSubscription.update({
            where: { id: sub.id },
            data: { lastAccountReceivableId: currentMaxBig, lastAccountReceivableSyncAt: now },
          });
          sub.lastAccountReceivableId = currentMaxBig;
          sub.lastAccountReceivableSyncAt = now;
          lastAccountReceivableId = currentMaxBig;
          wasColdStart = true;
        }

        if (!wasColdStart && lastAccountReceivableId >= 0n) {
          const receivables = await queryPromise(
            `SELECT FIRST 25 
             REC.REC_NUMERO, CLI.LOJ_CODIGO, REC.CLI_CODIGO, CLI.CLI_NOME, CLI.CLI_CPF_CNPJ,
             REC.REC_VALOR, REC.REC_SITUACAO, REC.REC_DATAVENC
           FROM CONTASRECEBER REC
           LEFT JOIN CLIENTES CLI ON CLI.CLI_CODIGO = REC.CLI_CODIGO
           WHERE REC.REC_NUMERO > ?
           ORDER BY REC.REC_NUMERO ASC`,
            [lastAccountReceivableId.toString()],
          );

          if (receivables.length > 0) {
            let maxSeenId = lastAccountReceivableId;
            const candidateReceivables: Array<{ id: string; hash: string; eventType: string; payload: any }> = [];

            for (const r of receivables) {
              const recNumero = Number(r.REC_NUMERO);
              const dueDate = parseFirebirdDate(r.REC_DATAVENC);

              let eventType = 'account_receivable.created';
              if (!events.includes(eventType)) {
                if (events.includes('account_receivable.updated')) eventType = 'account_receivable.updated';
              }

              const payloadData = {
                REC_NUMERO: recNumero,
                LOJ_CODIGO: r.LOJ_CODIGO ? Number(r.LOJ_CODIGO) : null,
                CLI_CODIGO: r.CLI_CODIGO ? Number(r.CLI_CODIGO) : null,
                CLI_NOME: r.CLI_NOME ? String(r.CLI_NOME).trim() : null,
                CLI_CPF_CNPJ: r.CLI_CPF_CNPJ ? String(r.CLI_CPF_CNPJ).trim() : null,
                REC_VALOR: Number(r.REC_VALOR) || 0,
                REC_DATAVENC: dueDate,
                REC_SITUACAO: r.REC_SITUACAO ? String(r.REC_SITUACAO).trim() : null,
                links: { self: `/api/v1/account-receivable/${recNumero}` },
              };

              const dataHash = this.computeDataHash(payloadData);
              const payload = {
                id: `evt_rec_${crypto.randomBytes(8).toString('hex')}`,
                event: eventType,
                timestamp: new Date().toISOString(),
                tenant: sub.user.user,
                data: payloadData,
              };

              candidateReceivables.push({
                id: String(recNumero),
                hash: dataHash,
                eventType,
                payload,
              });

              maxSeenId = BigInt(recNumero);
            }

            const modifiedReceivableIds = await this.filterModifiedEntities(
              sub.user.user,
              'account_receivable',
              candidateReceivables.map((c) => ({ id: c.id, hash: c.hash })),
            );

            const deliveriesToCreate: any[] = [];
            const statesToPersist: Array<{ id: string; hash: string }> = [];

            for (const cand of candidateReceivables) {
              if (modifiedReceivableIds.has(cand.id)) {
                deliveriesToCreate.push({
                  subscriptionId: sub.id,
                  event: cand.eventType,
                  payload: cand.payload as any,
                  status: 'PENDING',
                });
                statesToPersist.push({ id: cand.id, hash: cand.hash });
              }
            }

            await this.prisma.$transaction(async (tx) => {
              if (deliveriesToCreate.length > 0) {
                await tx.webhookDelivery.createMany({
                  data: deliveriesToCreate,
                });
              }
              if (statesToPersist.length > 0) {
                await this.saveEntityStates(sub.user.user, 'account_receivable', statesToPersist, tx);
              }
              await tx.webhookSubscription.update({
                where: { id: sub.id },
                data: { lastAccountReceivableId: maxSeenId, lastAccountReceivableSyncAt: new Date() },
              });
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
