import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PaymentPlanService {
  private readonly logger = new Logger(PaymentPlanService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) { }

  async get(credentialsId: string, page: number = 1, pageSize: number = 10) {
    if (pageSize > 25) {
      throw new BadRequestException(
        'Page size must be less than or equal to 25',
      );
    }

    let connection: any;
    connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const params = [pageSize, (page - 1) * pageSize];
      const query = `SELECT FIRST ? SKIP ?
                    PLP_CODIGO, PLP_DESCRICAO
                    FROM planospag`;

      const queryStartTime = Date.now();
      const result = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const queryEndTime = Date.now();

      this.logger.log(
        `Busca de planos de pagamento executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
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
