import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class ProductGroupService {
  private readonly logger = new Logger(ProductGroupService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async get(credentialsId: string, page: number = 1, pageSize: number = 100) {
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

  async getById(credentialsId: string, id: number) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `SELECT 
                      M.GRU_CODIGO, M.GRU_DESCRICAO
                      FROM grupospro M 
                      WHERE M.GRU_CODIGO = ?`;
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
        `Busca de grupo por ID executada. Tenant: ${credentialsId}, ID: ${id}, Tempo SQL: ${
          endTime - startTime
        }ms`,
      );

      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async create(credentialsId: string, data: CreateGroupDto) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `INSERT INTO grupospro (
                      GRU_DESCRICAO, GRU_CODIGO
                    ) VALUES (
                      ?, GEN_ID(GEN_CODIGOGRU, 1)
                    ) RETURNING GRU_CODIGO, GRU_DESCRICAO`;

      const params = [data.GRU_DESCRICAO];

      const startTime = Date.now();
      const result = (await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      })) as any;
      const endTime = Date.now();

      this.logger.log(
        `Grupo de produto criado. Tenant: ${credentialsId}, ID: ${result?.GRU_CODIGO}, Tempo SQL: ${
          endTime - startTime
        }ms`,
      );

      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async update(credentialsId: string, id: number, data: UpdateGroupDto) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const group = await this.getById(credentialsId, id);
      if (!group) {
        throw new NotFoundException('Grupo não encontrado');
      }

      if (!data.GRU_DESCRICAO) {
        return group;
      }

      const query = `UPDATE grupospro SET GRU_DESCRICAO = ? WHERE GRU_CODIGO = ?`;
      const params = [data.GRU_DESCRICAO, id];

      const startTime = Date.now();
      await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any) => {
          if (err) return reject(err);
          resolve(true);
        });
      });
      const endTime = Date.now();

      this.logger.log(
        `Grupo de produto atualizado. Tenant: ${credentialsId}, ID: ${id}, Tempo SQL: ${
          endTime - startTime
        }ms`,
      );

      return this.getById(credentialsId, id);
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
