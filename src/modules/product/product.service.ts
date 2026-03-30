import { Injectable } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async getProducts(credentialsId: string) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    const query = 'SELECT FIRST 10 * FROM produtos';
    const result = await new Promise((resolve, reject) => {
      connection.query(query, [], (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });

    return result;
  }
}
