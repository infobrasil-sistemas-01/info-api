import { Injectable } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

@Injectable()
export class OrderItemService {
  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async getByOrderId(credentialsId: string, orderId: number) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    const query = `SELECT 
    IV.PRO_CODIGO, P.PRO_DESCRICAO, IV.IVD_PRECO, IV.IVD_QTDE, IV.IVD_TOTAL, IV.IVD_DESCONTO, IV.IVD_LIQUIDO
    FROM ITENSVEN IV
    INNER JOIN PRODUTOS P ON IV.PRO_CODIGO = P.PRO_CODIGO
    WHERE IV.VEN_NUMERO = ?`;

    const params = [orderId];

    return new Promise((resolve, reject) => {
      connection.query(query, params, (err: any, res: any) => {
        if (err) return reject(err);
        resolve(res);
      });
    });
  }
}
