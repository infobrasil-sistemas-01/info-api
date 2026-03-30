import { Injectable } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async getProducts(
    credentialsId: string,
    page: number = 1,
    pageSize: number = 10,
  ) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    const query = `SELECT FIRST ? SKIP ? 
                    P.PRO_CODIGO, P.PRO_DESCRICAO, M.MAR_CODIGO, M.MAR_DESCRICAO, G.GRU_CODIGO, G.GRU_DESCRICAO, E.EST_APOIO ESTOQUE, E.PRO_PRECO1 PRECO
                    FROM produtos P 
                    LEFT JOIN marcas M ON P.MAR_CODIGO = M.MAR_CODIGO 
                    LEFT JOIN grupospro G ON P.GRU_CODIGO = G.GRU_CODIGO
                    LEFT JOIN estoque E ON P.PRO_CODIGO = E.PRO_CODIGO AND LOJ_CODIGO = 1
                    ORDER BY P.PRO_DESCRICAO`;
    const params = [pageSize, (page - 1) * pageSize];

    const result = await new Promise((resolve, reject) => {
      connection.query(query, params, (err: any, res: any) => {
        if (err) return reject(err);
        resolve(res);
      });
    });

    return result;
  }
}
