import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { PaginatedResponse } from 'src/common/pagination/paginated-response';
import { PurchaseQueryDto } from './dto/purchase-query.dto';

@Injectable()
export class PurchaseService {
  private readonly logger = new Logger(PurchaseService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async get(
    credentialsId: string,
    queryDto: PurchaseQueryDto,
    includeCount: boolean = false,
  ) {
    const {
      page = 1,
      pageSize = 10,
      storeId,
      supplierId,
      startDate,
      endDate,
      invoiceNumber,
      nfeKey,
      statusId,
      orderNumber,
    } = queryDto;

    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const params: any[] = [pageSize, (page - 1) * pageSize];
      const filterParams: any[] = [];
      let whereClause = 'WHERE 1=1';

      if (storeId) {
        whereClause += ` AND COM.LOJ_CODIGO = ?`;
        params.push(storeId);
        filterParams.push(storeId);
      }

      if (supplierId) {
        whereClause += ` AND COM.CRE_CODIGO = ?`;
        params.push(supplierId);
        filterParams.push(supplierId);
      }

      if (invoiceNumber) {
        whereClause += ` AND COM.COM_NUMERONF LIKE ?`;
        const likeVal = `%${invoiceNumber}%`;
        params.push(likeVal);
        filterParams.push(likeVal);
      }

      if (nfeKey) {
        whereClause += ` AND COM.COM_CHAVE = ?`;
        params.push(nfeKey);
        filterParams.push(nfeKey);
      }

      if (statusId) {
        whereClause += ` AND COM.SIT_CODIGO = ?`;
        params.push(statusId);
        filterParams.push(statusId);
      }

      if (orderNumber) {
        whereClause += ` AND COM.PED_NUMERO = ?`;
        params.push(orderNumber);
        filterParams.push(orderNumber);
      }

      if (startDate && endDate) {
        whereClause += ` AND COM.COM_DATA BETWEEN ? AND ?`;
        params.push(startDate, endDate);
        filterParams.push(startDate, endDate);
      } else if (startDate || endDate) {
        throw new BadRequestException(
          'Informe startDate e endDate juntos para filtrar por período de entrada.',
        );
      }

      const query = `SELECT FIRST ? SKIP ?
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
                     COM.SIT_CODIGO,
                     COM.USU_CODIGO,
                     COM.FUN_CODIGO,
                     COM.COM_TIPO,
                     COM.COM_DATABAIXA,
                     CAST(COM.COM_VRICMS AS NUMERIC(15,2)) as COM_VRICMS,
                     CAST(COM.COM_VRFRETENF AS NUMERIC(15,2)) as COM_VRFRETENF,
                     CAST(COM.COM_VRFRETEAVULSO AS NUMERIC(15,2)) as COM_VRFRETEAVULSO,
                     CAST(COM.COM_VRIPI AS NUMERIC(15,2)) as COM_VRIPI,
                     CAST(COM.COM_VRBASECALC AS NUMERIC(15,2)) as COM_VRBASECALC,
                     CAST(COM.COM_VRICMSANTECIPADO AS NUMERIC(15,2)) as COM_VRICMSANTECIPADO,
                     CAST(COM.COM_VRDESCONTO AS NUMERIC(15,2)) as COM_VRDESCONTO,
                     COM.COM_PRAZO,
                     COM.PED_NUMERO,
                     CAST(COM.COM_VROUTRASDESP AS NUMERIC(15,2)) as COM_VROUTRASDESP,
                     CAST(COM.COM_VRSEGURO AS NUMERIC(15,2)) as COM_VRSEGURO,
                     COM.COM_TIPOFRETE,
                     CAST(COM.COM_VRDESCCOMPL AS NUMERIC(15,2)) as COM_VRDESCCOMPL,
                     CAST(COM.COM_VRICMSDESON AS NUMERIC(15,2)) as COM_VRICMSDESON,
                     CAST(COM.COM_VRFCPST AS NUMERIC(15,2)) as COM_VRFCPST,
                     CAST(COM.COM_VRII AS NUMERIC(15,2)) as COM_VRII,
                     CAST(COM.COM_VRCOMPLEMENTO AS NUMERIC(15,2)) as COM_VRCOMPLEMENTO,
                     CAST(COM.COM_VRDIF_ICMS AS NUMERIC(15,2)) as COM_VRDIF_ICMS,
                     CAST(COM.COM_VRBASECALCSUBST AS NUMERIC(15,2)) as COM_VRBASECALCSUBST,
                     CAST(COM.COM_VRICMSSUBST AS NUMERIC(15,2)) as COM_VRICMSSUBST,
                     CAST(COM.COM_VRBONIFICACAO AS NUMERIC(15,2)) as COM_VRBONIFICACAO,
                     COM.COM_ESPECIE,
                     COM.NAF_CFOP,
                     COM.TRA_CODIGO,
                     TRA.TRA_NOME,
                     COM.COM_OBS1,
                     COM.COM_FINALIDADE,
                     COM.COM_GEROU_APOIO,
                     COM.COM_MANIFESTO,
                     CAST(COM.COM_TOTALBCIBSCBS AS NUMERIC(15,2)) as COM_TOTALBCIBSCBS,
                     CAST(COM.COM_TOTALCBS AS NUMERIC(15,2)) as COM_TOTALCBS,
                     CAST(COM.COM_TOTALUFIBS AS NUMERIC(15,2)) as COM_TOTALUFIBS,
                     CAST(COM.COM_TOTALMUNIBS AS NUMERIC(15,2)) as COM_TOTALMUNIBS,
                     CAST(COM.COM_TOTALIS AS NUMERIC(15,2)) as COM_TOTALIS
                   FROM compras COM
                   LEFT JOIN credores CR ON COM.CRE_CODIGO = CR.CRE_CODIGO
                   LEFT JOIN transportadoras TRA ON COM.TRA_CODIGO = TRA.TRA_CODIGO
                   ${whereClause}
                   ORDER BY COM.COM_DATA DESC, COM.COM_NUMERO DESC`;

      const startTime = Date.now();
      const result: any = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const endTime = Date.now();

      let total: number | undefined = undefined;

      if (includeCount) {
        const countQuery = `SELECT COUNT(*) AS TOTAL
                            FROM compras COM
                            LEFT JOIN credores CR ON COM.CRE_CODIGO = CR.CRE_CODIGO
                            ${whereClause}`;

        const countRes: any = await new Promise((resolve, reject) => {
          connection.query(countQuery, filterParams, (err: any, res: any) => {
            if (err) return reject(err);
            resolve(res);
          });
        });

        const rawTotal =
          countRes?.[0]?.TOTAL ??
          countRes?.[0]?.total ??
          countRes?.[0]?.COUNT ??
          0;
        total = Number(rawTotal);
      }

      this.logger.log(
        `Busca de compras executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          { includeCount, total, ...queryDto },
        )}, Itens: ${Array.isArray(result) ? result.length : result ? 1 : 0}, Tempo SQL: ${endTime - startTime}ms`,
      );

      return new PaginatedResponse(
        Array.isArray(result) ? result : [],
        total,
        page,
        pageSize,
      );
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async getById(
    credentialsId: string,
    storeId: number | undefined,
    id: number,
  ): Promise<any> {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      let whereClause = `WHERE COM.COM_NUMERO = ?`;
      const params: any[] = [id];

      if (storeId) {
        whereClause += ` AND COM.LOJ_CODIGO = ?`;
        params.push(storeId);
      }

      const query = `SELECT
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
                     COM.SIT_CODIGO,
                     COM.USU_CODIGO,
                     COM.FUN_CODIGO,
                     COM.COM_TIPO,
                     COM.COM_DATABAIXA,
                     CAST(COM.COM_VRICMS AS NUMERIC(15,2)) as COM_VRICMS,
                     CAST(COM.COM_VRFRETENF AS NUMERIC(15,2)) as COM_VRFRETENF,
                     CAST(COM.COM_VRFRETEAVULSO AS NUMERIC(15,2)) as COM_VRFRETEAVULSO,
                     CAST(COM.COM_VRIPI AS NUMERIC(15,2)) as COM_VRIPI,
                     CAST(COM.COM_VRBASECALC AS NUMERIC(15,2)) as COM_VRBASECALC,
                     CAST(COM.COM_VRICMSANTECIPADO AS NUMERIC(15,2)) as COM_VRICMSANTECIPADO,
                     CAST(COM.COM_VRDESCONTO AS NUMERIC(15,2)) as COM_VRDESCONTO,
                     COM.COM_PRAZO,
                     COM.PED_NUMERO,
                     CAST(COM.COM_VROUTRASDESP AS NUMERIC(15,2)) as COM_VROUTRASDESP,
                     CAST(COM.COM_VRSEGURO AS NUMERIC(15,2)) as COM_VRSEGURO,
                     COM.COM_TIPOFRETE,
                     CAST(COM.COM_VRDESCCOMPL AS NUMERIC(15,2)) as COM_VRDESCCOMPL,
                     CAST(COM.COM_VRICMSDESON AS NUMERIC(15,2)) as COM_VRICMSDESON,
                     CAST(COM.COM_VRFCPST AS NUMERIC(15,2)) as COM_VRFCPST,
                     CAST(COM.COM_VRII AS NUMERIC(15,2)) as COM_VRII,
                     CAST(COM.COM_VRCOMPLEMENTO AS NUMERIC(15,2)) as COM_VRCOMPLEMENTO,
                     CAST(COM.COM_VRDIF_ICMS AS NUMERIC(15,2)) as COM_VRDIF_ICMS,
                     CAST(COM.COM_VRBASECALCSUBST AS NUMERIC(15,2)) as COM_VRBASECALCSUBST,
                     CAST(COM.COM_VRICMSSUBST AS NUMERIC(15,2)) as COM_VRICMSSUBST,
                     CAST(COM.COM_VRBONIFICACAO AS NUMERIC(15,2)) as COM_VRBONIFICACAO,
                     COM.COM_ESPECIE,
                     COM.NAF_CFOP,
                     COM.TRA_CODIGO,
                     TRA.TRA_NOME,
                     COM.COM_OBS1,
                     COM.COM_FINALIDADE,
                     COM.COM_GEROU_APOIO,
                     COM.COM_MANIFESTO,
                     CAST(COM.COM_TOTALBCIBSCBS AS NUMERIC(15,2)) as COM_TOTALBCIBSCBS,
                     CAST(COM.COM_TOTALCBS AS NUMERIC(15,2)) as COM_TOTALCBS,
                     CAST(COM.COM_TOTALUFIBS AS NUMERIC(15,2)) as COM_TOTALUFIBS,
                     CAST(COM.COM_TOTALMUNIBS AS NUMERIC(15,2)) as COM_TOTALMUNIBS,
                     CAST(COM.COM_TOTALIS AS NUMERIC(15,2)) as COM_TOTALIS
                   FROM compras COM
                   LEFT JOIN credores CR ON COM.CRE_CODIGO = CR.CRE_CODIGO
                   LEFT JOIN transportadoras TRA ON COM.TRA_CODIGO = TRA.TRA_CODIGO
                   ${whereClause}`;

      const startTime = Date.now();
      const result: any = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res?.[0] || null);
        });
      });
      const endTime = Date.now();

      this.logger.log(
        `Busca de compra por ID executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          { storeId, id },
        )}, Encontrado: ${!!result}, Tempo SQL: ${endTime - startTime}ms`,
      );

      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
