import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { FiscalEntryQueryDto } from './dto/fiscal-entry-query.dto';

@Injectable()
export class FiscalEntryService {
  private readonly logger = new Logger(FiscalEntryService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async get(credentialsId: string, queryDto: FiscalEntryQueryDto) {
    const {
      page = 1,
      pageSize = 10,
      storeId,
      supplierId,
      startDate,
      endDate,
      invoiceNumber,
      nfeKey,
    } = queryDto;

    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const params: any[] = [pageSize, (page - 1) * pageSize];
      let query = `SELECT FIRST ? SKIP ?
                     ETA.ETA_NUMERO,
                     ETA.ETA_DATA,
                     ETA.ETA_HORA,
                     ETA.LOJ_CODIGO,
                     ETA.CRE_CODIGO,
                     CR.CRE_NOME,
                     CR.CRE_FANTASIA,
                     CR.CRE_CNPJ,
                     ETA.ETA_NUMERONF,
                     ETA.ETA_SERIE,
                     ETA.ETA_DATAEMISSAONF,
                     ETA.ETA_CHAVE,
                     CAST(ETA.ETA_VRTOTALNF AS NUMERIC(15,2)) as ETA_VRTOTALNF,
                     CAST(ETA.ETA_TOTAL AS NUMERIC(15,2)) as ETA_TOTAL,
                     CAST(ETA.ETA_QUANTIDADE AS NUMERIC(15,2)) as ETA_QUANTIDADE,
                     ETA.SIT_CODIGO
                   FROM ENTRADAS_APOIO ETA
                   LEFT JOIN CREDORES CR ON ETA.CRE_CODIGO = CR.CRE_CODIGO
                   WHERE 1=1`;

      if (storeId) {
        query += ` AND ETA.LOJ_CODIGO = ?`;
        params.push(storeId);
      }

      if (supplierId) {
        query += ` AND ETA.CRE_CODIGO = ?`;
        params.push(supplierId);
      }

      if (invoiceNumber) {
        query += ` AND ETA.ETA_NUMERONF LIKE ?`;
        params.push(`%${invoiceNumber}%`);
      }

      if (nfeKey) {
        query += ` AND ETA.ETA_CHAVE = ?`;
        params.push(nfeKey);
      }

      if (startDate && endDate) {
        query += ` AND ETA.ETA_DATA BETWEEN ? AND ?`;
        params.push(startDate, endDate);
      } else if (startDate || endDate) {
        throw new BadRequestException(
          'Informe startDate e endDate juntos para filtrar por período de entrada.',
        );
      }

      query += ` ORDER BY ETA.ETA_DATA DESC, ETA.ETA_NUMERO DESC`;

      const startTime = Date.now();
      const result = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const endTime = Date.now();

      this.logger.log(
        `Busca de entradas fiscais executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          queryDto,
        )}, Itens: ${Array.isArray(result) ? result.length : result ? 1 : 0}, Tempo SQL: ${endTime - startTime}ms`,
      );

      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
