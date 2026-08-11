import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { CallCenterQueryDto } from './dto/call-center-query.dto';

@Injectable()
export class CallCenterService {
  private readonly logger = new Logger(CallCenterService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) { }

  private async parseBlob(blobField: any): Promise<string | null> {
    if (!blobField) return null;
    if (typeof blobField === 'string') return blobField;
    if (Buffer.isBuffer(blobField)) return blobField.toString('utf-8');
    if (typeof blobField === 'function') {
      return new Promise((resolve, reject) => {
        blobField((err: any, _name: any, eventEmitter: any) => {
          if (err) return reject(err);
          if (!eventEmitter) return resolve(null);
          let data = '';
          eventEmitter.on('data', (chunk: any) => {
            data += chunk.toString('utf-8');
          });
          eventEmitter.on('end', () => {
            resolve(data);
          });
          eventEmitter.on('error', (e: any) => {
            reject(e);
          });
        });
      });
    }
    return String(blobField);
  }

  private async mapRecord(row: any) {
    const [depoimento, relatorio, outrasInfo] = await Promise.all([
      this.parseBlob(row.CAL_DEPOIMENTO),
      this.parseBlob(row.CAL_RELATORIO),
      this.parseBlob(row.CAL_OUTRASINFO),
    ]);

    return {
      ...row,
      CAL_DEPOIMENTO: depoimento,
      CAL_RELATORIO: relatorio,
      CAL_OUTRASINFO: outrasInfo,
    };
  }

  async get(credentialsId: string, queryDto: CallCenterQueryDto) {
    const page = queryDto.page || 1;
    const pageSize = queryDto.pageSize || 100;

    let connection: any;
    connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      let query = `SELECT FIRST ? SKIP ?
        CC.CAL_NUMERO,
        CC.CLI_CODIGO,
        C.CLI_NOME,
        CC.USU_CODIGO,
        U.USU_NOME,
        CC.CAL_DATA,
        CC.CAL_HORA,
        CC.CAL_STATUS,
        CC.CAL_CONTATO,
        CC.CAL_DATAPROXLIGACAO,
        CC.CAL_HORAPROXLIGACAO,
        CC.CAL_DEPOIMENTO,
        CC.CAL_RELATORIO,
        CC.CAL_DATABAIXA,
        CC.CAL_HORABAIXA,
        CC.VEN_NUMERO,
        CC.PAS_NUMERO,
        CC.FAT_CODIGO,
        CC.TOP_CODIGO,
        CC.APL_CODIGO,
        CC.CAL_LOJA,
        CC.CAL_BLOQUEADO,
        CC.LOJ_CODIGO,
        CC.CAL_EMAILENVIADO,
        CC.CAL_OUTRASINFO,
        A.APL_DESCRICAO,
        T.TOP_DESCRICAO,
        F.FAT_DESCRICAO
      FROM CALLCENTER CC
      LEFT JOIN CLIENTES C ON CC.CLI_CODIGO = C.CLI_CODIGO
      LEFT JOIN USUARIOS U ON CC.USU_CODIGO = U.USU_CODIGO
      LEFT JOIN APLICACOES A ON CC.APL_CODIGO = A.APL_CODIGO
      LEFT JOIN TOPICOS T ON CC.TOP_CODIGO = T.TOP_CODIGO
      LEFT JOIN FORMASATENDIMENTOS F ON CC.FAT_CODIGO = F.FAT_CODIGO
      WHERE 1=1`;

      const params: any[] = [pageSize, (page - 1) * pageSize];

      if (queryDto.clientId) {
        query += ' AND CC.CLI_CODIGO = ?';
        params.push(queryDto.clientId);
      }

      if (queryDto.userId) {
        query += ' AND CC.USU_CODIGO = ?';
        params.push(queryDto.userId);
      }

      if (queryDto.status) {
        query += ' AND CC.CAL_STATUS = ?';
        params.push(queryDto.status);
      }

      if (queryDto.storeId) {
        query += ' AND CC.LOJ_CODIGO = ?';
        params.push(queryDto.storeId);
      }

      if (queryDto.sellerId) {
        query += ' AND CC.VEN_NUMERO = ?';
        params.push(queryDto.sellerId);
      }

      if (queryDto.startDate && queryDto.endDate) {
        query += ' AND CC.CAL_DATA BETWEEN ? AND ?';
        params.push(queryDto.startDate, queryDto.endDate);
      } else if (queryDto.startDate || queryDto.endDate) {
        throw new BadRequestException(
          'Informe startDate e endDate juntos para filtrar por período de atendimento.',
        );
      }

      query += ' ORDER BY CC.CAL_DATA DESC, CC.CAL_NUMERO DESC';

      const queryStartTime = Date.now();
      const rawResult = await new Promise<any[]>((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res || []);
        });
      });
      const queryEndTime = Date.now();

      const mappedResult = await Promise.all(
        rawResult.map((row) => this.mapRecord(row)),
      );

      this.logger.log(
        `Busca de call center executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          queryDto,
        )}, Itens: ${mappedResult.length}, Tempo SQL: ${queryEndTime - queryStartTime
        }ms`,
      );

      return mappedResult;
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
        CC.CAL_NUMERO,
        CC.CLI_CODIGO,
        C.CLI_NOME,
        CC.USU_CODIGO,
        U.USU_NOME,
        CC.CAL_DATA,
        CC.CAL_HORA,
        CC.CAL_STATUS,
        CC.CAL_CONTATO,
        CC.CAL_DATAPROXLIGACAO,
        CC.CAL_HORAPROXLIGACAO,
        CC.CAL_DEPOIMENTO,
        CC.CAL_RELATORIO,
        CC.CAL_DATABAIXA,
        CC.CAL_HORABAIXA,
        CC.VEN_NUMERO,
        CC.PAS_NUMERO,
        CC.FAT_CODIGO,
        CC.TOP_CODIGO,
        CC.APL_CODIGO,
        CC.CAL_LOJA,
        CC.CAL_BLOQUEADO,
        CC.LOJ_CODIGO,
        CC.CAL_EMAILENVIADO,
        CC.CAL_OUTRASINFO,
        A.APL_DESCRICAO,
        T.TOP_DESCRICAO,
        F.FAT_DESCRICAO
      FROM CALLCENTER CC
      LEFT JOIN CLIENTES C ON CC.CLI_CODIGO = C.CLI_CODIGO
      LEFT JOIN USUARIOS U ON CC.USU_CODIGO = U.USU_CODIGO
      LEFT JOIN APLICACOES A ON CC.APL_CODIGO = A.APL_CODIGO
      LEFT JOIN TOPICOS T ON CC.TOP_CODIGO = T.TOP_CODIGO
      LEFT JOIN FORMASATENDIMENTOS F ON CC.FAT_CODIGO = F.FAT_CODIGO
      WHERE CC.CAL_NUMERO = ?`;

      const params = [id];

      const rawResult = await new Promise<any[]>((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res || []);
        });
      });

      if (!rawResult || rawResult.length === 0) {
        throw new NotFoundException('Atendimento de Call Center não encontrado');
      }

      return await this.mapRecord(rawResult[0]);
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
