import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { PurchaseQueryDto } from './dto/purchase-query.dto';

@Injectable()
export class PurchaseService {
  private readonly logger = new Logger(PurchaseService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async get(credentialsId: string, queryDto: PurchaseQueryDto) {
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
                     COM.COM_NUMERO,
                     COM.COM_DATA,
                     COM.COM_HORA,
                     COM.LOJ_CODIGO,
                     COM.CRE_CODIGO,
                     CR.CRE_NOME,
                     CR.CRE_FANTASIA,
                     CR.CRE_CNPJ,
                     COM.COM_NUMERONF,
                     COM.COM_SERIE,
                     COM.COM_DATAEMISSAONF,
                     COM.COM_CHAVE,
                     CAST(COM.COM_VRTOTALNF AS NUMERIC(15,2)) as COM_VRTOTALNF,
                     CAST(COM.COM_TOTAL AS NUMERIC(15,2)) as COM_TOTAL,
                     CAST(COM.COM_QUANTIDADE AS NUMERIC(15,2)) as COM_QUANTIDADE,
                     COM.SIT_CODIGO
                   FROM compras COM
                   LEFT JOIN credores CR ON COM.CRE_CODIGO = CR.CRE_CODIGO
                   WHERE 1=1`;

      if (storeId) {
        query += ` AND COM.LOJ_CODIGO = ?`;
        params.push(storeId);
      }

      if (supplierId) {
        query += ` AND COM.CRE_CODIGO = ?`;
        params.push(supplierId);
      }

      if (invoiceNumber) {
        query += ` AND COM.COM_NUMERONF LIKE ?`;
        params.push(`%${invoiceNumber}%`);
      }

      if (nfeKey) {
        query += ` AND COM.COM_CHAVE = ?`;
        params.push(nfeKey);
      }

      if (startDate && endDate) {
        query += ` AND COM.COM_DATA BETWEEN ? AND ?`;
        params.push(startDate, endDate);
      } else if (startDate || endDate) {
        throw new BadRequestException(
          'Informe startDate e endDate juntos para filtrar por período de entrada.',
        );
      }

      query += ` ORDER BY COM.COM_DATA DESC, COM.COM_NUMERO DESC`;

      const startTime = Date.now();
      const result = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const endTime = Date.now();

      this.logger.log(
        `Busca de compras/entradas executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          queryDto,
        )}, Itens: ${Array.isArray(result) ? result.length : result ? 1 : 0}, Tempo SQL: ${endTime - startTime}ms`,
      );

      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
