import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { PaginatedResponse } from 'src/common/pagination/paginated-response';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async get(
    credentialsId: string,
    storeId: number,
    page: number = 1,
    pageSize: number = 100,
    priceTable: number = 1,
    group?: number,
    brand?: number,
    minStock?: number,
    search?: string,
    startDateAlteracao?: string,
    endDateAlteracao?: string,
    includeCount: boolean = false,
  ) {
    let connection: any;
    connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      if (page < 1) {
        throw new BadRequestException(
          'Page must be greater than or equal to 1',
        );
      }

      if (pageSize < 1) {
        throw new BadRequestException(
          'Page size must be greater than or equal to 1',
        );
      }

      if (priceTable < 1 || priceTable > 12) {
        throw new BadRequestException(
          'Tabela de preço inválida. Deve ser entre 1 e 12.',
        );
      }

      if (startDateAlteracao && endDateAlteracao) {
        if (new Date(startDateAlteracao) > new Date(endDateAlteracao)) {
          throw new BadRequestException(
            'Data inicial deve ser menor que a data final.',
          );
        }
      }

      const whereClauses: string[] = [];
      const filterParams: (number | string)[] = [storeId];

      if (group) {
        whereClauses.push('P.GRU_CODIGO = ?');
        filterParams.push(group);
      }

      if (brand) {
        whereClauses.push('P.MAR_CODIGO = ?');
        filterParams.push(brand);
      }

      if (minStock) {
        whereClauses.push('E.EST_ATUAL >= ?');
        filterParams.push(minStock);
      }

      if (search) {
        if (search.length < 3) {
          throw new BadRequestException(
            'Pesquisa precisa ter pelo menos 3 caracteres.',
          );
        }
        whereClauses.push('P.PRO_DESCRICAO LIKE ?');
        filterParams.push(`%${search}%`);
      }

      if (startDateAlteracao && endDateAlteracao) {
        whereClauses.push('E.EST_DTALTERACAO BETWEEN ? AND ?');
        filterParams.push(startDateAlteracao, endDateAlteracao);
      }

      const whereSql =
        whereClauses.length > 0 ? ` WHERE ${whereClauses.join(' AND ')}` : '';

      const query = `SELECT FIRST ? SKIP ? 
                      P.PRO_CODIGO, P.PRO_CODIGOBAR, P.PRO_DESCRICAO, M.MAR_CODIGO, M.MAR_DESCRICAO, G.GRU_CODIGO, G.GRU_DESCRICAO, E.EST_ATUAL, E.EST_APOIO, PRO_PRECO${priceTable} PRECO, E.EST_DTALTERACAO
                      FROM produtos P 
                      INNER JOIN estoque E ON P.PRO_CODIGO = E.PRO_CODIGO AND E.LOJ_CODIGO = ?
                      LEFT JOIN marcas M ON P.MAR_CODIGO = M.MAR_CODIGO 
                      LEFT JOIN grupospro G ON P.GRU_CODIGO = G.GRU_CODIGO${whereSql}
                      ORDER BY P.PRO_DESCRICAO`;

      const params = [pageSize, (page - 1) * pageSize, ...filterParams];

      const queryStartTime = Date.now();
      const result: any = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const queryEndTime = Date.now();

      let total: number | undefined = undefined;

      if (includeCount) {
        const countQuery = `SELECT COUNT(*) AS TOTAL
                      FROM produtos P 
                      INNER JOIN estoque E ON P.PRO_CODIGO = E.PRO_CODIGO AND E.LOJ_CODIGO = ?
                      LEFT JOIN marcas M ON P.MAR_CODIGO = M.MAR_CODIGO 
                      LEFT JOIN grupospro G ON P.GRU_CODIGO = G.GRU_CODIGO${whereSql}`;

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
        `Busca de produtos executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          {
            storeId,
            page,
            pageSize,
            priceTable,
            group,
            brand,
            minStock,
            search,
            includeCount,
            total,
          },
        )}, Itens: ${Array.isArray(result) ? result.length : result ? 1 : 0}, Tempo SQL: ${
          queryEndTime - queryStartTime
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
    storeId: number = 1,
    id: number | string,
  ) {
    let connection: any;
    connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `SELECT
                      P.PRO_CODIGO, P.PRO_CODIGOBAR, P.PRO_PRCCOMPRA, P.PRO_PRCCUSTO, P.PRO_PRCCOMPRAFISCAL, P.PRO_CUSTOFISCAL,
                      E.PRO_PRECO1
                      FROM produtos P
                      LEFT JOIN estoque E ON P.PRO_CODIGO = E.PRO_CODIGO AND E.LOJ_CODIGO = ?
                      WHERE P.PRO_CODIGO = ?`;
      const params = [storeId, String(id).trim()];

      const queryStartTime = Date.now();
      const result = (await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res[0]);
        });
      })) as any;
      const queryEndTime = Date.now();

      this.logger.log(
        `Busca de produto por ID executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          { storeId, id },
        )}, Itens: ${result ? 1 : 0}, Tempo SQL: ${queryEndTime - queryStartTime}ms`,
      );

      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async getUnique(
    credentialsId: string,
    store_id: number = 1,
    id?: number,
    codigoBar?: number,
    priceTable: number = 1,
  ) {
    let connection: any;
    connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      let query = `SELECT
                      P.PRO_CODIGO, P.PRO_CODIGOBAR, P.PRO_DESCRICAO, M.MAR_CODIGO, M.MAR_DESCRICAO, G.GRU_CODIGO, G.GRU_DESCRICAO, E.EST_ATUAL ESTOQUE, E.PRO_PRECO${priceTable} PRECO
                      FROM produtos P 
                      INNER JOIN marcas M ON P.MAR_CODIGO = M.MAR_CODIGO 
                      INNER JOIN grupospro G ON P.GRU_CODIGO = G.GRU_CODIGO
                      INNER JOIN estoque E ON P.PRO_CODIGO = E.PRO_CODIGO AND E.LOJ_CODIGO = ?`;
      let params = [store_id];

      if (!id && !codigoBar) {
        throw new BadRequestException(
          'É necessário informar o ID ou o Código de Barras.',
        );
      }

      if (id) {
        query += ` WHERE P.PRO_CODIGO = ?`;
        params.push(id);
      }

      if (codigoBar) {
        query += id ? ` AND` : ` WHERE`;
        query += ` P.PRO_CODIGOBAR = ?`;
        params.push(codigoBar);
      }

      const queryStartTime = Date.now();
      const result = (await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res[0]);
        });
      })) as any;
      const queryEndTime = Date.now();

      this.logger.log(
        `Busca única de produto executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          { store_id, id, codigoBar },
        )}, Itens: ${result ? 1 : 0}, Tempo SQL: ${queryEndTime - queryStartTime}ms`,
      );

      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
