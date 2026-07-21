import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

@Injectable()
export class EmployeeRoleService {
  private readonly logger = new Logger(EmployeeRoleService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async get(
    credentialsId: string,
    page: number = 1,
    pageSize: number = 100,
    search?: string,
  ) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const params: (number | string)[] = [pageSize, (page - 1) * pageSize];
      let query = `SELECT FIRST ? SKIP ? 
                      FCA_CODIGO, FCA_NOME
                      FROM funcoes
                      WHERE 1=1`;

      if (search) {
        if (search.length < 3) {
          throw new BadRequestException(
            'Pesquisa precisa ter pelo menos 3 caracteres.',
          );
        }
        query += ` AND FCA_NOME LIKE ?`;
        params.push(`%${search.toUpperCase()}%`);
      }

      query += ` ORDER BY FCA_NOME`;

      const startTime = Date.now();
      const result = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const endTime = Date.now();

      this.logger.log(
        `Busca de funções/cargos executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          {
            page,
            pageSize,
            search,
          },
        )}, Itens: ${Array.isArray(result) ? result.length : result ? 1 : 0}, Tempo SQL: ${endTime - startTime}ms`,
      );
      return result;
    } catch (error) {
      console.error(error);
      this.logger.error(
        `Erro ao buscar funções/cargos. Tenant: ${credentialsId}`,
        error,
      );
      throw error;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
