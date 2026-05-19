import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

@Injectable()
export class ServiceProviderService {
  private readonly logger = new Logger(ServiceProviderService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) { }

  async get(
    credentialsId: string,
    storeId?: number,
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    situation?: string,
  ) {
    const connection = await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const params: (number | string)[] = [
        pageSize,
        (page - 1) * pageSize
      ];
      let query = `SELECT FIRST ? SKIP ? 
                      PRE_CODIGO, PRE_NOME, PRE_APELIDO, PRE_ENDERECO, PRE_FONE, PRE_CELULAR,
                      PRE_EMAIL, PRE_SITUACAO, LOJ_CODIGO
                      FROM prestadores 
                      WHERE 1=1`;

      if (storeId) {
        query += ` AND LOJ_CODIGO = ?`;
        params.push(storeId);
      }

      // Se existir situação para prestadores (assumindo PRE_SITUACAO)
      if (situation) {
        query += ` AND PRE_SITUACAO = ?`;
        params.push(situation);
      }

      if (search) {
        if (search.length < 3) {
          throw new BadRequestException('Pesquisa precisa ter pelo menos 3 caracteres.');
        }
        query += ` AND (PRE_NOME LIKE ? OR PRE_APELIDO LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }

      query += ` ORDER BY PRE_NOME`;

      const startTime = Date.now();
      const result = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const endTime = Date.now();

      this.logger.log(
        `Busca de prestadores executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify({
          storeId,
          page,
          pageSize,
          search,
          situation,
        })}, Itens: ${Array.isArray(result) ? result.length : result ? 1 : 0}, Tempo SQL: ${endTime - startTime}ms`,
      );
      return result;
    } catch (error) {
      console.error(error);
      this.logger.error(
        `Erro ao buscar prestadores. Tenant: ${credentialsId}`,
        error,
      );
      throw error;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async getById(credentialsId: string, id: number) {
    const connection = await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `SELECT 
                      PRE_CODIGO, PRE_NOME, PRE_APELIDO, PRE_ENDERECO, PRE_BAIRRO,
                      PRE_CIDADE, PRE_UF, PRE_CEP, PRE_FONE, PRE_CELULAR,
                      PRE_EMAIL, PRE_CPF, PRE_IDENTIDADE, PRE_SITUACAO, LOJ_CODIGO
                      FROM prestadores 
                      WHERE PRE_CODIGO = ?`;
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
        `Busca de prestador por ID executada. Tenant: ${credentialsId}, ID: ${id}, Tempo SQL: ${endTime - startTime}ms`,
      );
      return result;
    } catch (error) {
      console.error(error);
      this.logger.error(
        `Erro ao buscar prestador por ID. Tenant: ${credentialsId}, ID: ${id}`,
        error,
      );
      throw error;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
