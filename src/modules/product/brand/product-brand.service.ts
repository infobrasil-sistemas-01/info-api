import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { CreateBrandDto } from './dto/create-brand.dto';

@Injectable()
export class ProductBrandService {
  private readonly logger = new Logger(ProductBrandService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) { }

  async get(credentialsId: string, page: number = 1, pageSize: number = 10) {
    let connection: any;
    connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      if (page < 1) {
        throw new BadRequestException(
          'Page must be greater than or equal to 1',
        );
      }

      if (pageSize < 1) {
        throw new BadRequestException(
          'Page size must be greater than or equal to 1',
        );
      }

      const query = `SELECT FIRST ? SKIP ? 
                      M.MAR_CODIGO, M.MAR_DESCRICAO
                      FROM marcas M 
                      ORDER BY M.MAR_DESCRICAO`;
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
        `Busca de marcas de produtos executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
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

  async create(credentialsId: string, data: CreateBrandDto) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `INSERT INTO marcas (
                      MAR_DESCRICAO, MAR_CODIGO
                    ) VALUES (
                      ?, GEN_ID(GEN_CODIGOMAR, 1)
                    ) RETURNING MAR_CODIGO, MAR_DESCRICAO`;

      const params = [data.MAR_DESCRICAO];

      const startTime = Date.now();
      const result = (await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      })) as any;
      const endTime = Date.now();

      this.logger.log(
        `Marca de produto criada. Tenant: ${credentialsId}, ID: ${result?.MAR_CODIGO}, Tempo SQL: ${
          endTime - startTime
        }ms`,
      );

      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
