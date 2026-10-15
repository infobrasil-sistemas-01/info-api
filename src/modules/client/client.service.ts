import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

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
    pageSize: number = 100,
    search?: string,
    situation?: string,
    birthdate?: string,
    routeId?: number,
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
                      C.CLI_CODIGO, C.CLI_SITUACAO, C.CLI_NOME, C.CLI_FANTASIA, C.CLI_CPF_CNPJ, C.CLI_SEXO, C.CLI_ENDERECO, C.CLI_FONE, C.CLI_EMAIL, C.CLI_DATANASC, R.ROT_CODIGO, R.ROT_NOME
                      FROM clientes C
                      LEFT JOIN rotas R ON R.rot_codigo = C.rot_codigo
                      WHERE C.LOJ_CODIGO = ?`;

      if (situation) {
        query += ` AND C.CLI_SITUACAO = ?`;
        params.push(situation);
      }

      if (birthdate) {
        query += ` AND C.CLI_DATANASC = ?`;
        params.push(birthdate);
      }

      if (search) {
        if (search.length < 3) {
          throw new BadRequestException(
            'Pesquisa precisa ter pelo menos 3 caracteres.',
          );
        }
        const cleanDigits = search.replace(/\D/g, '');
        if (cleanDigits.length >= 3 && cleanDigits !== search) {
          query += ` AND (C.CLI_NOME LIKE ? OR C.CLI_FANTASIA LIKE ? OR C.CLI_CPF_CNPJ LIKE ? OR C.CLI_CPF_CNPJ LIKE ?)`;
          params.push(
            `%${search}%`,
            `%${search}%`,
            `%${search}%`,
            `%${cleanDigits}%`,
          );
        } else {
          query += ` AND (C.CLI_NOME LIKE ? OR C.CLI_FANTASIA LIKE ? OR C.CLI_CPF_CNPJ LIKE ?)`;
          params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
      }

      if (routeId) {
        query += ` AND C.ROT_CODIGO = ?`;
        params.push(routeId);
      }

      query += ` ORDER BY C.CLI_NOME`;

      const startTime = Date.now();
      const result = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const endTime = Date.now();

      this.logger.log(
        `Busca de clientes executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          {
            storeId,
            page,
            pageSize,
            search,
            situation,
            birthdate,
          },
        )}, Itens: ${Array.isArray(result) ? result.length : result ? 1 : 0}, Tempo SQL: ${endTime - startTime}ms`,
      );
      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async getById(credentialsId: string, storeId: number = 1, id: number) {
    if (!id || Number.isNaN(Number(id)) || Number(id) <= 0) {
      throw new BadRequestException('ID do cliente inválido.');
    }

    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `SELECT C.CLI_CODIGO, C.CLI_SITUACAO, C.CLI_NOME, C.CLI_FANTASIA, C.CLI_SEXO, C.CLI_ENDERECO, C.CLI_FONE, C.CLI_EMAIL, C.CLI_DATANASC,
                      C.CLI_COMPL_ENDERECO, C.CLI_CEP, C.CLI_BAIRRO, C.MUN_CODIGO, M.MUN_NOME, C.CLI_UF, C.CLI_CPF_CNPJ, C.CLI_IDENTIDADE, C.CLI_MAE, 
                      C.CLI_PAI, C.CLI_ESTADOCIVIL, C.CLI_NATURALIDADE, R.ROT_CODIGO, R.ROT_NOME
                      FROM clientes C
                      LEFT JOIN municipios M ON C.MUN_CODIGO = M.MUN_CODIGO
                      LEFT JOIN rotas R ON R.rot_codigo = C.rot_codigo
                      WHERE C.LOJ_CODIGO = ? AND C.CLI_CODIGO = ?`;
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

  async create(credentialsId: string, storeId: number, data: CreateClientDto) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `INSERT INTO clientes (
                      LOJ_CODIGO, CLI_NOME, CLI_SITUACAO, CLI_UF, MUN_CODIGO,
                      CLI_FANTASIA, CLI_SEXO, CLI_ENDERECO, CLI_COMPL_ENDERECO, CLI_CEP,
                      CLI_BAIRRO, CLI_FONE, CLI_CELULAR, CLI_EMAIL, CLI_DATANASC,
                      CLI_CPF_CNPJ, CLI_IDENTIDADE, CLI_MAE, CLI_PAI, CLI_ESTADOCIVIL,
                      CLI_NATURALIDADE, ROT_CODIGO, CLI_CODIGO
                    ) VALUES (
                      ?, ?, ?, ?, ?,
                      ?, ?, ?, ?, ?,
                      ?, ?, ?, ?, ?,
                      ?, ?, ?, ?, ?,
                      ?, ?, GEN_ID(GEN_CODIGOCLI, 1)
                    ) RETURNING CLI_CODIGO`;

      const params = [
        data.LOJ_CODIGO,
        data.CLI_NOME,
        data.CLI_SITUACAO,
        data.CLI_UF,
        data.MUN_CODIGO,
        data.CLI_FANTASIA ?? null,
        data.CLI_SEXO ?? null,
        data.CLI_ENDERECO ?? null,
        data.CLI_COMPL_ENDERECO ?? null,
        data.CLI_CEP ?? null,
        data.CLI_BAIRRO ?? null,
        data.CLI_FONE ?? null,
        data.CLI_CELULAR ?? null,
        data.CLI_EMAIL ?? null,
        data.CLI_DATANASC ?? null,
        data.CLI_CPF_CNPJ ?? null,
        data.CLI_IDENTIDADE ?? null,
        data.CLI_MAE ?? null,
        data.CLI_PAI ?? null,
        data.CLI_ESTADOCIVIL ?? null,
        data.CLI_NATURALIDADE ?? null,
        data.ROT_CODIGO ?? null,
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
    if (!id || Number.isNaN(Number(id)) || Number(id) <= 0) {
      throw new BadRequestException('ID do cliente inválido.');
    }

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
        `Cliente atualizado. Tenant: ${credentialsId}, ID: ${id}, Tempo SQL: ${
          endTime - startTime
        }ms`,
      );

      return this.getById(credentialsId, storeId, id);
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
