import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { PaginatedResponse } from 'src/common/pagination/paginated-response';
import { AdjustmentQueryDto } from './dto/adjustment-query.dto';

@Injectable()
export class AdjustmentService {
  private readonly logger = new Logger(AdjustmentService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) { }

  async get(
    credentialsId: string,
    storeId?: number,
    queryDto: AdjustmentQueryDto = {},
    includeCount: boolean = false,
  ) {
    const {
      page = 1,
      pageSize = 10,
      statusId,
      type,
      userId,
      adjustmentNumber,
      startDate,
      endDate,
    } = queryDto;

    if (page < 1) {
      throw new BadRequestException('A página deve ser maior ou igual a 1');
    }

    if (pageSize < 1) {
      throw new BadRequestException('O tamanho da página deve ser maior ou igual a 1');
    }

    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const filterConditions: string[] = [];
      const filterParams: (string | number)[] = [];

      const finalStoreId = storeId ?? queryDto.storeId;
      if (finalStoreId) {
        filterConditions.push('A.LOJ_CODIGO = ?');
        filterParams.push(finalStoreId);
      }

      if (statusId !== undefined) {
        filterConditions.push('A.SIT_CODIGO = ?');
        filterParams.push(statusId);
      }

      if (type) {
        filterConditions.push('A.ACE_TIPO = ?');
        filterParams.push(type);
      }

      if (userId !== undefined) {
        filterConditions.push('A.USU_CODIGO = ?');
        filterParams.push(userId);
      }

      if (adjustmentNumber !== undefined) {
        filterConditions.push('A.ACE_NUMERO = ?');
        filterParams.push(adjustmentNumber);
      }

      if (startDate && endDate) {
        filterConditions.push('A.ACE_DATA BETWEEN ? AND ?');
        filterParams.push(startDate, endDate);
      } else if (startDate) {
        filterConditions.push('A.ACE_DATA >= ?');
        filterParams.push(startDate);
      } else if (endDate) {
        filterConditions.push('A.ACE_DATA <= ?');
        filterParams.push(endDate);
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
                      A.ACE_NUMERO,
                      A.SIT_CODIGO,
                      S.SIT_DESCRICAO,
                      A.LOJ_CODIGO,
                      L.LOJ_NOME,
                      L.LOJ_FANTASIA,
                      A.USU_CODIGO,
                      U.USU_APELIDO,
                      U.USU_APELIDO,
                      A.ACE_DATA,
                      A.ACE_HORA,
                      A.ACE_DATABAIXA,
                      A.ACE_HORABAIXA,
                      A.ACE_OBS1,
                      A.ACE_OBS2,
                      CAST(A.ACE_TOTAL AS NUMERIC(15,2)) AS ACE_TOTAL,
                      CAST(A.ACE_QUANTIDADE AS NUMERIC(15,2)) AS ACE_QUANTIDADE,
                      A.ACE_DATAALTERACAO,
                      A.ACE_TIPO,
                      A.ACE_GEROUFISCO,
                      A.NTF_NUMERO
                    FROM ACERTOS A
                    LEFT JOIN SITUACAO S ON S.SIT_CODIGO = A.SIT_CODIGO
                    LEFT JOIN LOJAS L ON L.LOJ_CODIGO = A.LOJ_CODIGO
                    LEFT JOIN USUARIOS U ON U.USU_CODIGO = A.USU_CODIGO
                    ${whereClause}
                    ORDER BY A.ACE_DATA DESC, A.ACE_NUMERO DESC`;

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
                            FROM ACERTOS A
                            LEFT JOIN SITUACAO S ON S.SIT_CODIGO = A.SIT_CODIGO
                            LEFT JOIN LOJAS L ON L.LOJ_CODIGO = A.LOJ_CODIGO
                            LEFT JOIN USUARIOS U ON U.USU_CODIGO = A.USU_CODIGO
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
        `Busca de acertos executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          { storeId: finalStoreId, page, pageSize, ...queryDto },
        )}, Itens: ${Array.isArray(result) ? result.length : result ? 1 : 0}, Tempo SQL: ${endTime - startTime
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
      const filterConditions = ['A.ACE_NUMERO = ?'];
      const params: (number | string)[] = [id];

      if (storeId) {
        filterConditions.push('A.LOJ_CODIGO = ?');
        params.push(storeId);
      }

      const query = `SELECT FIRST 1
                      A.ACE_NUMERO,
                      A.SIT_CODIGO,
                      S.SIT_DESCRICAO,
                      A.LOJ_CODIGO,
                      L.LOJ_NOME,
                      L.LOJ_FANTASIA,
                      A.USU_CODIGO,
                      U.USU_APELIDO,
                      U.USU_APELIDO,
                      A.ACE_DATA,
                      A.ACE_HORA,
                      A.ACE_DATABAIXA,
                      A.ACE_HORABAIXA,
                      A.ACE_OBS1,
                      A.ACE_OBS2,
                      CAST(A.ACE_TOTAL AS NUMERIC(15,2)) AS ACE_TOTAL,
                      CAST(A.ACE_QUANTIDADE AS NUMERIC(15,2)) AS ACE_QUANTIDADE,
                      A.ACE_DATAALTERACAO,
                      A.ACE_TIPO,
                      A.ACE_GEROUFISCO,
                      A.NTF_NUMERO
                    FROM ACERTOS A
                    LEFT JOIN SITUACAO S ON S.SIT_CODIGO = A.SIT_CODIGO
                    LEFT JOIN LOJAS L ON L.LOJ_CODIGO = A.LOJ_CODIGO
                    LEFT JOIN USUARIOS U ON U.USU_CODIGO = A.USU_CODIGO
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
        `Busca de acerto por ID executada. Tenant: ${credentialsId}, ID: ${id}, Tempo SQL: ${endTime - startTime
        }ms`,
      );

      return Array.isArray(result) && result.length > 0 ? result[0] : null;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async getItemsByAdjustmentNumber(
    credentialsId: string,
    adjustmentNumber: number,
  ) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `SELECT
                      IA.IAC_NUMERO,
                      IA.ACE_NUMERO,
                      IA.PRO_CODIGO,
                      P.PRO_CODIGOBAR,
                      P.PRO_DESCRICAO,
                      P.PRO_UNIDADE,
                      P.PRO_REFERENCIA,
                      M.MAR_CODIGO,
                      M.MAR_DESCRICAO,
                      G.GRU_CODIGO,
                      G.GRU_DESCRICAO,
                      CAST(IA.IAC_QTDE AS NUMERIC(15,4)) AS IAC_QTDE,
                      CAST(IA.IAC_PRECO AS NUMERIC(15,4)) AS IAC_PRECO,
                      CAST(IA.IAC_TOTAL AS NUMERIC(15,2)) AS IAC_TOTAL,
                      IA.IAC_TIPOACE,
                      CAST(IA.IAC_QTDECONTADA AS NUMERIC(15,4)) AS IAC_QTDECONTADA,
                      CAST(IA.IAC_ESTATUAL AS NUMERIC(15,4)) AS IAC_ESTATUAL,
                      IA.IAC_MOTIVO,
                      IA.TAM_CODIGO,
                      IA.COR_CODIGO,
                      IA.PRG_CODIGO,
                      CAST(IA.IAC_QTDEGRADE AS NUMERIC(18,2)) AS IAC_QTDEGRADE
                    FROM ITENSACE IA
                    INNER JOIN PRODUTOS P ON P.PRO_CODIGO = IA.PRO_CODIGO
                    LEFT JOIN MARCAS M ON M.MAR_CODIGO = P.MAR_CODIGO
                    LEFT JOIN GRUPOSPRO G ON G.GRU_CODIGO = P.GRU_CODIGO
                    WHERE IA.ACE_NUMERO = ?
                    ORDER BY IA.IAC_NUMERO ASC`;

      const startTime = Date.now();
      const result: any = await new Promise((resolve, reject) => {
        connection.query(query, [adjustmentNumber], (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const endTime = Date.now();

      this.logger.log(
        `Busca de itens do acerto executada. Tenant: ${credentialsId}, Acerto: ${adjustmentNumber}, Itens: ${Array.isArray(result) ? result.length : 0
        }, Tempo SQL: ${endTime - startTime}ms`,
      );

      return Array.isArray(result) ? result : [];
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
