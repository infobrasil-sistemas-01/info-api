import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { SoldProductDto } from '../dto/sold-product.dto';

@Injectable()
export class OrderItemService {
  private readonly logger = new Logger(OrderItemService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) { }

  async insertSoldProductOnDb(
    transaction: any,
    product: SoldProductDto,
    ourProduct: any,
    ven_numero: number,
    storeId: number,
  ) {
    if (product.quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    try {
      const produtoVendidoInsert = {
        VEN_NUMERO: ven_numero,
        LOJ_CODIGO: storeId,
        PRO_CODIGO: ourProduct.PRO_CODIGO,
        PRK_CODIGO: product.variant_id ? ourProduct.PRO_CODIGO : null,
        TAM_CODIGO: product.variant_id ? ourProduct.TAM_CODIGO : null,
        COR_CODIGO: product.variant_id ? ourProduct.COR_CODIGO : null,
        PRG_CODIGO: ourProduct.PRG_CODIGO || null,
        IVD_QTDE: product.quantity,
        IVD_PRECO: ourProduct.PRO_PRECO1,
        IVD_TOTAL: ourProduct.PRO_PRECO1 * product.quantity,
        IVD_DESCONTO: 0,
        IVD_LIQUIDO: ourProduct.PRO_PRECO1 * product.quantity - 0,
        IVD_PRCCOMPRA: ourProduct.PRO_PRCCOMPRA || null,
        IVD_PRCCUSTO: ourProduct.PRO_PRCCUSTO || null,
        IVD_PRCFISCAL: ourProduct.PRO_PRCCOMPRAFISCAL || null,
        IVD_PRCCUSTOFISCAL: ourProduct.PRO_CUSTOFISCAL || null,
        IVD_ENTREGUE: 'N',
        IVD_PRCAVISTA: ourProduct.PRO_PRECO1,
      };

      const IVD_NUMERO = 'GEN_ID(GEN_NUMEROIVD, 1)';

      const query = `
            INSERT INTO ITENSVEN
            (                
                IVD_NUMERO,
                VEN_NUMERO,
                LOJ_CODIGO,
                PRO_CODIGO,
                PRK_CODIGO,
                TAM_CODIGO,
                COR_CODIGO,
                PRG_CODIGO,
                IVD_QTDE,
                IVD_PRECO,
                IVD_DESCONTO,
                IVD_TOTAL,
                IVD_LIQUIDO,
                IVD_PRCCOMPRA,
                IVD_PRCCUSTO, 
                IVD_PRCFISCAL,
                IVD_PRCCUSTOFISCAL,
                IVD_ENTREGUE,
                IVD_PRCAVISTA
            )
            VALUES (${IVD_NUMERO}, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

      const values = [
        produtoVendidoInsert.VEN_NUMERO,
        produtoVendidoInsert.LOJ_CODIGO,
        produtoVendidoInsert.PRO_CODIGO,
        produtoVendidoInsert.PRK_CODIGO,
        produtoVendidoInsert.TAM_CODIGO,
        produtoVendidoInsert.COR_CODIGO,
        produtoVendidoInsert.PRG_CODIGO,
        produtoVendidoInsert.IVD_QTDE,
        produtoVendidoInsert.IVD_PRECO,
        produtoVendidoInsert.IVD_DESCONTO,
        produtoVendidoInsert.IVD_TOTAL,
        produtoVendidoInsert.IVD_LIQUIDO,
        produtoVendidoInsert.IVD_PRCCOMPRA,
        produtoVendidoInsert.IVD_PRCCUSTO,
        produtoVendidoInsert.IVD_PRCFISCAL,
        produtoVendidoInsert.IVD_PRCCUSTOFISCAL,
        produtoVendidoInsert.IVD_ENTREGUE,
        produtoVendidoInsert.IVD_PRCAVISTA,
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
      console.error('Error inserting sold products:', error);
    }
  }

  async getByOrderId(credentialsId: string, orderId: number) {
    let connection: any;
    connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `SELECT 
      IV.PRO_CODIGO, P.PRO_DESCRICAO, IV.IVD_PRECO, IV.IVD_QTDE, IV.IVD_TOTAL, IV.IVD_DESCONTO, IV.IVD_LIQUIDO
      FROM ITENSVEN IV
      INNER JOIN PRODUTOS P ON IV.PRO_CODIGO = P.PRO_CODIGO
      WHERE IV.VEN_NUMERO = ?`;

      const params = [orderId];

      const queryStartTime = Date.now();
      const result = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const queryEndTime = Date.now();

      this.logger.log(
        `Busca de itens do pedido executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          { orderId },
        )}, Itens: ${Array.isArray(result) ? result.length : result ? 1 : 0}, Tempo SQL: ${queryEndTime - queryStartTime
        }ms`,
      );

      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async get(
    credentialsId: string,
    storeId: number,
    filters: {
      page?: number;
      pageSize?: number;
      orderId?: number;
      productId?: number;
      brandId?: number;
      groupId?: number;
      startDate?: string;
      endDate?: string;
    },
  ) {
    let connection: any;
    connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const { page = 1, pageSize = 10 } = filters;
      const params: any[] = [pageSize, (page - 1) * pageSize, storeId];
      let whereClause = `WHERE V.LOJ_CODIGO = ? AND V.VEN_TIPO = 'E'`;

      if (filters.orderId) {
        whereClause += ` AND V.VEN_NUMERO = ?`;
        params.push(filters.orderId);
      }

      if (filters.productId) {
        whereClause += ` AND IV.PRO_CODIGO = ?`;
        params.push(filters.productId);
      }

      if (filters.brandId) {
        whereClause += ` AND P.MAR_CODIGO = ?`;
        params.push(filters.brandId);
      }

      if (filters.groupId) {
        whereClause += ` AND P.GRU_CODIGO = ?`;
        params.push(filters.groupId);
      }

      if (filters.startDate) {
        whereClause += ` AND V.VEN_DATA >= ?`;
        params.push(filters.startDate);
      }

      if (filters.endDate) {
        whereClause += ` AND V.VEN_DATA <= ?`;
        params.push(filters.endDate);
      }

      const query = `SELECT FIRST ? SKIP ? 
                      V.VEN_NUMERO, V.VEN_DATA, IV.PRO_CODIGO, P.PRO_DESCRICAO, 
                      IV.IVD_QTDE, IV.IVD_PRECO, IV.IVD_TOTAL, IV.IVD_DESCONTO, IV.IVD_LIQUIDO,
                      M.MAR_CODIGO, M.MAR_DESCRICAO, G.GRU_CODIGO, G.GRU_DESCRICAO
                      FROM ITENSVEN IV
                      INNER JOIN VENDAS V ON V.VEN_NUMERO = IV.VEN_NUMERO
                      INNER JOIN PRODUTOS P ON P.PRO_CODIGO = IV.PRO_CODIGO
                      LEFT JOIN MARCAS M ON M.MAR_CODIGO = P.MAR_CODIGO
                      LEFT JOIN GRUPOSPRO G ON G.GRU_CODIGO = P.GRU_CODIGO
                      ${whereClause}
                      ORDER BY V.VEN_DATA DESC, V.VEN_NUMERO DESC`;

      const queryStartTime = Date.now();
      const result = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const queryEndTime = Date.now();

      this.logger.log(
        `Busca transversal de itens de venda executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          filters,
        )}, Itens: ${Array.isArray(result) ? result.length : result ? 1 : 0}, Tempo SQL: ${queryEndTime - queryStartTime
        }ms`,
      );

      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
