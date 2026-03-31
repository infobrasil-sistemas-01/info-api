import { BadRequestException, Injectable, Post } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { PostOrderDto } from './dto/create-order.dto';
import dayjs from 'dayjs';
import { SoldProductDto } from './dto/sold-product.dto';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
    private readonly productService: ProductService,
  ) {}

  async post(credentialsId: string, data: PostOrderDto) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    const { products_sold, ...orderData } = data;

    const date = dayjs(orderData.date).format('YYYY-MM-DD');

    if (!date) {
      throw new BadRequestException('Formato de data inválido');
    }

    const transaction: any = await new Promise((resolve, reject) => {
      connection.startTransaction((err: any, transaction: any) => {
        if (err) {
          return reject(err);
        }
        resolve(transaction);
      });
    });

    const orderId = (await this.insertOrderOnDb(transaction, {
      ...orderData,
      date,
    })) as { VEN_NUMERO: number };

    console.log('Order inserted with ID:', orderId);

    let totalCalculated = 0;
    for (const product of products_sold || []) {
      const ourProduct = await this.productService.getById(
        credentialsId,
        product.product_id,
      );

      totalCalculated += product.original_price * product.quantity;

      console.log('Our product:', ourProduct);

      await this.insertSoldProductOnDb(
        transaction,
        product,
        ourProduct,
        orderId.VEN_NUMERO,
      );

      console.log(
        `Inserted sold product with ID: ${product.product_id} for order ID: ${orderId.VEN_NUMERO}`,
      );
    }

    await this.updateFinancial(
      transaction,
      orderId.VEN_NUMERO,
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
  }

  private async insertOrderOnDb(transaction: any, orderData: any) {
    return new Promise((resolve, reject) => {
      const VEN_NUMERO = 'GEN_ID(GEN_NUMEROVEN, 1)';

      const orderInsert = {
        VEN_ID_ECOMMERCE: orderData.id,
        VEN_NUMSITE: orderData.id.toString(),
        SIT_CODIGO: 1,
        LOJ_CODIGO: 1,
        USU_CODIGO: 9999,
        FUN_CODIGO: 9999,
        CLI_CODIGO: 1,
        VEN_TIPO: 'E',
        VEN_PRECO: '1',
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
            VALUES (${VEN_NUMERO}, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING VEN_NUMERO`;

      const params = [
        orderInsert.VEN_ID_ECOMMERCE,
        orderInsert.VEN_NUMSITE,
        orderInsert.SIT_CODIGO,
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

  private async insertSoldProductOnDb(
    transaction: any,
    product: SoldProductDto,
    ourProduct: any,
    ven_numero: number,
  ) {
    console.log('Inserting sold product:', ourProduct);

    try {
      const produtoVendidoInsert = {
        VEN_NUMERO: ven_numero,
        LOJ_CODIGO: 1,
        PRO_CODIGO: ourProduct.PRO_CODIGO,
        PRK_CODIGO: product.variant_id ? ourProduct.PRO_CODIGO : null,
        TAM_CODIGO: product.variant_id ? ourProduct.TAM_CODIGO : null,
        COR_CODIGO: product.variant_id ? ourProduct.COR_CODIGO : null,
        PRG_CODIGO: ourProduct.PRG_CODIGO || null,
        IVD_QTDE: product.quantity,
        IVD_PRECO: product.original_price,
        IVD_TOTAL: product.original_price * product.quantity,
        IVD_DESCONTO: 0,
        IVD_LIQUIDO: product.original_price * product.quantity - 0,
        IVD_PRCCOMPRA: ourProduct.PRO_PRCCOMPRA || null,
        IVD_PRCCUSTO: ourProduct.PRO_PRCCUSTO || null,
        IVD_PRCFISCAL: ourProduct.PRO_PRCCOMPRAFISCAL || null,
        IVD_PRCCUSTOFISCAL: ourProduct.PRO_CUSTOFISCAL || null,
        IVD_ENTREGUE: 'N',
        IVD_PRCAVISTA: product.original_price,
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

  private async updateFinancial(
    transaction: any,
    ven_numero: number,
    orderData: PostOrderDto,
    totalCalculated: number,
  ) {
    try {
      const FP1_CODIGO = orderData.payment_method;
      const PP1_CODIGO = orderData.installment || 1;
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
        VEN_TOTALDESC: 0,
        VEN_TOTALACRESC: orderData.taxes || 0.0,
        VEN_VALORENT: 0.0,
        // VEN_TAXAPAG: orderData.payment_method_rate || 0.00,
        VEN_TOTALLIQUIDO: totalBruto + (orderData.taxes || 0) - 0,
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
