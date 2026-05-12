import { Controller, Get, Res, UseGuards, Req } from '@nestjs/common';
import type { Response } from 'express';
import { StatusService } from './status.service';
import * as fs from 'fs';
import * as path from 'path';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HealthService } from '../health/health.service';
import { JwtAuthGuard, type ReqWithAuthContext } from '../auth/guards/jwt-auth.guard';

@ApiTags('Status')
@Controller('status')
export class StatusController {
  constructor(
    private readonly statusService: StatusService,
    private readonly healthService: HealthService,
  ) { }

  @Get('data')
  @ApiOperation({ summary: 'Obter dados de status e histórico (Público)' })
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
  async getMyConnection(@Req() req: ReqWithAuthContext) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      return { status: 'error', message: 'Credentials not found in token' };
    }

    const [generalHealth, tenantHealth] = await Promise.all([
      this.healthService.check(),
      this.healthService.checkTenant(credentialsId)
    ]);

    return {
      api: generalHealth.status === 'ok' ? 'UP' : 'DOWN',
      postgres: generalHealth.databases.postgres.status === 'up' ? 'UP' : 'DOWN',
      tenant: tenantHealth.status === 'up' ? 'UP' : 'DOWN',
      tenantLatency: tenantHealth.responseTimeMs
    };
  }

  @Get()
  @ApiOperation({ summary: 'Página de Status visual (Pública)' })
  async getStatusPage(@Res() res: Response) {
    // Busca o template independente de estar em src (dev) ou dist (prod)
    const htmlPath = path.join(__dirname, 'templates', 'status.html');
    
    if (!fs.existsSync(htmlPath)) {
      // Fallback para quando o path pode variar dependendo da build
      const altPath = path.join(process.cwd(), 'dist/modules/status/templates/status.html');
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
