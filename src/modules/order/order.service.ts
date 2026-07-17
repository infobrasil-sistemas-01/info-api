import { BadRequestException, Injectable, Logger, Post } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { PostOrderDto } from './dto/create-order.dto';
import dayjs from 'dayjs';
import { SoldProductDto } from './dto/sold-product.dto';
import { ProductService } from '../product/product.service';
import { ReceiptService } from '../receipt/receipt.service';
import { OrderItemService } from './order-item/order-item.service';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
    private readonly orderItemService: OrderItemService,
    private readonly productService: ProductService,
    private readonly receiptService: ReceiptService,
  ) { }

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

      const transaction: any = await new Promise((resolve, reject) => {
        connection.startTransaction((err: any, transaction: any) => {
          if (err) {
            return reject(err);
          }
          resolve(transaction);
        });
      });

      const order = (await this.insertOrderOnDb(
        transaction,
        {
          ...orderData,
          date,
        },
        storeId,
      )) as { VEN_NUMERO: number };

      if (!products_sold || products_sold.length === 0) {
        throw new BadRequestException('Order must have at least one product');
      }

      let totalCalculated = 0;
      for (const product of products_sold) {
        const ourProduct = (await this.productService.getById(
          credentialsId,
          storeId,
          product.product_id,
        )) as any;

        totalCalculated += ourProduct.PRO_PRECO1 * product.quantity;

        await this.orderItemService.insertSoldProductOnDb(
          transaction,
          product,
          ourProduct,
          order.VEN_NUMERO,
          storeId,
        );
      }

      await this.updateFinancial(
        transaction,
        order.VEN_NUMERO,
        orderData,
        totalCalculated,
      );

      await new Promise((resolve, reject) => {
        transaction.commit((err: any) => {
          if (err) {
            transaction.rollback();
            reject(
              `Erro ao fazer commit do pedido ${orderData.id} da loja. Erro: ${err}`,
            );
          }
          resolve(true);
        });
      });

      return { orderId: order.VEN_NUMERO };
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
      const params: any[] = [pageSize, (page - 1) * pageSize];

      if (storeId) {
        whereClause += ` AND V.LOJ_CODIGO = ?`;
        params.push(storeId);
      }

      if (filters.startDate) {
        whereClause += ` AND V.VEN_DATA >= ?`;
        params.push(filters.startDate);
      }

      if (filters.endDate) {
        whereClause += ` AND V.VEN_DATA <= ?`;
        params.push(filters.endDate);
      }

      if (filters.clientId) {
        whereClause += ` AND V.CLI_CODIGO = ?`;
        params.push(filters.clientId);
      }

      if (filters.employeeId) {
        whereClause += ` AND V.FUN_CODIGO = ?`;
        params.push(filters.employeeId);
      }

      const query = `SELECT FIRST ? SKIP ?
                  VEN_NUMERO,
                  V.SIT_CODIGO,
                  V.CLI_CODIGO,
                  C.CLI_NOME,
                  V.FUN_CODIGO,
                  F.FUN_NOME,
                  V.VEN_NUMSITE,
                  V.LOJ_CODIGO,
                  V.VEN_TIPO,
                  V.VEN_DATA,
                  V.VEN_HORA,
                  V.FP1_CODIGO,
                  FPG.fpg_descricao,
                  V.pp1_codigo,
                  PLP.plp_descricao,
                  V.ven_totalliquido
               FROM VENDAS V
               LEFT JOIN formaspag FPG ON FPG.fpg_codigo = V.fp1_codigo
               LEFT JOIN planospag PLP ON PLP.plp_codigo = V.pp1_codigo
               LEFT JOIN clientes C ON C.cli_codigo = V.cli_codigo
               LEFT JOIN funcionarios F ON F.fun_codigo = V.fun_codigo
               ${whereClause}
               ORDER BY V.VEN_NUMERO DESC`;

      const queryStartTime = Date.now();
      const result = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const queryEndTime = Date.now();

      this.logger.log(
        `Busca de pedidos executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          { storeId, page, pageSize, ...filters },
        )}, Itens: ${Array.isArray(result) ? result.length : result ? 1 : 0}, Tempo SQL: ${queryEndTime - queryStartTime
        }ms`,
      );

      return result;
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
                  V.SIT_CODIGO,
                  V.VEN_NUMSITE,
                  V.LOJ_CODIGO,
                  V.VEN_TIPO,
                  V.VEN_PRECO,
                  V.VEN_DATA,
                  V.VEN_HORA,
                  V.FP1_CODIGO,
                  FPG.FPG_DESCRICAO,
                  V.PP1_CODIGO,
                  PLP.PLP_DESCRICAO,
                  V.VEN_TOTALBRUTO,
                  V.VEN_TOTALDESC,
                  V.VEN_TOTALLIQUIDO,
                  V.VEN_QUANT,
                  V.VEN_ENTREGA,
                  V.VEN_MONTAGEM,
                  V.TRA_CODIGO,
                  T.TRA_NOME,
                  V.VEN_VALORENT,
                  M.MON_DATA
               FROM VENDAS V
               LEFT JOIN formaspag FPG ON FPG.FPG_CODIGO = V.FP1_CODIGO
               LEFT JOIN planospag PLP ON PLP.PLP_CODIGO = V.PP1_CODIGO
               LEFT JOIN TRANSPORTADORAS T ON T.TRA_CODIGO = V.TRA_CODIGO
               LEFT JOIN MONTAGENS M ON M.VEN_NUMERO = V.VEN_NUMERO
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

      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  private async insertOrderOnDb(
    transaction: any,
    orderData: any,
    storeId: number,
  ) {
    return new Promise((resolve, reject) => {
      const VEN_NUMERO = 'GEN_ID(GEN_NUMEROVEN, 1)';

      const orderInsert = {
        VEN_ID_ECOMMERCE: orderData.id,
        VEN_NUMSITE:
          typeof orderData.id === 'string'
            ? orderData.id
            : orderData.id.toString(),
        SIT_CODIGO: 1,
        PRE_CODIGO: orderData.provider_id || 1,
        LOJ_CODIGO: orderData.store_id || storeId,
        USU_CODIGO: orderData.user_id || orderData.employee_id || 9999,
        FUN_CODIGO: orderData.employee_id || 9999,
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

  private async updateFinancial(
    transaction: any,
    ven_numero: number,
    orderData: PostOrderDto,
    totalCalculated: number,
  ) {
    try {
      const FP1_CODIGO = orderData.payment_method;
      const PP1_CODIGO = orderData.payment_plan_code || 1;
      const data = dayjs(orderData.date).format('YYYY-MM-DD');

      // else {
      //     throw new Error('A forma de pagamento do pedido é inexistente ou inválida')
      // }

      // const descontoTotalVenda = descontoTotalItens + (orderData.discount || 0)
      const totalBruto = totalCalculated;
      const financeiroAtualizar = {
        PP1_CODIGO: PP1_CODIGO,
        FP1_CODIGO: FP1_CODIGO,
        VEN_TOTALPP1: totalCalculated || 0.0,
        VEN_TOTALPPA1: totalCalculated || 0.0,
        VEN_TOTALBRUTO: totalBruto,
        VEN_TOTALDESC: orderData.discount || 0.0,
        VEN_TOTALACRESC: orderData.taxes || 0.0,
        VEN_VALORENT: 0.0,
        // VEN_TAXAPAG: orderData.payment_method_rate || 0.00,
        VEN_TOTALLIQUIDO:
          totalBruto + (orderData.taxes || 0) - (orderData.discount || 0),
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
                VEN_VALORENT = ?,
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
        financeiroAtualizar.VEN_VALORENT,
        // financeiroAtualizar.VEN_TAXAPAG,
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
    } catch (error) {
      console.error('Error updating financial data:', error);
    }
  }
}
