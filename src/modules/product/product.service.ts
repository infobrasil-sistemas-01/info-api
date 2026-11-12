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
                      P.PRO_CODIGO, P.PRO_CODIGOBAR, P.PRO_DESCRICAO, P.PRO_UNIDADE, P.CRE_CODIGO, CR.CRE_NOME, M.MAR_CODIGO, M.MAR_DESCRICAO, G.GRU_CODIGO, G.GRU_DESCRICAO, E.EST_ATUAL, E.EST_APOIO, PRO_PRECO${priceTable} PRECO, E.EST_DTALTERACAO, P.PRO_PRCCOMPRA, P.PRO_PRCCUSTO, P.PRO_PRCCOMPRAFISCAL, P.PRO_CUSTOFISCAL
                      FROM produtos P 
                      INNER JOIN estoque E ON P.PRO_CODIGO = E.PRO_CODIGO AND E.LOJ_CODIGO = ?
                      LEFT JOIN marcas M ON P.MAR_CODIGO = M.MAR_CODIGO 
                      LEFT JOIN grupospro G ON P.GRU_CODIGO = G.GRU_CODIGO
                      LEFT JOIN credores CR ON P.CRE_CODIGO = CR.CRE_CODIGO${whereSql}
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
    priceTable: number = 1,
  ) {
    let connection: any;
    connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const safePriceTable =
        Number(priceTable) >= 1 && Number(priceTable) <= 12
          ? Math.floor(Number(priceTable))
          : 1;

      const query = `SELECT
                      P.PRO_CODIGO, P.PRO_CODIGOBAR, P.PRO_UNIDADE, P.CRE_CODIGO, CR.CRE_NOME, P.PRO_PRCCOMPRA, P.PRO_PRCCUSTO, P.PRO_PRCCOMPRAFISCAL, P.PRO_CUSTOFISCAL,
                      E.PRO_PRECO1,
                      COALESCE(E.PRO_PRECO${safePriceTable}, E.PRO_PRECO1, 0) AS PRO_PRECO_TABELA
                      FROM produtos P
                      LEFT JOIN estoque E ON P.PRO_CODIGO = E.PRO_CODIGO AND E.LOJ_CODIGO = ?
                      LEFT JOIN credores CR ON P.CRE_CODIGO = CR.CRE_CODIGO
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
                      P.PRO_CODIGO, P.PRO_CODIGOBAR, P.PRO_DESCRICAO, P.PRO_UNIDADE, P.CRE_CODIGO, CR.CRE_NOME, M.MAR_CODIGO, M.MAR_DESCRICAO, G.GRU_CODIGO, G.GRU_DESCRICAO, E.EST_ATUAL, E.EST_APOIO, PRO_PRECO${priceTable} PRECO, E.EST_DTALTERACAO, P.PRO_PRCCOMPRA, P.PRO_PRCCUSTO, P.PRO_PRCCOMPRAFISCAL, P.PRO_CUSTOFISCAL,
                      P.PRO_ESPECIFICACAO, P.PRO_ALTURA, P.PRO_LARGURA, P.PRO_COMPRIMENTO, P.PRO_PESO, P.PRO_COR
                      FROM produtos P 
                      INNER JOIN estoque E ON P.PRO_CODIGO = E.PRO_CODIGO AND E.LOJ_CODIGO = ?
                      LEFT JOIN marcas M ON P.MAR_CODIGO = M.MAR_CODIGO 
                      LEFT JOIN grupospro G ON P.GRU_CODIGO = G.GRU_CODIGO
                      LEFT JOIN credores CR ON P.CRE_CODIGO = CR.CRE_CODIGO`;
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

  async getStock(
    credentialsId: string,
    page: number = 1,
    pageSize: number = 50,
    storeId?: number,
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

      if (startDateAlteracao && endDateAlteracao) {
        if (new Date(startDateAlteracao) > new Date(endDateAlteracao)) {
          throw new BadRequestException(
            'Data inicial deve ser menor que a data final.',
          );
        }
      }

      const whereClauses: string[] = [];
      const filterParams: (number | string)[] = [];

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
        whereClauses.push('P.PRO_DATAALTERACAO BETWEEN ? AND ?');
        filterParams.push(startDateAlteracao, endDateAlteracao);
      }

      const whereSql =
        whereClauses.length > 0 ? ` WHERE ${whereClauses.join(' AND ')}` : '';

      const productsQuery = `SELECT FIRST ? SKIP ?
                              P.PRO_CODIGO, P.PRO_CODIGOBAR, P.PRO_DESCRICAO
                              FROM produtos P${whereSql}
                              ORDER BY P.PRO_DESCRICAO`;

      const params = [pageSize, (page - 1) * pageSize, ...filterParams];

      const queryStartTime = Date.now();
      const products: any = await new Promise((resolve, reject) => {
        connection.query(productsQuery, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });

      let total: number | undefined = undefined;

      if (includeCount) {
        const countQuery = `SELECT COUNT(*) AS TOTAL FROM produtos P${whereSql}`;
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

      const productList = Array.isArray(products) ? products : [];

      if (productList.length === 0) {
        const queryEndTime = Date.now();
        this.logger.log(
          `Busca de estoque de produtos executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
            {
              page,
              pageSize,
              storeId,
              search,
              startDateAlteracao,
              endDateAlteracao,
              total,
            },
          )}, Itens: 0, Tempo SQL: ${queryEndTime - queryStartTime}ms`,
        );
        return new PaginatedResponse([], total, page, pageSize);
      }

      // Fase 2: Busca estoques em lote
      const proCodigos = productList.map((p) => String(p.PRO_CODIGO).trim());
      const inPlaceholders = proCodigos.map(() => '?').join(',');

      const stockParams: (string | number)[] = [...proCodigos];
      let stockStoreFilter = '';
      if (storeId) {
        stockStoreFilter = ' AND E.LOJ_CODIGO = ?';
        stockParams.push(storeId);
      }

      const stockQuery = `SELECT
                            E.PRO_CODIGO, E.LOJ_CODIGO, E.EST_ATUAL, E.EST_APOIO
                            FROM estoque E
                            WHERE E.PRO_CODIGO IN (${inPlaceholders})${stockStoreFilter}
                            ORDER BY E.LOJ_CODIGO`;

      const stockRows: any = await new Promise((resolve, reject) => {
        connection.query(stockQuery, stockParams, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });

      const stocksByProduct = new Map<string, any[]>();
      if (Array.isArray(stockRows)) {
        for (const row of stockRows) {
          const key = String(row.PRO_CODIGO).trim();
          if (!stocksByProduct.has(key)) {
            stocksByProduct.set(key, []);
          }
          stocksByProduct.get(key)!.push({
            LOJ_CODIGO: row.LOJ_CODIGO,
            EST_ATUAL: row.EST_ATUAL != null ? Number(row.EST_ATUAL) : 0,
            EST_APOIO: row.EST_APOIO != null ? Number(row.EST_APOIO) : 0,
          });
        }
      }

      const result = productList.map((p) => ({
        PRO_CODIGO: p.PRO_CODIGO,
        PRO_CODIGOBAR: p.PRO_CODIGOBAR,
        PRO_DESCRICAO: p.PRO_DESCRICAO,
        STOCKS: stocksByProduct.get(String(p.PRO_CODIGO).trim()) || [],
      }));

      const queryEndTime = Date.now();
      this.logger.log(
        `Busca de estoque de produtos executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          {
            page,
            pageSize,
            storeId,
            search,
            startDateAlteracao,
            endDateAlteracao,
            total,
          },
        )}, Itens: ${result.length}, Tempo SQL: ${queryEndTime - queryStartTime}ms`,
      );

      return new PaginatedResponse(result, total, page, pageSize);
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
