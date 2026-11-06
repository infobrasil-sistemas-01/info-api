import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { PaginatedResponse } from 'src/common/pagination/paginated-response';
import { ProductionOrderQueryDto } from './dto/production-order-query.dto';
import { CreateProductionOrderDto } from './dto/create-production-order.dto';

@Injectable()
export class ProductionOrderService {
  private readonly logger = new Logger(ProductionOrderService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) { }

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
        `Busca de ordem de produção por ID executada. Tenant: ${credentialsId}, ID: ${id}, Tempo SQL: ${endTime - startTime
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
        `Busca de itens da ordem de produção executada. Tenant: ${credentialsId}, Ordem: ${orderNumber}, Itens: ${Array.isArray(result) ? result.length : 0
        }, Tempo SQL: ${endTime - startTime}ms`,
      );

      return Array.isArray(result) ? result : [];
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async create(
    credentialsId: string,
    storeId: number,
    operatorId: number,
    createDto: CreateProductionOrderDto,
  ) {
    const connection: any =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      // 1. Coleta todos os códigos de produtos envolvidos (produto final + insumos)
      const allProductCodes = [
        createDto.productCode,
        ...new Set(createDto.items.map((i) => i.productCode)),
      ];

      // 2. Busca em lote na tabela PRODUTOS para validação e obtenção de preços fiscais
      const placeholders = allProductCodes.map(() => '?').join(', ');
      const queryProducts = `SELECT 
                              P.PRO_CODIGO, 
                              CAST(COALESCE(P.PRO_PRCCOMPRAFISCAL, 0) AS NUMERIC(15,4)) AS PRO_PRCCOMPRAFISCAL
                            FROM PRODUTOS P
                            WHERE P.PRO_CODIGO IN (${placeholders})`;

      const productsResult: any = await new Promise((resolve, reject) => {
        connection.query(
          queryProducts,
          allProductCodes,
          (err: any, res: any) => {
            if (err) return reject(err);
            resolve(res);
          },
        );
      });

      const priceMap = new Map<string, number>();
      if (Array.isArray(productsResult)) {
        for (const row of productsResult) {
          const code = String(row.PRO_CODIGO).trim();
          priceMap.set(code, Number(row.PRO_PRCCOMPRAFISCAL ?? 0));
        }
      }

      // Validação do produto final produzido
      if (!priceMap.has(createDto.productCode.trim())) {
        throw new BadRequestException(
          `Produto final a produzir (${createDto.productCode}) não encontrado no catálogo`,
        );
      }

      // Validação dos insumos
      const missingItems = createDto.items
        .map((i) => i.productCode.trim())
        .filter((code) => !priceMap.has(code));

      if (missingItems.length > 0) {
        throw new BadRequestException(
          `Produto(s)/Insumo(s) não encontrado(s) no cadastro: ${missingItems.join(', ')}`,
        );
      }

      // 3. Pré-cálculo dos itens e somatória do total da ordem
      const calculatedItems = createDto.items.map((item) => {
        const itemPrice = priceMap.get(item.productCode.trim()) ?? 0;
        const itemTotal = Number((item.quantity * itemPrice).toFixed(2));
        return {
          productCode: item.productCode.trim(),
          quantity: item.quantity,
          price: itemPrice,
          total: itemTotal,
        };
      });

      const totalOrder = Number(
        calculatedItems
          .reduce((acc, curr) => acc + curr.total, 0)
          .toFixed(2),
      );

      // 4. Execução da transação atômica no Firebird
      const now = new Date();
      const dateVal = now.toISOString().split('T')[0];
      const timeVal = now.toTimeString().split(' ')[0];

      const orpNumero = await new Promise<number>((resolve, reject) => {
        const startTx =
          connection.startTransaction || connection.transaction;

        startTx.call(connection, (transErr: any, transaction: any) => {
          if (transErr) return reject(transErr);

          const queryHeader = `
            INSERT INTO ORDENSPRODUCAO (
              ORP_NUMERO,
              SIT_CODIGO,
              LOJ_CODIGO,
              USU_CODIGO,
              ORP_DATA,
              ORP_HORA,
              ORP_DATAINICIO,
              ORP_DATAFINAL,
              PRO_CODIGO,
              ORP_QUANTIDADE,
              ORP_QUANTIDADEACABADA,
              ORP_TOTAL,
              ORP_OBS
            ) VALUES (
              GEN_ID(GEN_NUMEROORP, 1),
              1,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              0,
              ?,
              ?
            ) RETURNING ORP_NUMERO
          `;

          const hardcodedObs = 'Ordem de Produção emitida via integração';

          const headerParams = [
            storeId,
            operatorId,
            dateVal,
            timeVal,
            createDto.startDate ?? null,
            createDto.endDate ?? null,
            createDto.productCode.trim(),
            createDto.quantity,
            totalOrder,
            hardcodedObs,
          ];

          transaction.query(
            queryHeader,
            headerParams,
            async (insertErr: any, insertRes: any) => {
              if (insertErr) {
                return transaction.rollback(() => reject(insertErr));
              }

              const generatedOrpNumero = Array.isArray(insertRes)
                ? insertRes[0]?.ORP_NUMERO
                : insertRes?.ORP_NUMERO;

              if (!generatedOrpNumero) {
                return transaction.rollback(() =>
                  reject(
                    new Error(
                      'Falha ao obter número da ordem de produção gerada',
                    ),
                  ),
                );
              }

              const queryItem = `
                INSERT INTO ORDENSPRODUCAOITENS (
                  OPI_NUMERO,
                  ORP_NUMERO,
                  PRO_CODIGO,
                  OPI_PRECO,
                  OPI_QTDE,
                  OPI_TOTAL
                ) VALUES (
                  GEN_ID(GEN_NUMEROOPI, 1),
                  ?,
                  ?,
                  ?,
                  ?,
                  ?
                )
              `;

              try {
                for (const item of calculatedItems) {
                  const itemParams = [
                    generatedOrpNumero,
                    item.productCode,
                    item.price,
                    item.quantity,
                    item.total,
                  ];

                  await new Promise((resolveItem, rejectItem) => {
                    transaction.query(
                      queryItem,
                      itemParams,
                      (itemErr: any) => {
                        if (itemErr) return rejectItem(itemErr);
                        resolveItem(true);
                      },
                    );
                  });
                }

                transaction.commit((commitErr: any) => {
                  if (commitErr) {
                    return transaction.rollback(() => reject(commitErr));
                  }
                  resolve(Number(generatedOrpNumero));
                });
              } catch (itemsError) {
                transaction.rollback(() => reject(itemsError));
              }
            },
          );
        });
      });

      this.logger.log(
        `Ordem de produção criada com sucesso. Tenant: ${credentialsId}, Ordem: ${orpNumero}, Insumos: ${calculatedItems.length}`,
      );

      // 5. Retorna o espelho completo da ordem criada
      const orderData = await this.getById(credentialsId, storeId, orpNumero);
      const items = await this.getItemsByProductionOrderNumber(
        credentialsId,
        orpNumero,
      );

      return {
        ...orderData,
        items,
      };
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}

