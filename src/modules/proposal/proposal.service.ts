import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';
import { PaginatedResponse } from 'src/common/pagination/paginated-response';
import { ProposalQueryDto } from './dto/proposal-query.dto';
import {
  CreateProposalDto,
  CreateProposalItemDto,
} from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';

const PROPOSAL_SELECT_COLUMNS = `
  P.PRO_NUMERO,
  P.FUN_CODIGO,
  F.FUN_NOME,
  P.SIT_CODIGO,
  S.SIT_DESCRICAO,
  P.LOJ_CODIGO,
  L.LOJ_NOME,
  L.LOJ_FANTASIA,
  P.CLI_CODIGO,
  C.CLI_NOME,
  P.USU_CODIGO,
  U.USU_APELIDO,
  P.FPG_CODIGO,
  P.PRO_ATENCIOSAMENTE,
  P.PRO_PRAZO,
  P.PRO_VALIDADE,
  P.PRO_DATA,
  P.PRO_HORA,
  P.PRO_DATABAIXA,
  CAST(P.PRO_TOTALBRUTO AS NUMERIC(15,2)) AS PRO_TOTALBRUTO,
  CAST(P.PRO_TOTALDESC AS NUMERIC(15,2)) AS PRO_TOTALDESC,
  CAST(P.PRO_PERCDESC AS NUMERIC(15,2)) AS PRO_PERCDESC,
  CAST(P.PRO_TOTALLIQUIDO AS NUMERIC(15,2)) AS PRO_TOTALLIQUIDO,
  P.PRO_OBS,
  CAST(P.PRO_QUANT AS NUMERIC(15,2)) AS PRO_QUANT,
  P.PRO_CONDICAOPAG,
  P.PRO_GERADA,
  P.PRO_FANTCLI,
  P.VEN_NUMERO,
  P.PRE_CODIGO,
  P.PRO_PRECO,
  P.PRO_PEDCLIENTE,
  P.TRA_CODIGO,
  P.PRO_MOTIVO,
  P.PRO_STATUS,
  CAST(P.PRO_TOTALPP1 AS NUMERIC(15,2)) AS PRO_TOTALPP1,
  CAST(P.PRO_TOTALPP2 AS NUMERIC(15,2)) AS PRO_TOTALPP2,
  CAST(P.PRO_TOTALPP3 AS NUMERIC(15,2)) AS PRO_TOTALPP3,
  P.PP1_CODIGO,
  P.PP2_CODIGO,
  P.PP3_CODIGO,
  P.FP1_CODIGO,
  P.FP2_CODIGO,
  P.FP3_CODIGO,
  P.PRO_NUMORG,
  P.PRO_DATABASE1,
  P.PRO_DATABASE2,
  P.PRO_DATABASE3,
  P.PRO_HORABAIXA,
  CAST(P.PRO_PERCDESC1 AS NUMERIC(15,2)) AS PRO_PERCDESC1,
  CAST(P.PRO_PERCDESC2 AS NUMERIC(15,2)) AS PRO_PERCDESC2,
  CAST(P.PRO_PERCDESC3 AS NUMERIC(15,2)) AS PRO_PERCDESC3,
  CAST(P.PRO_TOTALDESC1 AS NUMERIC(15,2)) AS PRO_TOTALDESC1,
  CAST(P.PRO_TOTALDESC2 AS NUMERIC(15,2)) AS PRO_TOTALDESC2,
  CAST(P.PRO_TOTALDESC3 AS NUMERIC(15,2)) AS PRO_TOTALDESC3,
  CAST(P.PRO_TOTALPPA1 AS NUMERIC(15,2)) AS PRO_TOTALPPA1,
  CAST(P.PRO_TOTALPPA2 AS NUMERIC(15,2)) AS PRO_TOTALPPA2,
  CAST(P.PRO_TOTALPPA3 AS NUMERIC(15,2)) AS PRO_TOTALPPA3,
  P.PRO_INFADICIONAIS,
  CAST(P.PRO_PERCACRESC AS NUMERIC(15,2)) AS PRO_PERCACRESC,
  CAST(P.PRO_TOTALACRESC AS NUMERIC(15,2)) AS PRO_TOTALACRESC,
  P.TCN_CODIGO
`;

const PROPOSAL_JOINS = `
  FROM PROPOSTAS P
  LEFT JOIN FUNCIONARIOS F ON F.FUN_CODIGO = P.FUN_CODIGO
  LEFT JOIN SITUACAO S ON S.SIT_CODIGO = P.SIT_CODIGO
  LEFT JOIN LOJAS L ON L.LOJ_CODIGO = P.LOJ_CODIGO
  LEFT JOIN CLIENTES C ON C.CLI_CODIGO = P.CLI_CODIGO
  LEFT JOIN USUARIOS U ON U.USU_CODIGO = P.USU_CODIGO
`;

const PROPOSAL_ITEM_SELECT_COLUMNS = `
  IP.IPR_NUMERO,
  IP.PRO_NUMERO,
  IP.PRO_CODIGO,
  PROD.PRO_DESCRICAO,
  PROD.PRO_UNIDADE,
  PROD.PRO_CODIGOBAR,
  CAST(IP.IPR_QTDE AS NUMERIC(15,4)) AS IPR_QTDE,
  CAST(IP.IPR_PRECO AS NUMERIC(15,4)) AS IPR_PRECO,
  CAST(IP.IPR_TOTAL AS NUMERIC(15,2)) AS IPR_TOTAL,
  CAST(IP.IPR_DESCONTO AS NUMERIC(15,2)) AS IPR_DESCONTO,
  CAST(IP.IPR_LIQUIDO AS NUMERIC(15,2)) AS IPR_LIQUIDO,
  CAST(IP.IPR_PERCDESCONTO AS NUMERIC(15,2)) AS IPR_PERCDESCONTO,
  IP.PES_CODIGO,
  IP.TEC_CODIGO,
  CAST(IP.IPR_QTDEENT AS NUMERIC(15,4)) AS IPR_QTDEENT,
  IP.IPR_INFADICIONAIS,
  IP.LOJ_CODIGO,
  IP.IPR_NEGATIVO,
  IP.AMB_CODIGO,
  CAST(IP.IPR_PRCVENDADIA AS NUMERIC(15,2)) AS IPR_PRCVENDADIA,
  IP.TAM_CODIGO,
  IP.COR_CODIGO,
  IP.PRG_CODIGO,
  CAST(IP.IPR_ALTURA AS NUMERIC(15,2)) AS IPR_ALTURA,
  CAST(IP.IPR_LARGURA AS NUMERIC(15,2)) AS IPR_LARGURA,
  CAST(IP.IPR_QTDEUNT AS NUMERIC(15,2)) AS IPR_QTDEUNT,
  IP.PRK_CODIGO,
  IP.IPR_TABELAPRECO,
  CAST(IP.IPR_METRAGEMSUGERIDA AS NUMERIC(15,4)) AS IPR_METRAGEMSUGERIDA,
  CAST(IP.IPR_QTDEMETRAGEMSUGERIDA AS NUMERIC(15,4)) AS IPR_QTDEMETRAGEMSUGERIDA,
  IP.TRM_CODIGO,
  IP.IPR_ITEM,
  IP.IPR_GARANTEESTOQUE,
  CAST(IP.IPR_PRCCUSTO AS NUMERIC(15,4)) AS IPR_PRCCUSTO,
  CAST(IP.IPR_PRCCOMPRA AS NUMERIC(15,4)) AS IPR_PRCCOMPRA,
  CAST(IP.IPR_MARGEMLUCROCOMPRA AS NUMERIC(15,4)) AS IPR_MARGEMLUCROCOMPRA,
  CAST(IP.IPR_MARGEMLUCROCUSTO AS NUMERIC(15,4)) AS IPR_MARGEMLUCROCUSTO,
  CAST(IP.IPR_ACRESCIMO AS NUMERIC(15,2)) AS IPR_ACRESCIMO,
  CAST(IP.IPR_PERCACRESC AS NUMERIC(15,2)) AS IPR_PERCACRESC
`;

const WRITABLE_PROPOSAL_COLUMNS = [
  'FUN_CODIGO',
  'SIT_CODIGO',
  'LOJ_CODIGO',
  'CLI_CODIGO',
  'USU_CODIGO',
  'FPG_CODIGO',
  'PRO_ATENCIOSAMENTE',
  'PRO_PRAZO',
  'PRO_VALIDADE',
  'PRO_DATA',
  'PRO_HORA',
  'PRO_DATABAIXA',
  'PRO_TOTALBRUTO',
  'PRO_TOTALDESC',
  'PRO_PERCDESC',
  'PRO_TOTALLIQUIDO',
  'PRO_OBS',
  'PRO_QUANT',
  'PRO_CONDICAOPAG',
  'PRO_FANTCLI',
  'PRE_CODIGO',
  'PRO_PRECO',
  'PRO_PEDCLIENTE',
  'TRA_CODIGO',
  'PRO_MOTIVO',
  'PRO_STATUS',
  'PRO_TOTALPP1',
  'PRO_TOTALPP2',
  'PRO_TOTALPP3',
  'PP1_CODIGO',
  'PP2_CODIGO',
  'PP3_CODIGO',
  'FP1_CODIGO',
  'FP2_CODIGO',
  'FP3_CODIGO',
  'PRO_NUMORG',
  'PRO_DATABASE1',
  'PRO_DATABASE2',
  'PRO_DATABASE3',
  'PRO_HORABAIXA',
  'PRO_PERCDESC1',
  'PRO_PERCDESC2',
  'PRO_PERCDESC3',
  'PRO_TOTALDESC1',
  'PRO_TOTALDESC2',
  'PRO_TOTALDESC3',
  'PRO_TOTALPPA1',
  'PRO_TOTALPPA2',
  'PRO_TOTALPPA3',
  'PRO_INFADICIONAIS',
  'PRO_PERCACRESC',
  'PRO_TOTALACRESC',
  'TCN_CODIGO',
] as const;

@Injectable()
export class ProposalService {
  private readonly logger = new Logger(ProposalService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  private queryDb<T = any>(
    executor: any,
    sql: string,
    params: any[] = [],
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      executor.query(sql, params, (err: any, res: any) => {
        if (err) return reject(err);
        resolve(res);
      });
    });
  }

  private async parseBlob(blobField: any): Promise<string | null> {
    if (!blobField) return null;
    if (typeof blobField === 'string') return blobField;
    if (Buffer.isBuffer(blobField)) return blobField.toString('utf-8');
    if (typeof blobField === 'function') {
      try {
        return await new Promise((resolve) => {
          blobField((err: any, _name: any, eventEmitter: any) => {
            if (err || !eventEmitter) return resolve(null);
            const chunks: Buffer[] = [];
            eventEmitter.on('data', (chunk: any) => {
              chunks.push(
                Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)),
              );
            });
            eventEmitter.on('end', () =>
              resolve(Buffer.concat(chunks).toString('utf-8')),
            );
            eventEmitter.on('error', () => resolve(null));
          });
        });
      } catch {
        return null;
      }
    }
    return String(blobField);
  }

  private async mapProposalRow(row: any) {
    const [proObs, proInfAdicionais] = await Promise.all([
      this.parseBlob(row.PRO_OBS),
      this.parseBlob(row.PRO_INFADICIONAIS),
    ]);

    return {
      ...row,
      PRO_OBS: proObs,
      PRO_INFADICIONAIS: proInfAdicionais,
    };
  }

  private getCurrentBrazilDateTime() {
    const now = new Date();
    const dateVal = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);
    const timeVal = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(now);
    return { dateVal, timeVal };
  }

  /**
   * Valida produtos em PRODUTOS, busca preços em ESTOQUE quando IPR_PRECO é omitido
   * e calcula totais dos itens caso não informados explicitamente.
   */
  private async prepareProposalItems(
    connection: any,
    storeId: number,
    defaultPriceTable: string,
    items: CreateProposalItemDto[],
  ) {
    const uniqueCodes = Array.from(
      new Set(items.map((item) => item.PRO_CODIGO.trim())),
    );
    const placeholders = uniqueCodes.map(() => '?').join(', ');

    const stockQuery = `
      SELECT
        P.PRO_CODIGO,
        P.PRO_PRCCOMPRA,
        P.PRO_PRCCUSTO,
        E.PRO_PRECO1, E.PRO_PRECO2, E.PRO_PRECO3, E.PRO_PRECO4,
        E.PRO_PRECO5, E.PRO_PRECO6, E.PRO_PRECO7, E.PRO_PRECO8,
        E.PRO_PRECO9, E.PRO_PRECO10, E.PRO_PRECO11, E.PRO_PRECO12
      FROM PRODUTOS P
      LEFT JOIN ESTOQUE E ON E.PRO_CODIGO = P.PRO_CODIGO AND E.LOJ_CODIGO = ?
      WHERE P.PRO_CODIGO IN (${placeholders})
    `;

    const rows = await this.queryDb<any[]>(connection, stockQuery, [
      storeId,
      ...uniqueCodes,
    ]);

    const productMap = new Map<string, any>();
    for (const row of Array.isArray(rows) ? rows : []) {
      const code = String(row.PRO_CODIGO).trim();
      productMap.set(code, row);
    }

    const missingCodes = uniqueCodes.filter((code) => !productMap.has(code));
    if (missingCodes.length > 0) {
      throw new BadRequestException(
        `Produto(s) não encontrado(s) no cadastro: ${missingCodes.join(', ')}`,
      );
    }

    return items.map((item, index) => {
      const code = item.PRO_CODIGO.trim();
      const stockRow = productMap.get(code);
      const tableStr = String(item.IPR_TABELAPRECO ?? defaultPriceTable ?? '1');
      const tableNum = Math.min(Math.max(parseInt(tableStr, 10) || 1, 1), 12);

      const stockPrice =
        Number(stockRow?.[`PRO_PRECO${tableNum}`] ?? stockRow?.PRO_PRECO1) || 0;
      const unitPrice =
        item.IPR_PRECO !== undefined ? Number(item.IPR_PRECO) : stockPrice;
      const quantity = Number(item.IPR_QTDE);
      const total =
        item.IPR_TOTAL !== undefined
          ? Number(item.IPR_TOTAL)
          : Number((quantity * unitPrice).toFixed(2));
      const discount = Number(item.IPR_DESCONTO ?? 0);
      const addition = Number(item.IPR_ACRESCIMO ?? 0);
      const netTotal =
        item.IPR_LIQUIDO !== undefined && item.IPR_LIQUIDO !== null
          ? Number(item.IPR_LIQUIDO)
          : Number(Math.max(total - discount + addition, 0).toFixed(2));

      const costPrice =
        item.IPR_PRCCUSTO ??
        (stockRow?.PRO_PRCCUSTO != null ? Number(stockRow.PRO_PRCCUSTO) : null);
      const purchasePrice =
        item.IPR_PRCCOMPRA ??
        (stockRow?.PRO_PRCCOMPRA != null
          ? Number(stockRow.PRO_PRCCOMPRA)
          : null);
      const effectiveUnitSalePrice =
        quantity > 0 ? netTotal / quantity : unitPrice;
      const calcMargin = (base: number | null) =>
        effectiveUnitSalePrice > 0 && base !== null
          ? Number(
              (
                ((effectiveUnitSalePrice - base) / effectiveUnitSalePrice) *
                100
              ).toFixed(4),
            )
          : null;

      return {
        ...item,
        PRO_CODIGO: code,
        LOJ_CODIGO: item.LOJ_CODIGO ?? storeId,
        IPR_QTDE: quantity,
        IPR_PRECO: unitPrice,
        IPR_TOTAL: total,
        IPR_DESCONTO: item.IPR_DESCONTO ?? 0,
        IPR_LIQUIDO: netTotal,
        IPR_PRCVENDADIA:
          item.IPR_PRCVENDADIA ??
          (stockPrice > 0 ? Number(stockPrice.toFixed(2)) : null),
        IPR_PRCCUSTO: costPrice,
        IPR_PRCCOMPRA: purchasePrice,
        IPR_MARGEMLUCROCOMPRA:
          item.IPR_MARGEMLUCROCOMPRA ?? calcMargin(purchasePrice),
        IPR_MARGEMLUCROCUSTO:
          item.IPR_MARGEMLUCROCUSTO ?? calcMargin(costPrice),
        IPR_TABELAPRECO: tableStr,
        IPR_ITEM: item.IPR_ITEM ?? index + 1,
        IPR_GARANTEESTOQUE: item.IPR_GARANTEESTOQUE ?? 'N',
      };
    });
  }

  private async insertProposalItems(
    transaction: any,
    proNumero: number,
    preparedItems: any[],
  ) {
    const queryItem = `
      INSERT INTO ITENSPRO (
        IPR_NUMERO, PRO_NUMERO, PRO_CODIGO, IPR_QTDE, IPR_PRECO, IPR_TOTAL,
        IPR_DESCONTO, IPR_LIQUIDO, IPR_PERCDESCONTO, PES_CODIGO, TEC_CODIGO,
        IPR_QTDEENT, IPR_INFADICIONAIS, LOJ_CODIGO, IPR_NEGATIVO, AMB_CODIGO,
        IPR_PRCVENDADIA, TAM_CODIGO, COR_CODIGO, PRG_CODIGO, IPR_ALTURA,
        IPR_LARGURA, IPR_QTDEUNT, PRK_CODIGO, IPR_TABELAPRECO,
        IPR_METRAGEMSUGERIDA, IPR_QTDEMETRAGEMSUGERIDA, TRM_CODIGO, IPR_ITEM,
        IPR_GARANTEESTOQUE, IPR_PRCCUSTO, IPR_PRCCOMPRA,
        IPR_MARGEMLUCROCOMPRA, IPR_MARGEMLUCROCUSTO, IPR_ACRESCIMO, IPR_PERCACRESC
      ) VALUES (
        GEN_ID(GEN_NUMEROIPR, 1), ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?
      )
    `;

    for (const item of preparedItems) {
      const params = [
        proNumero,
        item.PRO_CODIGO,
        item.IPR_QTDE,
        item.IPR_PRECO,
        item.IPR_TOTAL,
        item.IPR_DESCONTO ?? null,
        item.IPR_LIQUIDO ?? null,
        item.IPR_PERCDESCONTO ?? null,
        item.PES_CODIGO ?? null,
        item.TEC_CODIGO ?? null,
        item.IPR_QTDEENT ?? null,
        item.IPR_INFADICIONAIS ?? null,
        item.LOJ_CODIGO ?? null,
        item.IPR_NEGATIVO ?? null,
        item.AMB_CODIGO ?? null,
        item.IPR_PRCVENDADIA ?? null,
        item.TAM_CODIGO ?? null,
        item.COR_CODIGO ?? null,
        item.PRG_CODIGO ?? null,
        item.IPR_ALTURA ?? null,
        item.IPR_LARGURA ?? null,
        item.IPR_QTDEUNT ?? null,
        item.PRK_CODIGO ?? null,
        item.IPR_TABELAPRECO ?? '1',
        item.IPR_METRAGEMSUGERIDA ?? null,
        item.IPR_QTDEMETRAGEMSUGERIDA ?? null,
        item.TRM_CODIGO ?? null,
        item.IPR_ITEM ?? null,
        item.IPR_GARANTEESTOQUE ?? 'N',
        item.IPR_PRCCUSTO ?? null,
        item.IPR_PRCCOMPRA ?? null,
        item.IPR_MARGEMLUCROCOMPRA ?? null,
        item.IPR_MARGEMLUCROCUSTO ?? null,
        item.IPR_ACRESCIMO ?? null,
        item.IPR_PERCACRESC ?? null,
      ];

      await this.queryDb(transaction, queryItem, params);
    }
  }

  private async fetchItemsByProposalNumber(
    connection: any,
    proposalNumber: number,
  ) {
    const query = `
      SELECT ${PROPOSAL_ITEM_SELECT_COLUMNS}
      FROM ITENSPRO IP
      LEFT JOIN PRODUTOS PROD ON PROD.PRO_CODIGO = IP.PRO_CODIGO
      WHERE IP.PRO_NUMERO = ?
      ORDER BY IP.IPR_ITEM ASC, IP.IPR_NUMERO ASC
    `;

    const result = await this.queryDb<any[]>(connection, query, [proposalNumber]);
    return Array.isArray(result) ? result : [];
  }

  async get(
    credentialsId: string,
    storeId?: number,
    queryDto: ProposalQueryDto = {},
    includeCount: boolean = false,
  ) {
    const {
      page = 1,
      pageSize = 10,
      statusId,
      clientId,
      sellerId,
      proposalNumber,
      proGerada,
      proStatus,
      startDate,
      endDate,
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
      if (finalStoreId !== undefined) {
        filterConditions.push('P.LOJ_CODIGO = ?');
        filterParams.push(finalStoreId);
      }

      if (statusId !== undefined) {
        filterConditions.push('P.SIT_CODIGO = ?');
        filterParams.push(statusId);
      }

      if (clientId !== undefined) {
        filterConditions.push('P.CLI_CODIGO = ?');
        filterParams.push(clientId);
      }

      if (sellerId !== undefined) {
        filterConditions.push('P.FUN_CODIGO = ?');
        filterParams.push(sellerId);
      }

      if (proposalNumber !== undefined) {
        filterConditions.push('P.PRO_NUMERO = ?');
        filterParams.push(proposalNumber);
      }

      if (proGerada !== undefined) {
        filterConditions.push('P.PRO_GERADA = ?');
        filterParams.push(proGerada);
      }

      if (proStatus !== undefined) {
        filterConditions.push('P.PRO_STATUS = ?');
        filterParams.push(proStatus);
      }

      if (startDate && endDate) {
        filterConditions.push('P.PRO_DATA BETWEEN ? AND ?');
        filterParams.push(startDate, endDate);
      } else if (startDate) {
        filterConditions.push('P.PRO_DATA >= ?');
        filterParams.push(startDate);
      } else if (endDate) {
        filterConditions.push('P.PRO_DATA <= ?');
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
                      ${PROPOSAL_SELECT_COLUMNS}
                    ${PROPOSAL_JOINS}
                    ${whereClause}
                    ORDER BY P.PRO_DATA DESC, P.PRO_NUMERO DESC`;

      const startTime = Date.now();
      const rawResult = await this.queryDb<any[]>(connection, query, queryParams);
      const result = Array.isArray(rawResult)
        ? await Promise.all(rawResult.map((row) => this.mapProposalRow(row)))
        : [];
      const endTime = Date.now();

      let total: number | undefined;

      if (includeCount) {
        const countQuery = `SELECT COUNT(*) AS TOTAL
                            ${PROPOSAL_JOINS}
                            ${whereClause}`;
        const countRes = await this.queryDb<any[]>(
          connection,
          countQuery,
          filterParams,
        );

        const rawTotal =
          countRes?.[0]?.TOTAL ??
          countRes?.[0]?.total ??
          countRes?.[0]?.COUNT ??
          0;
        total = Number(rawTotal);
      }

      this.logger.log(
        `Busca de propostas executada. Tenant: ${credentialsId}, Itens: ${Array.isArray(result) ? result.length : 0}, Tempo SQL: ${endTime - startTime}ms`,
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
    if (!id || Number.isNaN(Number(id)) || Number(id) <= 0) {
      throw new BadRequestException('Número da proposta inválido.');
    }

    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const conditions = ['P.PRO_NUMERO = ?'];
      const params: (number | string)[] = [id];

      if (storeId !== undefined) {
        conditions.push('P.LOJ_CODIGO = ?');
        params.push(storeId);
      }

      const query = `SELECT FIRST 1
                      ${PROPOSAL_SELECT_COLUMNS}
                    ${PROPOSAL_JOINS}
                    WHERE ${conditions.join(' AND ')}`;

      const result = await this.queryDb<any[]>(connection, query, params);

      if (!Array.isArray(result) || result.length === 0) {
        throw new NotFoundException(`Proposta ${id} não encontrada.`);
      }

      const [header, itens] = await Promise.all([
        this.mapProposalRow(result[0]),
        this.fetchItemsByProposalNumber(connection, id),
      ]);

      return {
        ...header,
        ITENS: itens,
      };
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async getItemsByProposalNumber(
    credentialsId: string,
    proposalNumber: number,
    storeId?: number,
  ) {
    if (
      !proposalNumber ||
      Number.isNaN(Number(proposalNumber)) ||
      Number(proposalNumber) <= 0
    ) {
      throw new BadRequestException('Número da proposta inválido.');
    }

    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const conditions = ['PRO_NUMERO = ?'];
      const params: (number | string)[] = [proposalNumber];
      if (storeId !== undefined) {
        conditions.push('LOJ_CODIGO = ?');
        params.push(storeId);
      }

      const exists = await this.queryDb<any[]>(
        connection,
        `SELECT FIRST 1 PRO_NUMERO FROM PROPOSTAS WHERE ${conditions.join(' AND ')}`,
        params,
      );

      if (!Array.isArray(exists) || exists.length === 0) {
        throw new NotFoundException(
          `Proposta ${proposalNumber} não encontrada.`,
        );
      }

      return this.fetchItemsByProposalNumber(connection, proposalNumber);
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async create(
    credentialsId: string,
    storeId: number,
    operatorId: number,
    createDto: CreateProposalDto,
  ) {
    if (Number(createDto.SIT_CODIGO) !== 1) {
      throw new BadRequestException(
        'Novas propostas devem ser criadas com SIT_CODIGO = 1, pois a trigger de ITENSPRO exige SIT_CODIGO = 1 para calcular os totais.',
      );
    }

    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const defaultPriceTable = String(createDto.PRO_PRECO ?? '1');
      const preparedItems = await this.prepareProposalItems(
        connection,
        storeId,
        defaultPriceTable,
        createDto.ITENS,
      );

      const { dateVal, timeVal } = this.getCurrentBrazilDateTime();

      // Totais são inicializados com 0 (não NULL e não pré-somados) para que a trigger
      // AFTER INSERT de ITENSPRO no Firebird acumule os valores exatamente 1x sem duplicar.
      const headerData: Record<string, any> = {
        ...createDto,
        LOJ_CODIGO: storeId,
        USU_CODIGO: createDto.USU_CODIGO ?? operatorId,
        PRO_DATA: createDto.PRO_DATA ?? dateVal,
        PRO_HORA: createDto.PRO_HORA ?? timeVal,
        PRO_TOTALBRUTO: 0,
        PRO_TOTALDESC: 0,
        PRO_PERCDESC: 0,
        PRO_TOTALLIQUIDO: 0,
        PRO_QUANT: 0,
        PRO_PRECO: defaultPriceTable,
        PRO_STATUS: String(createDto.PRO_STATUS ?? '2'),
      };

      const columns = WRITABLE_PROPOSAL_COLUMNS.filter(
        (col) => headerData[col] !== undefined,
      );
      const values = columns.map((col) => headerData[col]);
      const placeholders = columns.map(() => '?').join(', ');

      const proNumero = await new Promise<number>((resolve, reject) => {
        const startTx =
          (connection as any).startTransaction ||
          (connection as any).transaction;
        startTx.call(connection, async (transErr: any, transaction: any) => {
          if (transErr) return reject(transErr);

          try {
            const insertHeaderSql = `
              INSERT INTO PROPOSTAS (
                PRO_NUMERO,
                PRO_GERADA,
                ${columns.join(', ')}
              ) VALUES (
                GEN_ID(GEN_NUMEROPRO, 1),
                'N',
                ${placeholders}
              ) RETURNING PRO_NUMERO
            `;

            const insertRes = await this.queryDb<any>(
              transaction,
              insertHeaderSql,
              values,
            );
            const generatedProNumero = Array.isArray(insertRes)
              ? insertRes[0]?.PRO_NUMERO
              : insertRes?.PRO_NUMERO;

            if (!generatedProNumero) {
              throw new Error('Falha ao obter PRO_NUMERO da proposta gerada');
            }

            await this.insertProposalItems(
              transaction,
              Number(generatedProNumero),
              preparedItems,
            );

            transaction.commit((commitErr: any) => {
              if (commitErr) {
                return transaction.rollback(() => reject(commitErr));
              }
              resolve(Number(generatedProNumero));
            });
          } catch (txErr) {
            transaction.rollback(() => reject(txErr));
          }
        });
      });

      this.logger.log(
        `Proposta criada com sucesso. Tenant: ${credentialsId}, PRO_NUMERO: ${proNumero}, Itens: ${preparedItems.length}`,
      );

      return this.getById(credentialsId, storeId, proNumero);
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async update(
    credentialsId: string,
    storeId: number | undefined,
    id: number,
    updateDto: UpdateProposalDto,
  ) {
    const existing = await this.getById(credentialsId, storeId, id);

    if (String(existing.PRO_GERADA || '').trim().toUpperCase() === 'S') {
      throw new BadRequestException(
        'Não é possível alterar uma proposta que já foi convertida em venda (PRO_GERADA = S).',
      );
    }

    const effectiveStoreId =
      storeId ?? updateDto.LOJ_CODIGO ?? Number(existing.LOJ_CODIGO);

    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      let preparedItems: any[] | null = null;
      const updateHeaderData: Record<string, any> = { ...updateDto };

      // Nunca permite alterar LOJ_CODIGO para outra loja quando restrito ao tenant/loja do token
      if (storeId !== undefined) {
        delete updateHeaderData.LOJ_CODIGO;
      }

      if (updateDto.ITENS && updateDto.ITENS.length > 0) {
        if (Number(existing.SIT_CODIGO) !== 1) {
          throw new BadRequestException(
            'Não é possível alterar os itens de uma proposta com SIT_CODIGO diferente de 1.',
          );
        }
        if (
          updateDto.SIT_CODIGO !== undefined &&
          Number(updateDto.SIT_CODIGO) !== 1
        ) {
          throw new BadRequestException(
            'Não é possível alterar os itens e modificar SIT_CODIGO para diferente de 1 na mesma requisição.',
          );
        }

        const defaultPriceTable = String(
          updateDto.PRO_PRECO ?? existing.PRO_PRECO ?? '1',
        );
        preparedItems = await this.prepareProposalItems(
          connection,
          effectiveStoreId,
          defaultPriceTable,
          updateDto.ITENS,
        );

        // Quando ITENS são substituídos, a trigger AFTER DELETE/INSERT de ITENSPRO
        // recalcula os totalizadores automaticamente; não sobrescrever na capa.
        delete updateHeaderData.PRO_QUANT;
        delete updateHeaderData.PRO_TOTALBRUTO;
        delete updateHeaderData.PRO_TOTALDESC;
        delete updateHeaderData.PRO_PERCDESC;
        delete updateHeaderData.PRO_TOTALLIQUIDO;
      }

      const fieldsToUpdate: string[] = [];
      const updateParams: any[] = [];

      for (const col of WRITABLE_PROPOSAL_COLUMNS) {
        if (updateHeaderData[col] !== undefined) {
          fieldsToUpdate.push(`${col} = ?`);
          updateParams.push(updateHeaderData[col]);
        }
      }

      if (fieldsToUpdate.length === 0 && !preparedItems) {
        return existing;
      }

      await new Promise<void>((resolve, reject) => {
        const startTx =
          (connection as any).startTransaction ||
          (connection as any).transaction;
        startTx.call(connection, async (transErr: any, transaction: any) => {
          if (transErr) return reject(transErr);

          try {
            if (fieldsToUpdate.length > 0) {
              const whereConditions = ['PRO_NUMERO = ?'];
              const params = [...updateParams, id];
              if (storeId !== undefined) {
                whereConditions.push('LOJ_CODIGO = ?');
                params.push(storeId);
              }

              await this.queryDb(
                transaction,
                `UPDATE PROPOSTAS SET ${fieldsToUpdate.join(', ')} WHERE ${whereConditions.join(' AND ')}`,
                params,
              );
            }

            if (preparedItems) {
              await this.queryDb(
                transaction,
                'DELETE FROM ITENSPRO WHERE PRO_NUMERO = ?',
                [id],
              );
              await this.insertProposalItems(transaction, id, preparedItems);
            }

            transaction.commit((commitErr: any) => {
              if (commitErr) {
                return transaction.rollback(() => reject(commitErr));
              }
              resolve();
            });
          } catch (txErr) {
            transaction.rollback(() => reject(txErr));
          }
        });
      });

      this.logger.log(
        `Proposta ${id} atualizada com sucesso. Tenant: ${credentialsId}`,
      );

      return this.getById(credentialsId, storeId, id);
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}
