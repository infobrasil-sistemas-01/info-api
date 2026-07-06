import { Injectable, Logger } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';

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

  async create(credentialsId: string, data: CreateDeliveryDto) {
    const connection: any =
      await this.tenantConnectionService.getConnection(credentialsId);

    const today = new Date();
    const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const defaultTime = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}:${String(today.getSeconds()).padStart(2, '0')}`;

    const dateVal = data.ENT_DATA || defaultDate;
    const timeVal = data.ENT_HORA || defaultTime;

    const transaction: any = await new Promise((resolve, reject) => {
      connection.startTransaction((err: any, tx: any) => {
        if (err) return reject(err);
        resolve(tx);
      });
    });

    try {
      const queryDelivery = `
        INSERT INTO entregas (
          ENT_NUMERO, VEN_NUMERO, PRE_CODIGO, SIT_CODIGO, USU_CODIGO,
          ENT_DATA, ENT_HORA, ENT_KILOMETRAGEM, VEI_PLACA, ENT_OBS,
          ENT_IMPRIMIR, AJU_CODIGO, TBS_CODIGO, AJA_CODIGO, ENT_LOTEENTREGA,
          SEP_CODIGO, ENT_LOTEPRODUTO, ENT_GERARROTAS, AJ2_CODIGO
        ) VALUES (
          GEN_ID(GEN_NUMEROENT, 1), ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?
        ) RETURNING ENT_NUMERO
      `;

      const paramsDelivery = [
        data.VEN_NUMERO,
        data.PRE_CODIGO ?? null,
        data.SIT_CODIGO ?? 1,
        data.USU_CODIGO ?? 9999,
        dateVal,
        timeVal,
        data.ENT_KILOMETRAGEM ?? null,
        data.VEI_PLACA ?? null,
        data.ENT_OBS ?? null,
        data.ENT_IMPRIMIR ?? 'S',
        data.AJU_CODIGO ?? null,
        data.TBS_CODIGO ?? null,
        data.AJA_CODIGO ?? null,
        data.ENT_LOTEENTREGA ?? null,
        data.SEP_CODIGO ?? null,
        data.ENT_LOTEPRODUTO ?? null,
        data.ENT_GERARROTAS ?? 'N',
        data.AJ2_CODIGO ?? null,
      ];

      const startTime = Date.now();
      const insertResult = (await new Promise((resolve, reject) => {
        transaction.query(
          queryDelivery,
          paramsDelivery,
          (err: any, res: any) => {
            if (err) return reject(err);
            resolve(res);
          },
        );
      })) as any;

      const entNumero = insertResult?.ENT_NUMERO;
      if (!entNumero) {
        throw new Error('Falha ao obter número da entrega gerado');
      }

      if (data.items && data.items.length > 0) {
        const queryItem = `
          INSERT INTO entregasitens (
            ETI_NUMERO, IVD_NUMERO, VEN_NUMERO, PRO_CODIGO, USU_CODIGO,
            ETI_DATA, ETI_HORA, ETI_QTDE, ETI_IMPRIMIR, ETI_QTDECLIENTE
          ) VALUES (
            GEN_ID(GEN_NUMEROETI, 1), ?, ?, ?, ?,
            ?, ?, ?, ?, ?
          )
        `;

        for (const item of data.items) {
          const itemParams = [
            item.IVD_NUMERO,
            data.VEN_NUMERO,
            item.PRO_CODIGO,
            item.USU_CODIGO ?? 9999,
            dateVal,
            timeVal,
            item.ETI_QTDE,
            item.ETI_IMPRIMIR ?? 'S',
            item.ETI_QTDECLIENTE ?? item.ETI_QTDE,
          ];

          await new Promise((resolve, reject) => {
            transaction.query(queryItem, itemParams, (err: any) => {
              if (err) return reject(err);
              resolve(true);
            });
          });
        }
      }

      await new Promise((resolve, reject) => {
        transaction.commit((err: any) => {
          if (err) {
            transaction.rollback();
            return reject(err);
          }
          resolve(true);
        });
      });

      const endTime = Date.now();
      this.logger.log(
        `Entrega inserida com sucesso. Tenant: ${credentialsId}, ENT_NUMERO: ${entNumero}, Tempo SQL: ${endTime - startTime}ms`,
      );

      return this.getById(credentialsId, entNumero);
    } catch (error) {
      transaction.rollback();
      this.logger.error(
        `Erro ao inserir entrega. Tenant: ${credentialsId}`,
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
