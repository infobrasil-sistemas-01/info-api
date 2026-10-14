import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

@Injectable()
export class CityService {
  private readonly logger = new Logger(CityService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async get(
    credentialsId: string,
    page: number = 1,
    pageSize: number = 100,
    search?: string,
    stateId?: number,
  ) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const params: (number | string)[] = [pageSize, (page - 1) * pageSize];
      let query = `SELECT FIRST ? SKIP ? 
                      MUN_CODIGO, MUN_NOME, EST_CODIGO
                      FROM MUNICIPIOS
                      WHERE 1=1`;

      if (stateId) {
        query += ` AND EST_CODIGO = ?`;
        params.push(stateId);
      }

      if (search) {
        if (search.length < 3) {
          throw new BadRequestException(
            'Pesquisa precisa ter pelo menos 3 caracteres.',
          );
        }
        query += ` AND MUN_NOME LIKE ?`;
        params.push(`%${search}%`);
      }

      query += ` ORDER BY MUN_NOME`;

      const startTime = Date.now();
      const result = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const endTime = Date.now();

      this.logger.log(
        `Busca de municípios executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          {
            page,
            pageSize,
            search,
            stateId,
          },
        )}, Itens: ${Array.isArray(result) ? result.length : result ? 1 : 0}, Tempo SQL: ${
          endTime - startTime
        }ms`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Erro ao buscar municípios. Tenant: ${credentialsId}`,
        error,
      );
      throw error;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
