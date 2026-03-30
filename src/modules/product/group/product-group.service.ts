import { Injectable } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

@Injectable()
export class ProductGroupService {
  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async get(credentialsId: string, page: number = 1, pageSize: number = 10) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    const query = `SELECT FIRST ? SKIP ? 
                    M.GRU_CODIGO, M.GRU_DESCRICAO
                    FROM grupospro M 
                    ORDER BY M.GRU_DESCRICAO`;
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
