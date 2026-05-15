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
  ) {
    const connection = await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const params: (number | string)[] = [
        pageSize,
        (page - 1) * pageSize,
        storeId,
      ];
      let query = `SELECT FIRST ? SKIP ? 
                      FUN_CODIGO, FUN_NOME, FUN_APELIDO, FUN_ENDERECO, FUN_BAIRRO,
                      FUN_CIDADE, FUN_UF, FUN_CEP, FUN_FONE, FUN_CELULAR, FUN_EMAIL,
                      FUN_CPF, FUN_IDENTIDADE, FUN_SITUACAO, FUN_DATANASC,
                      FUN_DATAADMISSAO, FUN_DATADEMISSAO, LOJ_CODIGO
                      FROM funcionarios 
                      WHERE LOJ_CODIGO = ?`;

      if (situation) {
        query += ` AND FUN_SITUACAO = ?`;
        params.push(situation);
      }

      if (search) {
        if (search.length < 3) {
          throw new BadRequestException('Pesquisa precisa ter pelo menos 3 caracteres.');
        }
        query += ` AND (FUN_NOME LIKE ? OR FUN_APELIDO LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
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
        `Busca de funcionários executada. Tenant: ${credentialsId}, Tempo SQL: ${endTime - startTime}ms`,
      );
      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async getById(credentialsId: string, storeId: number = 1, id: number) {
    const connection = await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `SELECT 
                      FUN_CODIGO, FUN_NOME, FUN_APELIDO, FUN_ENDERECO, FUN_BAIRRO,
                      FUN_CIDADE, FUN_UF, FUN_CEP, FUN_FONE, FUN_CELULAR, FUN_EMAIL,
                      FUN_CPF, FUN_IDENTIDADE, FUN_SITUACAO, FUN_DATANASC,
                      FUN_DATAADMISSAO, FUN_DATADEMISSAO, LOJ_CODIGO
                      FROM funcionarios 
                      WHERE LOJ_CODIGO = ? AND FUN_CODIGO = ?`;
      const params = [storeId, id];

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
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
