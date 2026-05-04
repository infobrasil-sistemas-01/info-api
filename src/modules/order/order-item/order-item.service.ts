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
        )}, Itens: ${Array.isArray(result) ? result.length : result ? 1 : 0}, Tempo SQL: ${
          queryEndTime - queryStartTime
        }ms`,
      );

      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
