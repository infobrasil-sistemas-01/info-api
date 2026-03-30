import { Injectable } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async get(
    credentialsId: string,
    page: number = 1,
    pageSize: number = 10,
    group?: number,
    brand?: number,
  ) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    let params = [pageSize, (page - 1) * pageSize];
    let query = `SELECT FIRST ? SKIP ? 
                    P.PRO_CODIGO, P.PRO_DESCRICAO, M.MAR_CODIGO, M.MAR_DESCRICAO, G.GRU_CODIGO, G.GRU_DESCRICAO, E.EST_APOIO ESTOQUE, E.PRO_PRECO1 PRECO
                    FROM produtos P 
                    LEFT JOIN marcas M ON P.MAR_CODIGO = M.MAR_CODIGO 
                    LEFT JOIN grupospro G ON P.GRU_CODIGO = G.GRU_CODIGO
                    LEFT JOIN estoque E ON P.PRO_CODIGO = E.PRO_CODIGO AND LOJ_CODIGO = 1`;

    if (group) {
      query += ` WHERE P.GRU_CODIGO = ?`;
      params.push(group);
    }

    if (brand) {
      query += group ? ` AND` : ` WHERE`;
      query += ` P.MAR_CODIGO = ?`;
      params.push(brand);
    }

    query += ` ORDER BY P.PRO_DESCRICAO`;

    const result = await new Promise((resolve, reject) => {
      connection.query(query, params, (err: any, res: any) => {
        if (err) return reject(err);
        resolve(res);
      });
    });

    return result;
  }

  async getById(credentialsId: string, id: number) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);
    const query = `SELECT * FROM produtos P
                    WHERE P.PRO_CODIGO = ?`;
    const params = [id];

    const result = await new Promise((resolve, reject) => {
      connection.query(query, params, (err: any, res: any) => {
        if (err) return reject(err);
        resolve(res[0]);
      });
    });

    return result;
  }
}
