import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class ProductBrandService {
  private readonly logger = new Logger(ProductBrandService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async get(credentialsId: string, page: number = 1, pageSize: number = 100) {
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

  async getById(credentialsId: string, id: number) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `SELECT 
                      M.MAR_CODIGO, M.MAR_DESCRICAO
                      FROM marcas M 
                      WHERE M.MAR_CODIGO = ?`;
      const params = [id];

      const startTime = Date.now();
      const result = (await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res[0]);
        });
      })) as any;
      const endTime = Date.now();

      this.logger.log(
        `Busca de marca por ID executada. Tenant: ${credentialsId}, ID: ${id}, Tempo SQL: ${
          endTime - startTime
        }ms`,
      );

      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async update(credentialsId: string, id: number, data: UpdateBrandDto) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const brand = await this.getById(credentialsId, id);
      if (!brand) {
        throw new NotFoundException('Marca não encontrada');
      }

      if (!data.MAR_DESCRICAO) {
        return brand;
      }

      const query = `UPDATE marcas SET MAR_DESCRICAO = ? WHERE MAR_CODIGO = ?`;
      const params = [data.MAR_DESCRICAO, id];

      const startTime = Date.now();
      await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any) => {
          if (err) return reject(err);
          resolve(true);
        });
      });
      const endTime = Date.now();

      this.logger.log(
        `Marca de produto atualizada. Tenant: ${credentialsId}, ID: ${id}, Tempo SQL: ${
          endTime - startTime
        }ms`,
      );

      return this.getById(credentialsId, id);
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
