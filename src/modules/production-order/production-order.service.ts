import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { PaginatedResponse } from 'src/common/pagination/paginated-response';
import { ProductionOrderQueryDto } from './dto/production-order-query.dto';

@Injectable()
export class ProductionOrderService {
  private readonly logger = new Logger(ProductionOrderService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async get(
    credentialsId: string,
    storeId?: number,
    queryDto: ProductionOrderQueryDto = {},
    includeCount: boolean = false,
  ) {
    const {
      page = 1,
      pageSize = 10,
      statusId,
      productCode,
      productionOrderNumber,
      startDate,
      endDate,
      startDateBaixa,
      endDateBaixa,
    } = queryDto;

    if (page < 1) {
      throw new BadRequestException('A página deve ser maior ou igual a 1');
    }

    if (pageSize < 1) {
      throw new BadRequestException(
        'O tamanho da página deve ser maior ou igual a 1',
      );
    }

    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const filterConditions: string[] = [];
      const filterParams: (string | number)[] = [];

      const finalStoreId = storeId ?? queryDto.storeId;
      if (finalStoreId) {
        filterConditions.push('OP.LOJ_CODIGO = ?');
        filterParams.push(finalStoreId);
      }

      if (statusId !== undefined) {
        filterConditions.push('OP.SIT_CODIGO = ?');
        filterParams.push(statusId);
      }

      if (productCode) {
        filterConditions.push('OP.PRO_CODIGO = ?');
        filterParams.push(productCode);
      }

      if (productionOrderNumber !== undefined) {
        filterConditions.push('OP.ORP_NUMERO = ?');
        filterParams.push(productionOrderNumber);
      }

      if (startDate && endDate) {
        filterConditions.push('OP.ORP_DATA BETWEEN ? AND ?');
        filterParams.push(startDate, endDate);
      } else if (startDate) {
        filterConditions.push('OP.ORP_DATA >= ?');
        filterParams.push(startDate);
      } else if (endDate) {
        filterConditions.push('OP.ORP_DATA <= ?');
        filterParams.push(endDate);
      }

      if (startDateBaixa && endDateBaixa) {
        filterConditions.push('OP.ORP_DATABAIXA BETWEEN ? AND ?');
        filterParams.push(startDateBaixa, endDateBaixa);
      } else if (startDateBaixa) {
        filterConditions.push('OP.ORP_DATABAIXA >= ?');
        filterParams.push(startDateBaixa);
      } else if (endDateBaixa) {
        filterConditions.push('OP.ORP_DATABAIXA <= ?');
        filterParams.push(endDateBaixa);
      }

      const whereClause =
        filterConditions.length > 0
          ? `WHERE ${filterConditions.join(' AND ')}`
          : '';

      const queryParams: (string | number)[] = [
        pageSize,
        (page - 1) * pageSize,
        ...filterParams,
      ];

      const query = `SELECT FIRST ? SKIP ?
                      OP.ORP_NUMERO,
                      OP.SIT_CODIGO,
                      S.SIT_DESCRICAO,
                      OP.LOJ_CODIGO,
                      L.LOJ_NOME,
                      L.LOJ_FANTASIA,
                      OP.USU_CODIGO,
                      U.USU_APELIDO,
                      OP.ORP_DATA,
                      OP.ORP_HORA,
                      OP.ORP_DATAINICIO,
                      OP.ORP_DATAFINAL,
                      OP.PRO_CODIGO,
                      P.PRO_DESCRICAO,
                      P.PRO_UNIDADE,
                      P.PRO_CODIGOBAR,
                      OP.ETA_NUMERO,
                      OP.COM_NUMERO,
                      CAST(OP.ORP_QUANTIDADEACABADA AS NUMERIC(15,4)) AS ORP_QUANTIDADEACABADA,
                      CAST(OP.ORP_TOTAL AS NUMERIC(15,2)) AS ORP_TOTAL,
                      CAST(OP.ORP_QUANTIDADE AS NUMERIC(15,4)) AS ORP_QUANTIDADE,
                      OP.ORP_OBS,
                      OP.ORP_DATABAIXA,
                      OP.ORP_HORABAIXA,
                      OP.SDA_NUMERO,
                      OP.COM_NUMERO2
                    FROM ORDENSPRODUCAO OP
                    LEFT JOIN PRODUTOS P ON P.PRO_CODIGO = OP.PRO_CODIGO
                    LEFT JOIN SITUACAO S ON S.SIT_CODIGO = OP.SIT_CODIGO
                    LEFT JOIN LOJAS L ON L.LOJ_CODIGO = OP.LOJ_CODIGO
                    LEFT JOIN USUARIOS U ON U.USU_CODIGO = OP.USU_CODIGO
                    ${whereClause}
                    ORDER BY OP.ORP_DATA DESC, OP.ORP_NUMERO DESC`;

      const startTime = Date.now();
      const result: any = await new Promise((resolve, reject) => {
        connection.query(query, queryParams, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const endTime = Date.now();

      let total: number | undefined;

      if (includeCount) {
        const countQuery = `SELECT COUNT(*) AS TOTAL
                            FROM ORDENSPRODUCAO OP
                            LEFT JOIN PRODUTOS P ON P.PRO_CODIGO = OP.PRO_CODIGO
                            LEFT JOIN SITUACAO S ON S.SIT_CODIGO = OP.SIT_CODIGO
                            LEFT JOIN LOJAS L ON L.LOJ_CODIGO = OP.LOJ_CODIGO
                            LEFT JOIN USUARIOS U ON U.USU_CODIGO = OP.USU_CODIGO
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
        `Busca de ordens de produção executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          { storeId: finalStoreId, page, pageSize, ...queryDto },
        )}, Itens: ${Array.isArray(result) ? result.length : result ? 1 : 0}, Tempo SQL: ${
          endTime - startTime
        }ms`,
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
  ) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const filterConditions = ['OP.ORP_NUMERO = ?'];
      const params: (number | string)[] = [id];

      if (storeId) {
        filterConditions.push('OP.LOJ_CODIGO = ?');
        params.push(storeId);
      }

      const query = `SELECT FIRST 1
                      OP.ORP_NUMERO,
                      OP.SIT_CODIGO,
                      S.SIT_DESCRICAO,
                      OP.LOJ_CODIGO,
                      L.LOJ_NOME,
                      L.LOJ_FANTASIA,
                      OP.USU_CODIGO,
                      U.USU_APELIDO,
                      OP.ORP_DATA,
                      OP.ORP_HORA,
                      OP.ORP_DATAINICIO,
                      OP.ORP_DATAFINAL,
                      OP.PRO_CODIGO,
                      P.PRO_DESCRICAO,
                      P.PRO_UNIDADE,
                      P.PRO_CODIGOBAR,
                      OP.ETA_NUMERO,
                      OP.COM_NUMERO,
                      CAST(OP.ORP_QUANTIDADEACABADA AS NUMERIC(15,4)) AS ORP_QUANTIDADEACABADA,
                      CAST(OP.ORP_TOTAL AS NUMERIC(15,2)) AS ORP_TOTAL,
                      CAST(OP.ORP_QUANTIDADE AS NUMERIC(15,4)) AS ORP_QUANTIDADE,
                      OP.ORP_OBS,
                      OP.ORP_DATABAIXA,
                      OP.ORP_HORABAIXA,
                      OP.SDA_NUMERO,
                      OP.COM_NUMERO2
                    FROM ORDENSPRODUCAO OP
                    LEFT JOIN PRODUTOS P ON P.PRO_CODIGO = OP.PRO_CODIGO
                    LEFT JOIN SITUACAO S ON S.SIT_CODIGO = OP.SIT_CODIGO
                    LEFT JOIN LOJAS L ON L.LOJ_CODIGO = OP.LOJ_CODIGO
                    LEFT JOIN USUARIOS U ON U.USU_CODIGO = OP.USU_CODIGO
                    WHERE ${filterConditions.join(' AND ')}`;

      const startTime = Date.now();
      const result: any = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const endTime = Date.now();

      this.logger.log(
        `Busca de ordem de produção por ID executada. Tenant: ${credentialsId}, ID: ${id}, Tempo SQL: ${
          endTime - startTime
        }ms`,
      );

      return Array.isArray(result) && result.length > 0 ? result[0] : null;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async getItemsByProductionOrderNumber(
    credentialsId: string,
    orderNumber: number,
  ) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `SELECT
                      OPI.OPI_NUMERO,
                      OPI.ORP_NUMERO,
                      OPI.PRO_CODIGO,
                      P.PRO_CODIGOBAR,
                      P.PRO_DESCRICAO,
                      P.PRO_UNIDADE,
                      P.PRO_REFERENCIA,
                      M.MAR_CODIGO,
                      M.MAR_DESCRICAO,
                      G.GRU_CODIGO,
                      G.GRU_DESCRICAO,
                      CAST(OPI.OPI_PRECO AS NUMERIC(15,4)) AS OPI_PRECO,
                      CAST(OPI.OPI_QTDE AS NUMERIC(15,4)) AS OPI_QTDE,
                      CAST(OPI.OPI_TOTAL AS NUMERIC(15,2)) AS OPI_TOTAL
                    FROM ORDENSPRODUCAOITENS OPI
                    LEFT JOIN PRODUTOS P ON P.PRO_CODIGO = OPI.PRO_CODIGO
                    LEFT JOIN MARCAS M ON M.MAR_CODIGO = P.MAR_CODIGO
                    LEFT JOIN GRUPOSPRO G ON G.GRU_CODIGO = P.GRU_CODIGO
                    WHERE OPI.ORP_NUMERO = ?
                    ORDER BY OPI.OPI_NUMERO ASC`;

      const startTime = Date.now();
      const result: any = await new Promise((resolve, reject) => {
        connection.query(query, [orderNumber], (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const endTime = Date.now();

      this.logger.log(
        `Busca de itens da ordem de produção executada. Tenant: ${credentialsId}, Ordem: ${orderNumber}, Itens: ${
          Array.isArray(result) ? result.length : 0
        }, Tempo SQL: ${endTime - startTime}ms`,
      );

      return Array.isArray(result) ? result : [];
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}

