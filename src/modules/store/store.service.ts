import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StoreService {
  private readonly logger = new Logger(StoreService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async get(
    credentialsId: string,
    page: number = 1,
    pageSize: number = 100,
    storeId?: number,
    storeCnpj?: string,
  ) {
    if (page < 1) {
      throw new BadRequestException('Page must be greater than or equal to 1');
    }

    if (pageSize < 1) {
      throw new BadRequestException(
        'Page size must be greater than or equal to 1',
      );
    }

    let connection: any;
    connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const params: (number | string)[] = [pageSize, (page - 1) * pageSize];
      let query = `SELECT FIRST ? SKIP ? 
                      loj.loj_codigo, loj.loj_nome, loj.loj_fantasia, loj.loj_cnpj
                      FROM lojas loj`;

      let hasWhere = false;

      if (storeId) {
        query += ` WHERE loj.loj_codigo = ?`;
        params.push(storeId);
        hasWhere = true;
      }

      if (storeCnpj) {
        query += hasWhere ? ` AND` : ` WHERE`;
        query += ` loj.loj_cnpj = ?`;
        params.push(storeCnpj);
      }

      query += ` ORDER BY loj.loj_codigo`;

      const queryStartTime = Date.now();
      const result = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const queryEndTime = Date.now();

      this.logger.log(
        `Busca de lojas executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          { page, pageSize, storeId, storeCnpj },
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
