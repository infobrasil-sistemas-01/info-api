import { Injectable } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

@Injectable()
export class ProductBrandService {
  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async get(credentialsId: string, page: number = 1, pageSize: number = 10) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    const query = `SELECT FIRST ? SKIP ? 
                    M.MAR_CODIGO, M.MAR_DESCRICAO
                    FROM marcas M 
                    ORDER BY M.MAR_DESCRICAO`;
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
