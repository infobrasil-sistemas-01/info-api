import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

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
    birthdate?: string,
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
                      CLI_CODIGO, CLI_SITUACAO, CLI_NOME, CLI_FANTASIA, CLI_SEXO, CLI_ENDERECO, CLI_FONE, CLI_EMAIL, CLI_DATANASC
                      FROM clientes 
                      WHERE LOJ_CODIGO = ?`;

      if (situation) {
        query += ` AND CLI_SITUACAO = ?`;
        params.push(situation);
      }

      if (birthdate) {
        query += ` AND CLI_DATANASC = ?`;
        params.push(birthdate);
      }

      if (search) {
        if (search.length < 3) {
          throw new BadRequestException(
            'Pesquisa precisa ter pelo menos 3 caracteres.',
          );
        }
        query += ` AND (CLI_NOME LIKE ? OR CLI_FANTASIA LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }

      query += ` ORDER BY CLI_NOME`;

      const startTime = Date.now();
      const result = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const endTime = Date.now();

      this.logger.log(
        `Busca de clientes executada. Tenant: ${credentialsId}, Tempo SQL: ${
          endTime - startTime
        }ms`,
      );
      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async getById(credentialsId: string, storeId: number = 1, id: number) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `SELECT 
                      CLI_CODIGO, CLI_SITUACAO, CLI_NOME, CLI_FANTASIA, CLI_SEXO, CLI_ENDERECO, CLI_FONE, CLI_EMAIL, CLI_DATANASC,
                      CLI_COMPL_ENDERECO, CLI_CEP, CLI_BAIRRO, CLI_UF, CLI_CPF_CNPJ, CLI_IDENTIDADE, CLI_MAE, CLI_PAI, CLI_ESTADOCIVIL, CLI_NATURALIDADE
                      FROM clientes 
                      WHERE LOJ_CODIGO = ? AND CLI_CODIGO = ?`;
      const params = [storeId, id];

      const startTime = Date.now();
      const result = (await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res[0]);
        });
      })) as any;
      const endTime = Date.now();

      this.logger.log(
        `Busca de cliente por ID executada. Tenant: ${credentialsId}, ID: ${id}, Tempo SQL: ${
          endTime - startTime
        }ms`,
      );
      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
