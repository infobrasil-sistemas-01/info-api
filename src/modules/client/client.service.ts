import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) { }

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
        `Busca de clientes executada. Tenant: ${credentialsId}, Tempo SQL: ${endTime - startTime
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
        `Busca de cliente por ID executada. Tenant: ${credentialsId}, ID: ${id}, Tempo SQL: ${endTime - startTime
        }ms`,
      );
      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async create(credentialsId: string, storeId: number, data: CreateClientDto) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `INSERT INTO clientes (
                      LOJ_CODIGO, CLI_NOME, CLI_FANTASIA, CLI_ENDERECO, CLI_COMPL_ENDERECO,
                      CLI_CEP, CLI_BAIRRO, CLI_UF, CLI_FONE, CLI_CELULAR, CLI_CPF_CNPJ,
                      CLI_SITUACAO, CLI_CODIGO
                    ) VALUES (
                      ?, ?, ?, ?, ?,
                      ?, ?, ?, ?, ?, ?,
                      'A', GEN_ID(GEN_CODIGOCLI, 1)
                    ) RETURNING CLI_CODIGO`;

      const params = [
        data.LOJ_CODIGO || storeId,
        data.CLI_NOME,
        data.CLI_FANTASIA || null,
        data.CLI_ENDERECO || null,
        data.CLI_COMPL_ENDERECO || null,
        data.CLI_CEP || null,
        data.CLI_BAIRRO || null,
        data.CLI_UF || 'CE',
        data.CLI_FONE || null,
        data.CLI_CELULAR || null,
        data.CLI_CPF_CNPJ || null,
      ];

      const startTime = Date.now();
      const result = (await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      })) as any;

      const endTime = Date.now();

      this.logger.log(
        `Cliente criado. Tenant: ${credentialsId}, ID: ${result?.CLI_CODIGO}, Tempo SQL: ${endTime - startTime}ms`,
      );
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async update(
    credentialsId: string,
    storeId: number,
    id: number,
    data: UpdateClientDto,
  ) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      // Verifica se o cliente existe
      const client = await this.getById(credentialsId, storeId, id);
      if (!client) {
        throw new NotFoundException('Cliente não encontrado');
      }

      const fieldsToUpdate: string[] = [];
      const params: any[] = [];

      const mapping = {
        LOJ_CODIGO: data.LOJ_CODIGO,
        CLI_NOME: data.CLI_NOME,
        CLI_FANTASIA: data.CLI_FANTASIA,
        CLI_ENDERECO: data.CLI_ENDERECO,
        CLI_COMPL_ENDERECO: data.CLI_COMPL_ENDERECO,
        CLI_CEP: data.CLI_CEP,
        CLI_BAIRRO: data.CLI_BAIRRO,
        CLI_UF: data.CLI_UF,
        CLI_FONE: data.CLI_FONE,
        CLI_CELULAR: data.CLI_CELULAR,
      };

      for (const [key, value] of Object.entries(mapping)) {
        if (value !== undefined) {
          fieldsToUpdate.push(`${key} = ?`);
          params.push(value);
        }
      }

      if (fieldsToUpdate.length === 0) {
        return client;
      }

      const query = `UPDATE clientes SET ${fieldsToUpdate.join(', ')} 
                     WHERE LOJ_CODIGO = ? AND CLI_CODIGO = ?`;
      params.push(storeId, id);

      const startTime = Date.now();
      await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any) => {
          if (err) return reject(err);
          resolve(true);
        });
      });
      const endTime = Date.now();

      this.logger.log(
        `Cliente atualizado. Tenant: ${credentialsId}, ID: ${id}, Tempo SQL: ${endTime - startTime
        }ms`,
      );

      return this.getById(credentialsId, storeId, id);
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
