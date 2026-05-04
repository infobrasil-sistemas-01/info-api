import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { TenantConnectionService } from "src/infra/database/tenant-connection.service";

@Injectable()
export class AccountReceivableService {
  private readonly logger = new Logger(AccountReceivableService.name);

  constructor(
    private readonly tenantConnectionService: TenantConnectionService
  ) { }

  async get(
    credentialsId: string,
    page: number = 1,
    clientId?: number,
    arId?: number,
    situation?: string,
    startDate?: string,
    endDate?: string
  ) {
    let connection: any;
    const startTime = Date.now();
    connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const pageSize = 25;

      if (page < 1) {
        throw new BadRequestException('A página deve ser maior ou igual a 1');
      }

      if (page > 100) {
        throw new BadRequestException('A página deve ser menor ou igual a 100');
      }

      if (!clientId && !arId && !situation && !startDate && !endDate) {
        throw new BadRequestException('Pelo menos um filtro deve ser informado');
      }

      if (situation) {
        if (situation != 'A' && situation != 'L') {
          throw new BadRequestException('Situação inválida! Valores aceitos: A (Aberto) ou L (Liquidado)');
        }
      }

      if (startDate) {
        const date = new Date(startDate);
        if (isNaN(date.getTime())) {
          throw new BadRequestException('Data inicial inválida');
        }
      }

      if (endDate) {
        const date = new Date(endDate);
        if (isNaN(date.getTime())) {
          throw new BadRequestException('Data final inválida');
        }
      }

      if (startDate && !endDate) {
        throw new BadRequestException('Data final é obrigatória quando a data inicial é informada');
      }

      if (!startDate && endDate) {
        throw new BadRequestException('Data inicial é obrigatória quando a data final é informada');
      }

      let query = `select FIRST ? SKIP ?
      cli.cli_codigo,
      cli.cli_nome,
      cli.cli_fone,
      cli.cli_celular,
      cli.cli_conceito,
      rec.rec_numero,
      rec.rec_situacao,
      rec.rec_datavenc,
      CAST(rec.rec_valor AS NUMERIC(15,2)) AS rec_valor
      from
      contasreceber rec
      inner join clientes cli on cli.cli_codigo= rec.cli_codigo
      WHERE 1 = 1`;

      let params: any[] = [pageSize, (page - 1) * pageSize];

      if (situation) {
        query += ` AND rec.rec_situacao = ?`;
        params.push(situation);
      }

      if (clientId) {
        query += ` AND rec.cli_codigo = ?`;
        params.push(clientId);
      }

      if (arId) {
        query += ` AND rec.rec_numero = ?`;
        params.push(arId);
      }

      if (startDate && endDate) {
        query += ` AND rec.rec_datavenc BETWEEN ? AND ?`;
        params.push(startDate, endDate);
      }

      query += ` ORDER BY rec.rec_datavenc DESC`;

      const queryStartTime = Date.now();
      const result = (await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      })) as any[];

      const queryEndTime = Date.now();
      this.logger.log(`Busca de Contas a Receber executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify({ clientId, arId, situation, startDate, endDate })}, Itens: ${result.length}, Tempo SQL: ${queryEndTime - queryStartTime}ms`);

      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
}