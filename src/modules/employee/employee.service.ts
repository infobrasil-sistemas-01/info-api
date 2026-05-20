import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger(EmployeeService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async get(
    credentialsId: string,
    storeId: number = 1,
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    situation?: string,
    functionId?: number,
  ) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const params: (number | string)[] = [
        pageSize,
        (page - 1) * pageSize,
        storeId,
      ];
      let query = `SELECT FIRST ? SKIP ? 
                      F.FUN_CODIGO, F.FUN_NOME, F.FUN_APELIDO, F.FCA_CODIGO, 
                      FN.FCA_NOME, F.FUN_FONE, F.FUN_CELULAR, F.FUN_EMAIL,
                      F.FUN_SITUACAO, F.LOJ_CODIGO
                      FROM funcionarios F 
                      INNER JOIN funcoes FN ON F.FCA_CODIGO = FN.FCA_CODIGO
                      WHERE F.LOJ_CODIGO = ?`;

      if (situation) {
        query += ` AND FUN_SITUACAO = ?`;
        params.push(situation);
      }

      if (search) {
        if (search.length < 3) {
          throw new BadRequestException(
            'Pesquisa precisa ter pelo menos 3 caracteres.',
          );
        }
        query += ` AND (FUN_NOME LIKE ? OR FUN_APELIDO LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }

      if (functionId) {
        query += ` AND F.FCA_CODIGO = ?`;
        params.push(functionId);
      }

      query += ` ORDER BY FUN_NOME`;

      const startTime = Date.now();
      const result = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const endTime = Date.now();

      this.logger.log(
        `Busca de funcionários executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          {
            storeId,
            page,
            pageSize,
            search,
            situation,
            functionId,
          },
        )}, Itens: ${Array.isArray(result) ? result.length : result ? 1 : 0}, Tempo SQL: ${endTime - startTime}ms`,
      );
      return result;
    } catch (error) {
      console.error(error);
      this.logger.error(
        `Erro ao buscar funcionários. Tenant: ${credentialsId}`,
        error,
      );
      throw error;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async getById(credentialsId: string, id: number) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `SELECT 
                      F.FUN_CODIGO, F.FUN_NOME, F.FUN_APELIDO, F.FUN_ENDERECO, F.FUN_BAIRRO,
                      F.FCA_CODIGO, FN.FCA_NOME,
                      F.FUN_CIDADE, F.FUN_UF, F.FUN_CEP, F.FUN_FONE, F.FUN_CELULAR, F.FUN_EMAIL,
                      F.FUN_CPF, F.FUN_IDENTIDADE, F.FUN_SITUACAO, F.FUN_DATANASC,
                      F.FUN_DATAADMISSAO, F.FUN_DATADEMISSAO, F.LOJ_CODIGO
                      FROM funcionarios F
                      INNER JOIN funcoes FN ON F.FCA_CODIGO = FN.FCA_CODIGO 
                      WHERE F.FUN_CODIGO = ?`;
      const params = [id];

      const startTime = Date.now();
      const result = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res[0]);
        });
      });
      const endTime = Date.now();

      this.logger.log(
        `Busca de funcionário por ID executada. Tenant: ${credentialsId}, ID: ${id}, Tempo SQL: ${endTime - startTime}ms`,
      );
      return result;
    } catch (error) {
      console.error(error);
      this.logger.error(
        `Erro ao buscar funcionário por ID. Tenant: ${credentialsId}, ID: ${id}`,
        error,
      );
      throw error;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
