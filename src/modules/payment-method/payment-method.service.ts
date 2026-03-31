import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentMethodService {
  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async get(credentialsId: string, page: number = 1, pageSize: number = 10) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    const params = [pageSize, (page - 1) * pageSize];
    const query = `SELECT FIRST ? SKIP ?
                  FPG_CODIGO, FPG_DESCRICAO, FPG_BANDEIRA
                  FROM formaspag fp`;

    const result = await new Promise((resolve, reject) => {
      connection.query(query, params, (err: any, res: any) => {
        if (err) return reject(err);
        resolve(res);
      });
    });

    return result;
  }
}
