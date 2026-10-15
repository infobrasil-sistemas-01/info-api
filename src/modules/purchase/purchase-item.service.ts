import { Injectable, Logger } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { PaginatedResponse } from 'src/common/pagination/paginated-response';
import { GetPurchaseItemsQueryDto } from './dto/purchase-item-query.dto';

@Injectable()
export class PurchaseItemService {
  private readonly logger = new Logger(PurchaseItemService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async findItemsByPurchaseId(
    credentialsId: string,
    purchaseId: number,
  ): Promise<any[]> {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `SELECT
                       ICP.ICP_NUMERO,
                       ICP.COM_NUMERO,
                       ICP.PRO_CODIGO,
                       P.PRO_DESCRICAO,
                       P.PRO_UNIDADE,
                       CAST(ICP.ICP_QTDE AS NUMERIC(15,4)) as ICP_QTDE,
                       CAST(ICP.ICP_PRECO AS NUMERIC(15,4)) as ICP_PRECO,
                       CAST(ICP.ICP_TOTAL AS NUMERIC(15,2)) as ICP_TOTAL,
                       CAST(ICP.ICP_LIQUIDO AS NUMERIC(15,2)) as ICP_LIQUIDO,
                       CAST(ICP.ICP_VLRTOTAL AS NUMERIC(15,2)) as ICP_VLRTOTAL,
                       ICP.NAF_CFOP,
                       CAST(ICP.ICP_PERCICMS AS NUMERIC(15,2)) as ICP_PERCICMS,
                       CAST(ICP.ICP_VLRICMS AS NUMERIC(15,2)) as ICP_VLRICMS,
                       CAST(ICP.ICP_PERCIPI AS NUMERIC(15,2)) as ICP_PERCIPI,
                       CAST(ICP.ICP_VLRIPI AS NUMERIC(15,2)) as ICP_VLRIPI,
                       CAST(ICP.ICP_VLRFRETE AS NUMERIC(15,2)) as ICP_VLRFRETE,
                       CAST(ICP.ICP_VLRSEGURO AS NUMERIC(15,2)) as ICP_VLRSEGURO,
                       CAST(ICP.ICP_VLRDESCONTO AS NUMERIC(15,2)) as ICP_VLRDESCONTO,
                       CAST(ICP.ICP_VLROUTRAS AS NUMERIC(15,2)) as ICP_VLROUTRAS,
                       ICP.ICP_DATAVAL,
                       ICP.ICP_DATAFAB,
                       ICP.LOT_NUMERO,
                       CAST(ICP.ICP_QTDECONFERIDA AS NUMERIC(15,4)) as ICP_QTDECONFERIDA,
                       ICP.ICM_CODIGO,
                       ICP.PIS_CODIGO,
                       ICP.COF_CODIGO,
                       CAST(ICP.ICP_VRBCIBSCBS AS NUMERIC(15,4)) as ICP_VRBCIBSCBS,
                       CAST(ICP.ICP_PERCCBS AS NUMERIC(15,4)) as ICP_PERCCBS,
                       CAST(ICP.ICP_VRCBS AS NUMERIC(15,4)) as ICP_VRCBS,
                       CAST(ICP.ICP_PERCIBSUF AS NUMERIC(15,4)) as ICP_PERCIBSUF,
                       CAST(ICP.ICP_VRIBSUF AS NUMERIC(15,4)) as ICP_VRIBSUF,
                       CAST(ICP.ICP_PERCIBSMUN AS NUMERIC(15,4)) as ICP_PERCIBSMUN,
                       CAST(ICP.ICP_VRIBSMUN AS NUMERIC(15,4)) as ICP_VRIBSMUN,
                       ICP.TAM_CODIGO,
                       T.TAM_DESCRICAO,
                       ICP.COR_CODIGO,
                       C.COR_DESCRICAO,
                       ICP.PRG_CODIGO
                     FROM ITENSCOM ICP
                     LEFT JOIN PRODUTOS P ON P.PRO_CODIGO = ICP.PRO_CODIGO
                     LEFT JOIN TAMANHOS T ON T.TAM_CODIGO = ICP.TAM_CODIGO
                     LEFT JOIN CORES C ON C.COR_CODIGO = ICP.COR_CODIGO
                     WHERE ICP.COM_NUMERO = ?
                     ORDER BY ICP.ICP_NUMERO ASC`;

      const startTime = Date.now();
      const result: any = await new Promise((resolve, reject) => {
        connection.query(query, [purchaseId], (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const endTime = Date.now();

      this.logger.log(
        `Busca de itens da compra executada. Tenant: ${credentialsId}, purchaseId: ${purchaseId}, Itens: ${
          Array.isArray(result) ? result.length : result ? 1 : 0
        }, Tempo SQL: ${endTime - startTime}ms`,
      );

      return Array.isArray(result) ? result : [];
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async get(
    credentialsId: string,
    filters: GetPurchaseItemsQueryDto,
    includeCount: boolean = false,
  ) {
    const {
      page = 1,
      pageSize = 10,
      purchaseId,
      productId,
      supplierId,
      storeId,
      startDate,
      endDate,
      invoiceNumber,
      brandId,
      groupId,
      cfop,
    } = filters;

    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const params: any[] = [pageSize, (page - 1) * pageSize];
      const filterParams: any[] = [];
      let whereClause = 'WHERE 1=1';

      if (purchaseId) {
        whereClause += ` AND ICP.COM_NUMERO = ?`;
        params.push(purchaseId);
        filterParams.push(purchaseId);
      }

      if (productId) {
        whereClause += ` AND ICP.PRO_CODIGO = ?`;
        params.push(productId);
        filterParams.push(productId);
      }

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

      if (brandId) {
        whereClause += ` AND P.MAR_CODIGO = ?`;
        params.push(brandId);
        filterParams.push(brandId);
      }

      if (groupId) {
        whereClause += ` AND P.GRU_CODIGO = ?`;
        params.push(groupId);
        filterParams.push(groupId);
      }

      if (cfop) {
        whereClause += ` AND ICP.NAF_CFOP = ?`;
        params.push(cfop);
        filterParams.push(cfop);
      }

      if (startDate) {
        whereClause += ` AND COM.COM_DATA >= ?`;
        params.push(startDate);
        filterParams.push(startDate);
      }

      if (endDate) {
        whereClause += ` AND COM.COM_DATA <= ?`;
        params.push(endDate);
        filterParams.push(endDate);
      }

      const query = `SELECT FIRST ? SKIP ?
                       ICP.ICP_NUMERO,
                       ICP.COM_NUMERO,
                       COM.COM_DATA,
                       COM.LOJ_CODIGO,
                       COM.COM_NUMERONF,
                       COM.CRE_CODIGO,
                       CR.CRE_NOME,
                       ICP.PRO_CODIGO,
                       P.PRO_DESCRICAO,
                       P.PRO_UNIDADE,
                       CAST(ICP.ICP_QTDE AS NUMERIC(15,4)) as ICP_QTDE,
                       CAST(ICP.ICP_PRECO AS NUMERIC(15,4)) as ICP_PRECO,
                       CAST(ICP.ICP_TOTAL AS NUMERIC(15,2)) as ICP_TOTAL,
                       CAST(ICP.ICP_VLRDESCONTO AS NUMERIC(15,2)) as ICP_VLRDESCONTO,
                       CAST(ICP.ICP_LIQUIDO AS NUMERIC(15,2)) as ICP_LIQUIDO,
                       CAST(ICP.ICP_VLRTOTAL AS NUMERIC(15,2)) as ICP_VLRTOTAL,
                       ICP.NAF_CFOP,
                       P.MAR_CODIGO,
                       M.MAR_DESCRICAO,
                       P.GRU_CODIGO,
                       G.GRU_DESCRICAO,
                       CAST(ICP.ICP_PERCICMS AS NUMERIC(15,2)) as ICP_PERCICMS,
                       CAST(ICP.ICP_VLRICMS AS NUMERIC(15,2)) as ICP_VLRICMS,
                       CAST(ICP.ICP_PERCIPI AS NUMERIC(15,2)) as ICP_PERCIPI,
                       CAST(ICP.ICP_VLRIPI AS NUMERIC(15,2)) as ICP_VLRIPI,
                       ICP.LOT_NUMERO,
                       ICP.ICP_DATAVAL,
                       ICP.ICP_DATAFAB,
                       CAST(ICP.ICP_VRBCIBSCBS AS NUMERIC(15,4)) as ICP_VRBCIBSCBS,
                       CAST(ICP.ICP_PERCCBS AS NUMERIC(15,4)) as ICP_PERCCBS,
                       CAST(ICP.ICP_VRCBS AS NUMERIC(15,4)) as ICP_VRCBS,
                       CAST(ICP.ICP_PERCIBSUF AS NUMERIC(15,4)) as ICP_PERCIBSUF,
                       CAST(ICP.ICP_VRIBSUF AS NUMERIC(15,4)) as ICP_VRIBSUF,
                       ICP.TAM_CODIGO,
                       T.TAM_DESCRICAO,
                       ICP.COR_CODIGO,
                       C.COR_DESCRICAO,
                       ICP.PRG_CODIGO
                     FROM ITENSCOM ICP
                     INNER JOIN COMPRAS COM ON COM.COM_NUMERO = ICP.COM_NUMERO
                     LEFT JOIN PRODUTOS P ON P.PRO_CODIGO = ICP.PRO_CODIGO
                     LEFT JOIN MARCAS M ON M.MAR_CODIGO = P.MAR_CODIGO
                     LEFT JOIN GRUPOSPRO G ON G.GRU_CODIGO = P.GRU_CODIGO
                     LEFT JOIN CREDORES CR ON CR.CRE_CODIGO = COM.CRE_CODIGO
                     LEFT JOIN TAMANHOS T ON T.TAM_CODIGO = ICP.TAM_CODIGO
                     LEFT JOIN CORES C ON C.COR_CODIGO = ICP.COR_CODIGO
                     ${whereClause}
                     ORDER BY COM.COM_DATA DESC, COM.COM_NUMERO DESC, ICP.ICP_NUMERO ASC`;

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
                            FROM ITENSCOM ICP
                            INNER JOIN COMPRAS COM ON COM.COM_NUMERO = ICP.COM_NUMERO
                            LEFT JOIN PRODUTOS P ON P.PRO_CODIGO = ICP.PRO_CODIGO
                            LEFT JOIN MARCAS M ON M.MAR_CODIGO = P.MAR_CODIGO
                            LEFT JOIN GRUPOSPRO G ON G.GRU_CODIGO = P.GRU_CODIGO
                            LEFT JOIN CREDORES CR ON CR.CRE_CODIGO = COM.CRE_CODIGO
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
        `Busca transversal de itens de compras executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          { includeCount, total, ...filters },
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
}
