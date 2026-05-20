import { Injectable, Logger } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

@Injectable()
export class DeliveryService {
  private readonly logger = new Logger(DeliveryService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async get(
    credentialsId: string,
    storeId?: number,
    page: number = 1,
    pageSize: number = 10,
    filters: {
      startDate?: string;
      endDate?: string;
      situation?: number;
      vehiclePlate?: string;
      providerId?: number;
    } = {},
  ) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      let whereClause = 'WHERE 1=1';
      const params: any[] = [pageSize, (page - 1) * pageSize];

      if (storeId) {
        whereClause += ' AND V.LOJ_CODIGO = ?';
        params.push(storeId);
      }

      if (filters.startDate) {
        whereClause += ' AND E.ENT_DATA >= ?';
        params.push(filters.startDate);
      }

      if (filters.endDate) {
        whereClause += ' AND E.ENT_DATA <= ?';
        params.push(filters.endDate);
      }

      if (filters.situation !== undefined) {
        whereClause += ' AND E.SIT_CODIGO = ?';
        params.push(filters.situation);
      }

      if (filters.vehiclePlate) {
        whereClause += ' AND E.VEI_PLACA = ?';
        params.push(filters.vehiclePlate);
      }

      if (filters.providerId !== undefined) {
        whereClause += ' AND E.PRE_CODIGO = ?';
        params.push(filters.providerId);
      }

      const query = `
        SELECT FIRST ? SKIP ?
          E.VEN_NUMERO,
          E.ENT_NUMERO,
          E.PRE_CODIGO,
          P.PRE_NOME,
          E.SIT_CODIGO,
          E.USU_CODIGO,
          E.ENT_DATA,
          E.ENT_HORA,
          E.ENT_KILOMETRAGEM,
          E.VEI_PLACA,
          E.ENT_DATABAIXA,
          E.ENT_LOTEENTREGA
        FROM entregas E
        LEFT JOIN prestadores P ON P.PRE_CODIGO = E.PRE_CODIGO
        LEFT JOIN vendas V ON V.VEN_NUMERO = E.VEN_NUMERO
        ${whereClause}
        ORDER BY E.ENT_DATA DESC, E.ENT_NUMERO DESC
      `;

      const startTime = Date.now();
      const result = await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
      const endTime = Date.now();

      this.logger.log(
        `Busca de entregas executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify(
          {
            storeId,
            page,
            pageSize,
            ...filters,
          },
        )}, Itens: ${Array.isArray(result) ? result.length : result ? 1 : 0}, Tempo SQL: ${endTime - startTime}ms`,
      );
      return result;
    } catch (error) {
      console.error(error);
      this.logger.error(
        `Erro ao buscar entregas. Tenant: ${credentialsId}`,
        error,
      );
      throw error;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async getById(credentialsId: string, id: number, storeId?: number) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      let whereClause = 'WHERE E.ENT_NUMERO = ?';
      const params: any[] = [id];

      if (storeId) {
        whereClause += ' AND V.LOJ_CODIGO = ?';
        params.push(storeId);
      }

      const query = `
        SELECT
          E.VEN_NUMERO,
          E.ENT_NUMERO,
          E.PRE_CODIGO,
          P.PRE_NOME,
          E.SIT_CODIGO,
          E.USU_CODIGO,
          E.ENT_DATA,
          E.ENT_HORA,
          E.ENT_KILOMETRAGEM,
          E.ENT_OBS,
          E.ENT_IMPRIMIR,
          E.AJU_CODIGO,
          E.VEI_PLACA,
          VEI.VEI_MODELO,
          E.ENT_DATABAIXA,
          E.TBS_CODIGO,
          E.AJA_CODIGO,
          E.ENT_LOTEENTREGA,
          E.SEP_CODIGO,
          E.ENT_LOTEPRODUTO,
          E.USU_CODIGOBXA,
          E.ENT_GERARROTAS,
          E.AJ2_CODIGO
        FROM entregas E
        LEFT JOIN prestadores P ON P.PRE_CODIGO = E.PRE_CODIGO
        LEFT JOIN veiculos VEI ON VEI.VEI_PLACA = E.VEI_PLACA
        LEFT JOIN vendas V ON V.VEN_NUMERO = E.VEN_NUMERO
        ${whereClause}
      `;

      const startTime = Date.now();
      const delivery = (await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res[0] || null);
        });
      })) as any;
      const endTime = Date.now();

      this.logger.log(
        `Busca de entrega por ID executada. Tenant: ${credentialsId}, ID: ${id}, Tempo SQL: ${endTime - startTime}ms`,
      );

      if (!delivery) {
        return null;
      }

      // Buscar os itens da entrega filtrando pelo VEN_NUMERO da entrega na tabela ENTREGASITENS
      const items = await this.getItemsByVendaNumero(
        connection,
        delivery.VEN_NUMERO,
      );

      return {
        ...delivery,
        items,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(
        `Erro ao buscar entrega por ID. Tenant: ${credentialsId}, ID: ${id}`,
        error,
      );
      throw error;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  private async getItemsByVendaNumero(connection: any, vendaNumero: number) {
    const query = `
      SELECT
        EI.ETI_NUMERO,
        EI.IVD_NUMERO,
        EI.VEN_NUMERO,
        EI.PRO_CODIGO,
        P.PRO_DESCRICAO,
        EI.USU_CODIGO,
        EI.ETI_DATA,
        EI.ETI_HORA,
        EI.ETI_QTDE,
        EI.ETI_IMPRIMIR,
        EI.ETI_QTDECLIENTE
      FROM entregasitens EI
      INNER JOIN produtos P ON P.PRO_CODIGO = EI.PRO_CODIGO
      WHERE EI.VEN_NUMERO = ?
      ORDER BY EI.ETI_NUMERO
    `;
    const params = [vendaNumero];

    return new Promise((resolve, reject) => {
      connection.query(query, params, (err: any, res: any) => {
        if (err) return reject(err);
        resolve(res);
      });
    });
  }
}
