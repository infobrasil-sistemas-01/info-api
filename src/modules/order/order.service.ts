import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { PostOrderDto } from './dto/create-order.dto';
import dayjs from 'dayjs';
import { SoldProductDto } from './dto/sold-product.dto';
import { ProductService } from '../product/product.service';
import { ReceiptService } from '../receipt/receipt.service';
import { OrderItemService } from './order-item/order-item.service';
import { PaginatedResponse } from 'src/common/pagination/paginated-response';
import { OrderMetricsResponseDto } from './dto/order-metrics-response.dto';
import { GetAbcCurveQueryDto } from './dto/get-abc-curve-query.dto';
import {
  AbcCurveResponseDto,
  AbcCurveItemDto,
} from './dto/abc-curve-response.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
    private readonly orderItemService: OrderItemService,
    private readonly productService: ProductService,
    private readonly receiptService: ReceiptService,
  ) {}

  async post(credentialsId: string, data: PostOrderDto, storeId: number) {
    let connection: any;
    connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const { products_sold, ...orderData } = data;

      const date = dayjs(orderData.date).format('YYYY-MM-DD');

      if (!date) {
        throw new BadRequestException('Formato de data inválido');
      }

      if (
        orderData.price_table_id &&
        (orderData.price_table_id < 1 || orderData.price_table_id > 12)
      ) {
        throw new BadRequestException(
          'A tabela de preços deve ser entre 1 e 12.',
        );
      }

      if (!products_sold || products_sold.length === 0) {
        throw new BadRequestException('Order must have at least one product');
      }

      // Ponto 1: Resolução segura do código de pagamento (FP1_CODIGO) e plano (PP1_CODIGO)
      const fp1Codigo = await this.resolvePaymentMethodCode(
        connection,
        orderData.payment_method,
      );
      const pp1Codigo = orderData.payment_plan_code
        ? Number(orderData.payment_plan_code)
        : 1;

      if (!orderData.user_id) {
        throw new BadRequestException(
          'O campo user_id (código do operador no ERP) é obrigatório.',
        );
      }

      if (!orderData.employee_id) {
        throw new BadRequestException(
          'O campo employee_id (código do funcionário/vendedor no ERP) é obrigatório.',
        );
      }

      await this.validateUserAndEmployee(
        connection,
        orderData.user_id,
        orderData.employee_id,
      );

      const transaction: any = await new Promise((resolve, reject) => {
        connection.startTransaction((err: any, transaction: any) => {
          if (err) {
            return reject(err);
          }
          resolve(transaction);
        });
      });

      try {
        // Ponto 2: Pré-validação e resolução dos produtos com fail-fast e cálculo do total
        const resolvedProducts: Array<{
          product: SoldProductDto;
          ourProduct: any;
        }> = [];

        let totalCalculated = 0;
        const priceTable =
          orderData.price_table_id &&
          Number(orderData.price_table_id) >= 1 &&
          Number(orderData.price_table_id) <= 12
            ? Math.floor(Number(orderData.price_table_id))
            : 1;

        for (const product of products_sold) {
          const ourProduct = (await this.productService.getById(
            credentialsId,
            storeId,
            product.product_id,
            priceTable,
          )) as any;

          if (!ourProduct) {
            throw new NotFoundException(
              `Produto ID ${product.product_id} não encontrado na loja ${storeId}`,
            );
          }

          const price =
            Number(
              ourProduct.PRO_PRECO_TABELA ??
                ourProduct[`PRO_PRECO${priceTable}`] ??
                ourProduct.PRO_PRECO1,
            ) || 0;
          totalCalculated += price * product.quantity;

          resolvedProducts.push({
            product,
            ourProduct,
          });
        }

        // Ponto 3: Inserção do cabeçalho da venda e itens dentro da transação protegida
        const order = (await this.insertOrderOnDb(
          transaction,
          {
            ...orderData,
            date,
          },
          storeId,
        )) as { VEN_NUMERO: number };

        for (const item of resolvedProducts) {
          await this.orderItemService.insertSoldProductOnDb(
            transaction,
            item.product,
            item.ourProduct,
            order.VEN_NUMERO,
            storeId,
            priceTable,
          );
        }

        await this.updateFinancial(
          transaction,
          order.VEN_NUMERO,
          {
            ...orderData,
            payment_method: String(fp1Codigo),
            payment_plan_code: pp1Codigo,
          },
          totalCalculated,
          fp1Codigo,
          pp1Codigo,
        );

        await new Promise((resolve, reject) => {
          transaction.commit((err: any) => {
            if (err) {
              return reject(
                new Error(
                  `Erro ao fazer commit do pedido ${order?.VEN_NUMERO ?? ''} da loja. Erro: ${err}`,
                ),
              );
            }
            resolve(true);
          });
        });

        return { orderId: order.VEN_NUMERO };
      } catch (txError) {
        // Ponto 3: Rollback garantido em caso de qualquer falha na transação
        try {
          if (typeof transaction?.rollback === 'function') {
            transaction.rollback();
          }
        } catch (rollbackErr) {
          this.logger.error(
            'Falha ao executar rollback da transação',
            rollbackErr,
          );
        }
        throw txError;
      }
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async generateReceipt(
    credentialsId: string,
    orderId: number,
    storeId: number,
    receiptData: { email: string; cpf?: string },
  ) {
    let connection: any;
    connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const transaction: any = await new Promise((resolve, reject) => {
        connection.startTransaction((err: any, transaction: any) => {
          if (err) return reject(err);
          resolve(transaction);
        });
      });

      await new Promise((resolve, reject) => {
        const query = `
        UPDATE VENDAS 
        SET VEN_EMAILCLI = ?, VEN_CPFCNPJ = ?, VEN_FISCO = ? 
        WHERE VEN_NUMERO = ?
      `;

        const params = [
          receiptData.email,
          receiptData.cpf || null,
          'S',
          orderId,
        ];

        transaction.query(query, params, (err: any) => {
          if (err) {
            transaction.rollback();
            return reject(err);
          }

          transaction.commit((err: any) => {
            if (err) {
              transaction.rollback();
              return reject(err);
            }

            resolve(true);
          });
        });
      });

      const result = (await this.receiptService.post(
        credentialsId,
        storeId,
        orderId,
      )) as { ID: number };

      return { receiptId: result.ID };
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async get(
    credentialsId: string,
    storeId?: number,
    page: number = 1,
    pageSize: number = 100,
    includeCount: boolean = false,
    filters: {
      startDate?: string;
      endDate?: string;
      clientId?: number;
      employeeId?: number;
    } = {},
  ) {
    let connection: any;
    connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      let whereClause = `WHERE 1=1`;
      const filterParams: any[] = [];

      if (storeId) {
        whereClause += ` AND V.LOJ_CODIGO = ?`;
        filterParams.push(storeId);
      }

      if (filters.startDate) {
        whereClause += ` AND V.VEN_DATA >= ?`;
        filterParams.push(filters.startDate);
      }

      if (filters.endDate) {
        whereClause += ` AND V.VEN_DATA <= ?`;
        filterParams.push(filters.endDate);
      }

      if (filters.clientId) {
        whereClause += ` AND V.CLI_CODIGO = ?`;
        filterParams.push(filters.clientId);
      }

      if (filters.employeeId) {
        whereClause += ` AND V.FUN_CODIGO = ?`;
        filterParams.push(filters.employeeId);
      }

      const queryParams: any[] = [
        pageSize,
        (page - 1) * pageSize,
        ...filterParams,
      ];

      const query = `SELECT FIRST ? SKIP ?
                  V.VEN_NUMERO,
                  V.LOJ_CODIGO,
                  LOJ.LOJ_NOME,
                  LOJ.LOJ_FANTASIA,
                  V.VEN_DATA,
                  V.VEN_HORA,
                  V.SIT_CODIGO,
                  S.SIT_DESCRICAO,
                  V.CLI_CODIGO,
                  C.CLI_NOME,
                  V.FUN_CODIGO,
                  F.FUN_NOME,
                  V.USU_CODIGO,
                  U.USU_APELIDO,
                  V.VEN_NUMSITE,
                  V.VEN_TIPO,
                  V.VEN_TOTALBRUTO,
                  V.VEN_TOTALDESC,
                  V.VEN_TOTALLIQUIDO,
                  V.FP1_CODIGO,
                  FPG1.FPG_DESCRICAO,
                  V.VEN_TOTALPP1,
                  V.PP1_CODIGO,
                  PLP.PLP_DESCRICAO,
                  V.FP2_CODIGO,
                  FPG2.FPG_DESCRICAO AS FPG2_DESCRICAO,
                  V.VEN_TOTALPP2,
                  V.FP3_CODIGO,
                  FPG3.FPG_DESCRICAO AS FPG3_DESCRICAO,
                  V.VEN_TOTALPP3,
                  V.FP4_CODIGO,
                  FPG4.FPG_DESCRICAO AS FPG4_DESCRICAO,
                  V.VEN_TOTALPP4
               FROM VENDAS V
               LEFT JOIN LOJAS LOJ ON LOJ.LOJ_CODIGO = V.LOJ_CODIGO
               LEFT JOIN FORMASPAG FPG1 ON FPG1.FPG_CODIGO = V.FP1_CODIGO
               LEFT JOIN FORMASPAG FPG2 ON FPG2.FPG_CODIGO = V.FP2_CODIGO
               LEFT JOIN FORMASPAG FPG3 ON FPG3.FPG_CODIGO = V.FP3_CODIGO
               LEFT JOIN FORMASPAG FPG4 ON FPG4.FPG_CODIGO = V.FP4_CODIGO
               LEFT JOIN PLANOSPAG PLP ON PLP.PLP_CODIGO = V.PP1_CODIGO
               LEFT JOIN CLIENTES C ON C.CLI_CODIGO = V.CLI_CODIGO
               LEFT JOIN FUNCIONARIOS F ON F.FUN_CODIGO = V.FUN_CODIGO
               LEFT JOIN USUARIOS U ON U.USU_CODIGO = V.USU_CODIGO
               LEFT JOIN SITUACAO S ON S.SIT_CODIGO = V.SIT_CODIGO
               ${whereClause}
               ORDER BY V.VEN_NUMERO DESC`;

      const queryStartTime = Date.now();
      const result = await new Promise((resolve, reject) => {
        connection.query(query, queryParams, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const queryEndTime = Date.now();

      let total: number | undefined;

      if (includeCount) {
        const countQuery = `SELECT COUNT(*) as total
                             FROM VENDAS V
                             LEFT JOIN LOJAS LOJ ON LOJ.LOJ_CODIGO = V.LOJ_CODIGO
                             LEFT JOIN CLIENTES C ON C.CLI_CODIGO = V.CLI_CODIGO
                             LEFT JOIN FUNCIONARIOS F ON F.FUN_CODIGO = V.FUN_CODIGO
                             LEFT JOIN USUARIOS U ON U.USU_CODIGO = V.USU_CODIGO
                             ${whereClause}`;
        const countRes = await new Promise((resolve, reject) => {
          connection.query(countQuery, filterParams, (err: any, res: any) => {
            if (err) return reject(err);
            resolve(res);
          });
        });

        const rawTotal =
          countRes?.[0]?.TOTAL ??
          countRes?.[0]?.total ??
          countRes?.[0]?.COUNT ??
          0;

        total = Number(rawTotal);
      }

      this.logger.log(
        `Busca de pedidos executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          { storeId, page, pageSize, ...filters },
        )}, Itens: ${Array.isArray(result) ? result.length : result ? 1 : 0}, Tempo SQL: ${
          queryEndTime - queryStartTime
        }ms`,
      );

      const enrichedResult = (Array.isArray(result) ? result : []).map((row) =>
        this.enrichOrderRow(row),
      );

      return new PaginatedResponse(enrichedResult, total, page, pageSize);
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async getById(
    credentialsId: string,
    storeId: number | undefined,
    id: number,
  ): Promise<object> {
    let connection: any;
    connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      let whereClause = `WHERE V.VEN_NUMERO = ?`;
      const params: any[] = [id];

      if (storeId) {
        whereClause += ` AND V.LOJ_CODIGO = ?`;
        params.push(storeId);
      }

      // Campos VEN_ENTREGA e VEN_MONTAGEM solicitados pelo Depósito Oliveira
      const query = `SELECT
                  V.VEN_NUMERO,
                  V.LOJ_CODIGO,
                  LOJ.LOJ_NOME,
                  LOJ.LOJ_FANTASIA,
                  V.VEN_DATA,
                  V.VEN_HORA,
                  V.SIT_CODIGO,
                  S.SIT_DESCRICAO,
                  V.CLI_CODIGO,
                  C.CLI_NOME,
                  V.FUN_CODIGO,
                  F.FUN_NOME,
                  V.USU_CODIGO,
                  U.USU_APELIDO,
                  V.VEN_NUMSITE,
                  V.LOJ_CODIGO,
                  V.VEN_TIPO,
                  V.VEN_PRECO,
                  V.VEN_TOTALBRUTO,
                  V.VEN_TOTALDESC,
                  V.VEN_TOTALLIQUIDO,
                  V.VEN_VALORPENDENTE,
                  V.VEN_VALORENC,
                  V.FP1_CODIGO,
                  FPG1.FPG_DESCRICAO,
                  V.VEN_TOTALPP1,
                  V.PP1_CODIGO,
                  PLP.PLP_DESCRICAO,
                  V.FP2_CODIGO,
                  FPG2.FPG_DESCRICAO AS FPG2_DESCRICAO,
                  V.VEN_TOTALPP2,
                  V.FP3_CODIGO,
                  FPG3.FPG_DESCRICAO AS FPG3_DESCRICAO,
                  V.VEN_TOTALPP3,
                  V.FP4_CODIGO,
                  FPG4.FPG_DESCRICAO AS FPG4_DESCRICAO,
                  V.VEN_TOTALPP4,
                  V.VEN_DTPREVISAOENT,
                  V.VEN_ORIGEMDAV,
                  V.VEN_QUANT,
                  V.VEN_ENTREGA,
                  V.VEN_MONTAGEM,
                  V.TRA_CODIGO,
                  T.TRA_NOME,
                  V.VEN_VALORENT,
                  M.MON_DATA
               FROM VENDAS V
               LEFT JOIN LOJAS LOJ ON LOJ.LOJ_CODIGO = V.LOJ_CODIGO
               LEFT JOIN FORMASPAG FPG1 ON FPG1.FPG_CODIGO = V.FP1_CODIGO
               LEFT JOIN FORMASPAG FPG2 ON FPG2.FPG_CODIGO = V.FP2_CODIGO
               LEFT JOIN FORMASPAG FPG3 ON FPG3.FPG_CODIGO = V.FP3_CODIGO
               LEFT JOIN FORMASPAG FPG4 ON FPG4.FPG_CODIGO = V.FP4_CODIGO
               LEFT JOIN PLANOSPAG PLP ON PLP.PLP_CODIGO = V.PP1_CODIGO
               LEFT JOIN CLIENTES C ON C.CLI_CODIGO = V.CLI_CODIGO
               LEFT JOIN FUNCIONARIOS F ON F.FUN_CODIGO = V.FUN_CODIGO
               LEFT JOIN USUARIOS U ON U.USU_CODIGO = V.USU_CODIGO
               LEFT JOIN TRANSPORTADORAS T ON T.TRA_CODIGO = V.TRA_CODIGO
               LEFT JOIN MONTAGENS M ON M.VEN_NUMERO = V.VEN_NUMERO
               LEFT JOIN SITUACAO S ON S.SIT_CODIGO = V.SIT_CODIGO
               ${whereClause}
               ORDER BY V.VEN_NUMERO DESC`;

      const queryStartTime = Date.now();
      const result = (await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res[0]);
        });
      })) as object;
      const queryEndTime = Date.now();

      this.logger.log(
        `Busca de pedido por ID executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          { storeId, id },
        )}, Itens: ${result ? 1 : 0}, Tempo SQL: ${queryEndTime - queryStartTime}ms`,
      );

      return result ? this.enrichOrderRow(result) : result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  private enrichOrderRow(row: any): any {
    if (!row) return row;

    const payments: Array<{
      codigo: number;
      descricao: string;
      valor: number;
    }> = [];

    // Forma 1
    if (row.FP1_CODIGO && Number(row.FP1_CODIGO) > 0) {
      const val1 =
        row.VEN_TOTALPP1 !== null && row.VEN_TOTALPP1 !== undefined
          ? Number(row.VEN_TOTALPP1)
          : Number(row.VEN_TOTALLIQUIDO || 0);
      payments.push({
        codigo: Number(row.FP1_CODIGO),
        descricao: row.FPG_DESCRICAO || 'Forma de Pagamento 1',
        valor: Number(val1.toFixed(2)),
      });
    }

    // Forma 2
    if (row.FP2_CODIGO && Number(row.FP2_CODIGO) > 0) {
      payments.push({
        codigo: Number(row.FP2_CODIGO),
        descricao: row.FPG2_DESCRICAO || 'Forma de Pagamento 2',
        valor: Number((Number(row.VEN_TOTALPP2) || 0).toFixed(2)),
      });
    }

    // Forma 3
    if (row.FP3_CODIGO && Number(row.FP3_CODIGO) > 0) {
      payments.push({
        codigo: Number(row.FP3_CODIGO),
        descricao: row.FPG3_DESCRICAO || 'Forma de Pagamento 3',
        valor: Number((Number(row.VEN_TOTALPP3) || 0).toFixed(2)),
      });
    }

    // Forma 4
    if (row.FP4_CODIGO && Number(row.FP4_CODIGO) > 0) {
      payments.push({
        codigo: Number(row.FP4_CODIGO),
        descricao: row.FPG4_DESCRICAO || 'Forma de Pagamento 4',
        valor: Number((Number(row.VEN_TOTALPP4) || 0).toFixed(2)),
      });
    }

    return {
      ...row,
      PAYMENTS: payments,
    };
  }

  private async insertOrderOnDb(
    transaction: any,
    orderData: any,
    storeId: number,
  ) {
    return new Promise((resolve, reject) => {
      const VEN_NUMERO = 'GEN_ID(GEN_NUMEROVEN, 1)';

      const orderInsert = {
        VEN_ID_ECOMMERCE: null,
        VEN_NUMSITE: null,
        SIT_CODIGO: 1,
        PRE_CODIGO: orderData.provider_id || 1,
        LOJ_CODIGO: orderData.store_id || storeId,
        USU_CODIGO: orderData.user_id,
        FUN_CODIGO: orderData.employee_id,
        CLI_CODIGO: orderData.client_id || 1,
        VEN_TIPO: 'I',
        VEN_PRECO: orderData.price_table_id?.toString() || '1',
        VEN_DATA: orderData.date,
        VEN_HORA: orderData.hour,
        VEN_OBS: orderData.store_note,
      };

      const query = `INSERT INTO VENDAS
            (
                VEN_NUMERO,
                VEN_ID_ECOMMERCE,
                VEN_NUMSITE,
                SIT_CODIGO,               
                PRE_CODIGO,
                LOJ_CODIGO,
                USU_CODIGO,
                FUN_CODIGO,
                CLI_CODIGO,
                VEN_TIPO,
                VEN_PRECO,
                VEN_DATA,
                VEN_HORA,
                VEN_OBS
            )
            VALUES (${VEN_NUMERO}, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING VEN_NUMERO`;

      const params = [
        orderInsert.VEN_ID_ECOMMERCE,
        orderInsert.VEN_NUMSITE,
        orderInsert.SIT_CODIGO,
        orderInsert.PRE_CODIGO,
        orderInsert.LOJ_CODIGO,
        orderInsert.USU_CODIGO,
        orderInsert.FUN_CODIGO,
        orderInsert.CLI_CODIGO,
        orderInsert.VEN_TIPO,
        orderInsert.VEN_PRECO,
        orderInsert.VEN_DATA,
        orderInsert.VEN_HORA,
        orderInsert.VEN_OBS,
      ];
      transaction.query(query, params, (err: any, results: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  private async validateUserAndEmployee(
    connection: any,
    userId: number,
    employeeId: number,
  ): Promise<void> {
    const query = `
      SELECT 
        U.USU_CODIGO,
        U.USU_SITUACAO,
        U.FUN_CODIGO,
        F.FUN_SITUACAO,
        F.FUN_DATADEMISSAO
      FROM USUARIOS U
      LEFT JOIN FUNCIONARIOS F ON F.FUN_CODIGO = U.FUN_CODIGO
      WHERE U.USU_CODIGO = ?
    `;

    const rows: any = await new Promise((resolve, reject) => {
      connection.query(query, [userId], (err: any, res: any) => {
        if (err) return reject(err);
        resolve(res);
      });
    });

    const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (!user) {
      throw new BadRequestException(
        `Usuário/operador com ID ${userId} não encontrado.`,
      );
    }

    const userSituacao = (user.USU_SITUACAO || 'A')
      .toString()
      .trim()
      .toUpperCase();

    if (userSituacao !== 'A') {
      throw new BadRequestException(
        `Usuário/operador com ID ${userId} está inativo.`,
      );
    }

    if (user.FUN_CODIGO === null || user.FUN_CODIGO === undefined) {
      throw new BadRequestException(
        `O usuário/operador com ID ${userId} não possui um funcionário vinculado no ERP.`,
      );
    }

    if (Number(user.FUN_CODIGO) !== Number(employeeId)) {
      throw new BadRequestException(
        `O funcionário informado (${employeeId}) não corresponde ao funcionário vinculado ao usuário/operador ${userId} no ERP (${user.FUN_CODIGO}).`,
      );
    }

    const funSituacao = (user.FUN_SITUACAO || 'A')
      .toString()
      .trim()
      .toUpperCase();

    if (funSituacao !== 'A' || user.FUN_DATADEMISSAO) {
      throw new BadRequestException(
        `O funcionário com ID ${employeeId} está inativo ou desligado no ERP.`,
      );
    }
  }

  private async resolvePaymentMethodCode(
    connection: any,
    paymentMethod: string | number,
  ): Promise<number> {
    if (typeof paymentMethod === 'number') {
      return paymentMethod;
    }

    if (typeof paymentMethod === 'string') {
      const trimmed = paymentMethod.trim();
      const parsed = parseInt(trimmed, 10);
      if (!isNaN(parsed) && /^\d+$/.test(trimmed)) {
        return parsed;
      }

      // Se for string nominal (ex: 'DINHEIRO', 'PIX', 'CREDIT'), busca em FORMASPAG
      const upper = trimmed.toUpperCase();
      const searchPattern =
        upper === 'CREDIT' || upper === 'DEBIT' ? '%CART%' : `%${upper}%`;

      const query = `SELECT FIRST 1 FPG_CODIGO FROM formaspag WHERE UPPER(FPG_DESCRICAO) LIKE ? ORDER BY FPG_CODIGO ASC`;
      return new Promise((resolve) => {
        connection.query(query, [searchPattern], (err: any, results: any[]) => {
          if (!err && results && results.length > 0 && results[0]?.FPG_CODIGO) {
            resolve(Number(results[0].FPG_CODIGO));
          } else {
            resolve(1); // Default seguro para 1 (Dinheiro / À Vista)
          }
        });
      });
    }

    return 1;
  }

  private async updateFinancial(
    transaction: any,
    ven_numero: number,
    orderData: PostOrderDto,
    totalCalculated: number,
    fp1Codigo?: number,
    pp1Codigo?: number,
  ) {
    const FP1_CODIGO =
      fp1Codigo ??
      (typeof orderData.payment_method === 'number'
        ? orderData.payment_method
        : parseInt(orderData.payment_method, 10) || 1);
    const PP1_CODIGO = pp1Codigo ?? (orderData.payment_plan_code || 1);
    const data = dayjs(orderData.date).format('YYYY-MM-DD');

    const totalBruto = totalCalculated;
    const totalLiquido =
      totalBruto + (orderData.taxes || 0) - (orderData.discount || 0);

    const financeiroAtualizar = {
      PP1_CODIGO: PP1_CODIGO,
      FP1_CODIGO: FP1_CODIGO,
      VEN_TOTALPP1: totalLiquido || 0.0,
      VEN_TOTALPPA1: totalLiquido || 0.0,
      VEN_TOTALBRUTO: totalBruto,
      VEN_TOTALDESC: orderData.discount || 0.0,
      VEN_TOTALACRESC: orderData.taxes || 0.0,
      VEN_TOTALLIQUIDO: totalLiquido,
      VEN_DATABASE1: data,
    };

    const query = `
          UPDATE VENDAS
          SET
              PP1_CODIGO = ?,
              FP1_CODIGO = ?,
              VEN_TOTALPP1 = ?,
              VEN_TOTALPPA1 = ?,
              VEN_TOTALBRUTO = ?,
              VEN_TOTALDESC = ?,
              VEN_TOTALACRESC = ?, 
              --VEN_TAXAPAG = ?,
              VEN_TOTALLIQUIDO = ?,
              VEN_DATABASE1 = ?
          
          WHERE VENDAS.VEN_NUMERO = ?
      `;

    const values = [
      financeiroAtualizar.PP1_CODIGO,
      financeiroAtualizar.FP1_CODIGO,
      financeiroAtualizar.VEN_TOTALPP1,
      financeiroAtualizar.VEN_TOTALPPA1,
      financeiroAtualizar.VEN_TOTALBRUTO,
      financeiroAtualizar.VEN_TOTALDESC,
      financeiroAtualizar.VEN_TOTALACRESC,
      financeiroAtualizar.VEN_TOTALLIQUIDO,
      financeiroAtualizar.VEN_DATABASE1,
      ven_numero,
    ];

    return new Promise((resolve, reject) => {
      transaction.query(query, values, (err: any, result: any) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  async getOrderMetrics(
    credentialsId: string,
    storeId: number | undefined,
    filters: {
      startDate: string;
      endDate: string;
    },
  ): Promise<OrderMetricsResponseDto> {
    let connection: any;
    connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      let whereClause = `WHERE 1=1`;
      const filterParams: any[] = [];

      if (storeId) {
        whereClause += ` AND V.LOJ_CODIGO = ?`;
        filterParams.push(storeId);
      }

      whereClause += ` AND V.VEN_DATA BETWEEN ? AND ?`;
      filterParams.push(filters.startDate, filters.endDate);

      const query = `
        SELECT
          COUNT(CASE WHEN V.SIT_CODIGO = 2 THEN 1 END) AS TOTAL_ORDERS,
          COALESCE(SUM(CASE WHEN V.SIT_CODIGO = 2 THEN V.VEN_TOTALLIQUIDO ELSE 0 END), 0) AS BILLING,
          COUNT(CASE WHEN V.SIT_CODIGO IN (1, 4) THEN 1 END) AS OPEN_ORDERS
        FROM VENDAS V
        ${whereClause}
      `;

      const queryStartTime = Date.now();
      const result: any = await new Promise((resolve, reject) => {
        connection.query(query, filterParams, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const queryEndTime = Date.now();

      const row = Array.isArray(result) ? result[0] : result;
      const totalOrders = Number(row?.TOTAL_ORDERS ?? row?.total_orders ?? 0);
      const billing = Number(
        Number(row?.BILLING ?? row?.billing ?? 0).toFixed(2),
      );
      const openOrders = Number(row?.OPEN_ORDERS ?? row?.open_orders ?? 0);
      const averageTicket =
        totalOrders > 0 ? Number((billing / totalOrders).toFixed(2)) : 0;

      this.logger.log(
        `Métricas de pedidos executadas. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          { storeId, ...filters },
        )}, TotalOrders: ${totalOrders}, Billing: ${billing}, OpenOrders: ${openOrders}, Tempo SQL: ${
          queryEndTime - queryStartTime
        }ms`,
      );

      return {
        totalOrders,
        billing,
        averageTicket,
        openOrders,
      };
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async getAbcCurve(
    credentialsId: string,
    storeId: number | undefined,
    query: GetAbcCurveQueryDto,
  ): Promise<AbcCurveResponseDto> {
    const {
      startDate,
      endDate,
      groupBy = 'SELLER',
      system = 'PED',
      situation = 2,
      orderBy = 'NAME',
      orderDirection,
      page,
      pageSize,
    } = query;

    let connection: any;
    connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      let codeCol = '';
      let nameCol = '';
      let extraJoin = '';
      let nullFilter = '';

      switch (groupBy) {
        case 'STORE':
          codeCol = 'V.LOJ_CODIGO';
          nameCol =
            "COALESCE(LOJ.LOJ_FANTASIA, LOJ.LOJ_NOME, 'LOJA ' || V.LOJ_CODIGO)";
          extraJoin = 'LEFT JOIN LOJAS LOJ ON LOJ.LOJ_CODIGO = V.LOJ_CODIGO';
          nullFilter = 'V.LOJ_CODIGO IS NOT NULL';
          break;
        case 'GROUP':
          codeCol = 'P.GRU_CODIGO';
          nameCol = "COALESCE(G.GRU_DESCRICAO, 'GRUPO ' || P.GRU_CODIGO)";
          extraJoin =
            'INNER JOIN PRODUTOS P ON P.PRO_CODIGO = IV.PRO_CODIGO LEFT JOIN GRUPOSPRO G ON G.GRU_CODIGO = P.GRU_CODIGO';
          nullFilter = 'P.GRU_CODIGO IS NOT NULL';
          break;
        case 'BRAND':
          codeCol = 'P.MAR_CODIGO';
          nameCol = "COALESCE(M.MAR_DESCRICAO, 'MARCA ' || P.MAR_CODIGO)";
          extraJoin =
            'INNER JOIN PRODUTOS P ON P.PRO_CODIGO = IV.PRO_CODIGO LEFT JOIN MARCAS M ON M.MAR_CODIGO = P.MAR_CODIGO';
          nullFilter = 'P.MAR_CODIGO IS NOT NULL';
          break;
        case 'CUSTOMER':
          codeCol = 'V.CLI_CODIGO';
          nameCol = "COALESCE(C.CLI_NOME, 'CLIENTE ' || V.CLI_CODIGO)";
          extraJoin = 'LEFT JOIN CLIENTES C ON C.CLI_CODIGO = V.CLI_CODIGO';
          nullFilter = 'V.CLI_CODIGO IS NOT NULL';
          break;
        case 'PRODUCT':
          codeCol = 'IV.PRO_CODIGO';
          nameCol = "COALESCE(P.PRO_DESCRICAO, 'PRODUTO ' || IV.PRO_CODIGO)";
          extraJoin = 'INNER JOIN PRODUTOS P ON P.PRO_CODIGO = IV.PRO_CODIGO';
          nullFilter = 'IV.PRO_CODIGO IS NOT NULL';
          break;
        case 'SELLER':
        default:
          codeCol = 'V.FUN_CODIGO';
          nameCol = "COALESCE(F.FUN_NOME, 'VENDEDOR ' || V.FUN_CODIGO)";
          extraJoin = 'LEFT JOIN FUNCIONARIOS F ON F.FUN_CODIGO = V.FUN_CODIGO';
          nullFilter = 'V.FUN_CODIGO IS NOT NULL';
          break;
      }

      const filterConditions: string[] = [nullFilter];
      const filterParams: any[] = [];

      filterConditions.push('V.VEN_DATA BETWEEN ? AND ?');
      filterParams.push(startDate, endDate);

      if (storeId) {
        filterConditions.push('V.LOJ_CODIGO = ?');
        filterParams.push(storeId);
      }

      if (system === 'PED') {
        filterConditions.push("V.VEN_TIPO = 'E'");
      } else if (system === 'PDV') {
        filterConditions.push("V.VEN_TIPO <> 'E'");
      }

      if (situation !== undefined) {
        filterConditions.push('V.SIT_CODIGO = ?');
        filterParams.push(situation);
      }

      const whereClause = `WHERE ${filterConditions.join(' AND ')}`;

      const summaryQuery = `
        SELECT 
          COALESCE(SUM(IV.IVD_QTDE), 0) AS GLOBAL_QTD,
          COALESCE(SUM(IV.IVD_LIQUIDO), 0) AS GLOBAL_VALOR,
          COUNT(DISTINCT ${codeCol}) AS ENTITY_COUNT
        FROM VENDAS V
        INNER JOIN ITENSVEN IV ON IV.VEN_NUMERO = V.VEN_NUMERO
        ${extraJoin}
        ${whereClause}
      `;

      const summaryRes: any = await new Promise((resolve, reject) => {
        connection.query(summaryQuery, filterParams, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });

      const summaryRow = Array.isArray(summaryRes)
        ? summaryRes[0]
        : summaryRes;
      const totalQuantity = Number(
        Number(summaryRow?.GLOBAL_QTD ?? summaryRow?.global_qtd ?? 0).toFixed(
          2,
        ),
      );
      const totalValue = Number(
        Number(
          summaryRow?.GLOBAL_VALOR ?? summaryRow?.global_valor ?? 0,
        ).toFixed(2),
      );
      const entityCount = Number(
        summaryRow?.ENTITY_COUNT ?? summaryRow?.entity_count ?? 0,
      );

      let effectiveDirection = orderDirection;
      if (!effectiveDirection) {
        effectiveDirection = orderBy === 'NAME' ? 'ASC' : 'DESC';
      }

      let orderSql = 'ORDER BY 2 ASC';
      if (orderBy === 'VALUE') {
        orderSql = `ORDER BY 4 ${effectiveDirection}`;
      } else if (orderBy === 'QUANTITY') {
        orderSql = `ORDER BY 3 ${effectiveDirection}`;
      } else {
        orderSql = `ORDER BY 2 ${effectiveDirection}`;
      }

      const isPaginated = page !== undefined && pageSize !== undefined;
      let paginationSql = '';
      const queryParams: any[] = [];

      if (isPaginated) {
        paginationSql = 'FIRST ? SKIP ?';
        queryParams.push(pageSize, (page - 1) * pageSize);
      }

      queryParams.push(...filterParams);

      const itemsQuery = `
        SELECT ${paginationSql}
          ${codeCol} AS ENTITY_CODE,
          ${nameCol} AS ENTITY_NAME,
          COALESCE(SUM(IV.IVD_QTDE), 0) AS SOLD_QUANTITY,
          COALESCE(SUM(IV.IVD_LIQUIDO), 0) AS SOLD_VALUE
        FROM VENDAS V
        INNER JOIN ITENSVEN IV ON IV.VEN_NUMERO = V.VEN_NUMERO
        ${extraJoin}
        ${whereClause}
        GROUP BY ${codeCol}, ${nameCol}
        ${orderSql}
      `;

      const startTime = Date.now();
      const rows: any = await new Promise((resolve, reject) => {
        connection.query(itemsQuery, queryParams, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const endTime = Date.now();

      const itemsArray = Array.isArray(rows) ? rows : rows ? [rows] : [];

      let runningCumulative = 0;
      const items: AbcCurveItemDto[] = itemsArray.map(
        (row: any, index: number) => {
          const code = Number(row?.ENTITY_CODE ?? row?.entity_code ?? 0);
          const name = String(row?.ENTITY_NAME ?? row?.entity_name ?? '').trim();
          const soldQuantity = Number(
            Number(
              row?.SOLD_QUANTITY ?? row?.sold_quantity ?? 0,
            ).toFixed(2),
          );
          const soldValue = Number(
            Number(row?.SOLD_VALUE ?? row?.sold_value ?? 0).toFixed(2),
          );

          const quantityPercent =
            totalQuantity > 0
              ? Number(((soldQuantity / totalQuantity) * 100).toFixed(2))
              : 0;
          const valuePercent =
            totalValue > 0
              ? Number(((soldValue / totalValue) * 100).toFixed(2))
              : 0;

          runningCumulative = Number(
            (runningCumulative + valuePercent).toFixed(2),
          );
          if (runningCumulative > 100) runningCumulative = 100;

          let classification: 'A' | 'B' | 'C' = 'A';
          if (runningCumulative <= 70.0) {
            classification = 'A';
          } else if (runningCumulative <= 90.0) {
            classification = 'B';
          } else {
            classification = 'C';
          }

          const position = isPaginated
            ? (page - 1) * pageSize + index + 1
            : index + 1;

          return {
            position,
            code,
            name,
            soldQuantity,
            soldValue,
            quantityPercent,
            valuePercent,
            cumulativePercent: runningCumulative,
            classification,
          };
        },
      );

      this.logger.log(
        `Curva ABC executada. Tenant: ${credentialsId}, Dimensão: ${groupBy}, Itens: ${items.length}, Tempo SQL: ${endTime - startTime}ms`,
      );

      const resolvedEntityCount = isPaginated ? entityCount : itemsArray.length;

      const response: AbcCurveResponseDto = {
        dimension: groupBy,
        period: {
          startDate,
          endDate,
        },
        summary: {
          totalQuantity,
          totalValue,
          entityCount: resolvedEntityCount,
        },
        items,
      };

      if (isPaginated) {
        response.pagination = {
          page,
          pageSize,
          totalPages: Math.ceil(resolvedEntityCount / pageSize) || 1,
          totalItems: resolvedEntityCount,
        };
      }

      return response;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
