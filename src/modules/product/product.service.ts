import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) { }

  async get(
    credentialsId: string,
    storeId: number = 1,
    page: number = 1,
    pageSize: number = 10,
    group?: number,
    brand?: number,
    minStock?: number,
    search?: string,
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

      let params: (number | string)[] = [
        pageSize,
        (page - 1) * pageSize,
        storeId,
      ];
      let query = `SELECT FIRST ? SKIP ? 
                      P.PRO_CODIGO, P.PRO_CODIGOBAR, P.PRO_DESCRICAO, M.MAR_CODIGO, M.MAR_DESCRICAO, G.GRU_CODIGO, G.GRU_DESCRICAO, E.EST_ATUAL ESTOQUE, E.PRO_PRECO1 PRECO, E.PRO_PRECO2 PRECO2
                      FROM produtos P 
                      INNER JOIN marcas M ON P.MAR_CODIGO = M.MAR_CODIGO 
                      INNER JOIN grupospro G ON P.GRU_CODIGO = G.GRU_CODIGO
                      INNER JOIN estoque E ON P.PRO_CODIGO = E.PRO_CODIGO AND E.LOJ_CODIGO = ?`;

      if (group) {
        query += ` WHERE P.GRU_CODIGO = ?`;
        params.push(group);
      }

      if (brand) {
        query += group ? ` AND` : ` WHERE`;
        query += ` P.MAR_CODIGO = ?`;
        params.push(brand);
      }

      if (minStock) {
        query += group || brand ? ` AND` : ` WHERE`;
        query += ` E.EST_ATUAL >= ?`;
        params.push(minStock);
      }

      if (search) {
        if (search.length < 3) {
          throw new BadRequestException(
            'Pesquisa precisa ter pelo menos 3 caracteres.',
          );
        }
        query += group || brand || minStock ? ` AND` : ` WHERE`;
        query += ` P.PRO_DESCRICAO LIKE ?`;
        params.push(`%${search}%`);
      }

      query += ` ORDER BY P.PRO_DESCRICAO`;

      const queryStartTime = Date.now();
      const result = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const queryEndTime = Date.now();

      this.logger.log(
        `Busca de produtos executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          { storeId, page, pageSize, group, brand, minStock, search },
        )}, Itens: ${Array.isArray(result) ? result.length : result ? 1 : 0}, Tempo SQL: ${
          queryEndTime - queryStartTime
        }ms`,
      );

      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async getById(credentialsId: string, storeId: number = 1, id: number) {
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
      const params = [storeId, id];

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
  ) {
    let connection: any;
    connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      let query = `SELECT
                      P.PRO_CODIGO, P.PRO_CODIGOBAR, P.PRO_DESCRICAO, M.MAR_CODIGO, M.MAR_DESCRICAO, G.GRU_CODIGO, G.GRU_DESCRICAO, E.EST_ATUAL ESTOQUE, E.PRO_PRECO1 PRECO, E.PRO_PRECO2 PRECO2
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
