import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

@Injectable()
export class ProductGroupService {
  private readonly logger = new Logger(ProductGroupService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async get(credentialsId: string, page: number = 1, pageSize: number = 10) {
    let connection: any;
    connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      if (!page || page < 1)
        throw new BadRequestException('Page number must be greater than 0');
      if (!pageSize || pageSize < 1) pageSize = 10;

      const query = `SELECT FIRST ? SKIP ? 
                      M.GRU_CODIGO, M.GRU_DESCRICAO
                      FROM grupospro M 
                      ORDER BY M.GRU_DESCRICAO`;
      const params = [pageSize, (page - 1) * pageSize];

      const queryStartTime = Date.now();
      const result = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const queryEndTime = Date.now();

      this.logger.log(
        `Busca de grupos de produtos executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          { page, pageSize },
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
