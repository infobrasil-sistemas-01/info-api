import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

@Injectable()
export class SupplierService {
  private readonly logger = new Logger(SupplierService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async get(
    credentialsId: string,
    storeId?: number,
    page: number = 1,
    pageSize: number = 100,
    search?: string,
    situation?: string,
  ) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const params: (number | string)[] = [pageSize, (page - 1) * pageSize];
      let query = `SELECT FIRST ? SKIP ? 
                      CRE_CODIGO, CRE_NOME, CRE_FANTASIA, CRE_ENDERECO, CRE_BAIRRO,
                      CRE_UF, CRE_CONTATO, CRE_CEP, CRE_CNPJ, CRE_CGF, CRE_FONE,
                      CRE_CELULAR, CRE_FAX, CRE_ZEROOITO, CRE_EMAIL, CRE_SITE,
                      CRE_REPRESENTANTE, CRE_FONEREP, CRE_CELULARREP, CRE_EMAILREP,
                      CRE_SITUACAO, LOJ_CODIGO
                      FROM credores 
                      WHERE 1=1`;

      if (storeId) {
        query += ` AND LOJ_CODIGO = ?`;
        params.push(storeId);
      }

      if (situation) {
        query += ` AND CRE_SITUACAO = ?`;
        params.push(situation);
      }

      if (search) {
        if (search.length < 3) {
          throw new BadRequestException(
            'Pesquisa precisa ter pelo menos 3 caracteres.',
          );
        }
        query += ` AND (CRE_NOME LIKE ? OR CRE_FANTASIA LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }

      query += ` ORDER BY CRE_NOME`;

      const startTime = Date.now();
      const result = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const endTime = Date.now();

      this.logger.log(
        `Busca de fornecedores executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          {
            storeId,
            page,
            pageSize,
            search,
            situation,
          },
        )}, Itens: ${Array.isArray(result) ? result.length : result ? 1 : 0}, Tempo SQL: ${endTime - startTime}ms`,
      );
      return result;
    } catch (error) {
      console.error(error);
      this.logger.error(
        `Erro ao buscar fornecedores. Tenant: ${credentialsId}`,
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
                      CRE_CODIGO, CRE_NOME, CRE_FANTASIA, CRE_ENDERECO, CRE_BAIRRO,
                      CRE_UF, CRE_CONTATO, CRE_CEP, CRE_CNPJ, CRE_CGF, CRE_FONE,
                      CRE_CELULAR, CRE_FAX, CRE_ZEROOITO, CRE_EMAIL, CRE_SITE,
                      CRE_REPRESENTANTE, CRE_FONEREP, CRE_CELULARREP, CRE_EMAILREP,
                      CRE_SITUACAO, LOJ_CODIGO
                      FROM credores 
                      WHERE CRE_CODIGO = ?`;
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
        `Busca de fornecedor por ID executada. Tenant: ${credentialsId}, ID: ${id}, Tempo SQL: ${endTime - startTime}ms`,
      );
      return result;
    } catch (error) {
      console.error(error);
      this.logger.error(
        `Erro ao buscar fornecedor por ID. Tenant: ${credentialsId}, ID: ${id}`,
        error,
      );
      throw error;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
