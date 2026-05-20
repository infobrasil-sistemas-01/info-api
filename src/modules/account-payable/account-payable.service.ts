import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class AccountPayableService {
  private readonly logger = new Logger(AccountPayableService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async get(
    credentialsId: string,
    page: number = 1,
    pageSize: number = 10,
    storeId?: number,
    supplierId?: number,
    situation?: string,
    startDate?: string,
    endDate?: string,
  ) {
    let connection: any;
    connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      let query = `SELECT FIRST ? SKIP ? 
                   CP.PAG_NUMERO, CP.CRE_CODIGO, C.CRE_NOME, CAST(CP.PAG_VALOR AS NUMERIC(15,2)) as PAG_VALOR, CP.PAG_SITUACAO, CP.PAG_DATAVENC 
                   FROM contaspagar CP INNER JOIN credores C ON CP.CRE_CODIGO = C.CRE_CODIGO WHERE 1=1`;
      let params: any[] = [pageSize, (page - 1) * pageSize];

      if (storeId) {
        query += ' AND CP.LOJ_CODIGO = ?';
        params.push(storeId);
      }

      if (supplierId) {
        query += ' AND CP.CRE_CODIGO = ?';
        params.push(supplierId);
      }

      if (situation) {
        if (situation !== 'A' && situation !== 'L') {
          throw new BadRequestException(
            'Situação inválida! Valores aceitos: A ou L',
          );
        }
        query += ' AND PAG_SITUACAO = ?';
        params.push(situation);
      }

      if (startDate && endDate) {
        query += ' AND PAG_DATAVENC BETWEEN ? AND ?';
        params.push(startDate, endDate);
      } else if (startDate || endDate) {
        throw new BadRequestException(
          'Informe startDate e endDate juntos para filtrar por data de vencimento.',
        );
      }

      const queryStartTime = Date.now();
      const result = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const queryEndTime = Date.now();

      this.logger.log(
        `Busca de contas a pagar executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          {
            page,
            pageSize,
            storeId,
            supplierId,
            situation,
            startDate,
            endDate,
          },
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
    let connection: any;
    connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `SELECT 
        CP.PAG_NUMERO, 
        CP.LOJ_CODIGO, 
        CP.CEN_CODIGO, 
        CP.CRE_CODIGO, 
        C.CRE_NOME,
        CP.FPG_CODIGO, 
        CP.BAN_CONTA, 
        CP.PAG_DOCUMENTO, 
        CAST(CP.PAG_PORCONTA AS NUMERIC(15,2)) as PAG_PORCONTA, 
        CAST(CP.PAG_VALOR AS NUMERIC(15,2)) as PAG_VALOR, 
        CP.PAG_SITUACAO, 
        CP.PAG_HISTORICO, 
        CP.PAG_DATAMOV, 
        CP.PAG_DATAVENC, 
        CP.PAG_DATAPAG, 
        CAST(CP.PAG_VALORTESOURARIA AS NUMERIC(15,2)) as PAG_VALORTESOURARIA, 
        CAST(CP.PAG_VALORBANCO AS NUMERIC(15,2)) as PAG_VALORBANCO, 
        CAST(CP.PAG_TOTAL AS NUMERIC(15,2)) as PAG_TOTAL 
      FROM contaspagar CP INNER JOIN credores C ON CP.CRE_CODIGO = C.CRE_CODIGO WHERE CP.PAG_NUMERO = ?`;

      const params = [id];

      const result = await new Promise<any[]>((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });

      if (!result || result.length === 0) {
        throw new NotFoundException('Conta a pagar não encontrada');
      }

      return result[0];
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
