import { Controller, Get, Res, UseGuards, Req, Header } from '@nestjs/common';
import type { Response } from 'express';
import { StatusService } from './status.service';
import * as fs from 'fs';
import * as path from 'path';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { HealthService } from '../health/health.service';
import {
  JwtAuthGuard,
  type ReqWithAuthContext,
} from '../auth/guards/jwt-auth.guard';
import {
  StatusDataResponseDto,
  MyConnectionStatusResponseDto,
} from './dto/status-response.dto';

@ApiTags('Status')
@Controller('status')
export class StatusController {
  constructor(
    private readonly statusService: StatusService,
    private readonly healthService: HealthService,
  ) {}

  @Get('data')
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Obter dados de status e histórico (Público)' })
  @ApiResponse({
    status: 200,
    description:
      'Estatísticas de status da API e banco de dados retornadas com sucesso.',
    type: StatusDataResponseDto,
  })
  async getData() {
    const latest = await this.statusService.getLatestStatus();
    const history = await this.statusService.getHistory();

    return {
      current: latest,
      history,
    };
  }

  @Get('my-connection')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar status da conexão do tenant (Usuário)' })
  @ApiResponse({
    status: 200,
    description:
      'Verificação em tempo real da conexão com API, Postgres e Firebird.',
    type: MyConnectionStatusResponseDto,
  })
  async getMyConnection(@Req() req: ReqWithAuthContext) {
    const start = Date.now();
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      return { status: 'error', message: 'Credentials not found in token' };
    }

    const [postgresHealth, tenantHealth] = await Promise.all([
      this.healthService.checkPostgres(),
      this.healthService.checkTenant(credentialsId),
    ]);

    const totalTime = Date.now() - start;
    const maxDbWait = Math.max(
      tenantHealth.responseTimeMs,
      postgresHealth.responseTimeMs || 0,
    );
    const apiOverhead = totalTime - maxDbWait;

    return {
      api: 'UP', // Se chegou aqui, a API está respondendo
      apiLatency: apiOverhead > 0 ? apiOverhead : 1,
      postgres: postgresHealth.status === 'up' ? 'UP' : 'DOWN',
      postgresLatency: postgresHealth.responseTimeMs,
      tenant: tenantHealth.status === 'up' ? 'UP' : 'DOWN',
      tenantLatency: tenantHealth.responseTimeMs,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Página de Status visual (Pública)' })
  @ApiResponse({
    status: 200,
    description: 'Página visual de status em HTML.',
  })
  async getStatusPage(@Res() res: Response) {
    // Busca o template independente de estar em src (dev) ou dist (prod)
    const htmlPath = path.join(__dirname, 'templates', 'status.html');

    if (!fs.existsSync(htmlPath)) {
      // Fallback para quando o path pode variar dependendo da build
      const altPath = path.join(
        process.cwd(),
        'dist/modules/status/templates/status.html',
      );
      if (fs.existsSync(altPath)) {
        const html = fs.readFileSync(altPath, 'utf8');
        return res.type('text/html').send(html);
      }
      return res.status(404).send('Status page template not found');
    }

    const html = fs.readFileSync(htmlPath, 'utf8');
    res.type('text/html').send(html);
  }
}
