import { Controller, Get, Query, UseGuards, Res, BadRequestException } from '@nestjs/common';
import type { Response } from 'express';
import { format } from 'date-fns';
import { DossierPdfService } from './dossier-pdf.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiExcludeController,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { DashboardService } from './dashboard.service';

@ApiTags('Admin Dashboard')
@ApiExcludeController()
@Controller('dashboard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly dossierPdfService: DossierPdfService,
  ) {}

  private parseDates(startDateStr?: string, endDateStr?: string) {
    const endDate = endDateStr ? new Date(endDateStr) : new Date();
    const startDate = startDateStr
      ? new Date(startDateStr)
      : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 dias atrás por padrão
    return { startDate, endDate };
  }

  @Get('summary')
  @RequirePermissions({ allOf: ['core.dashboard.view'] })
  @ApiOperation({ summary: 'Obtém o resumo executivo do uso da API' })
  async getSummary(
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
  ) {
    const { startDate, endDate } = this.parseDates(startDateStr, endDateStr);
    return this.dashboardService.getSummary(startDate, endDate);
  }

  @Get('top-users')
  @RequirePermissions({ allOf: ['core.dashboard.view'] })
  @ApiOperation({
    summary: 'Obtém o ranking de usuários por volume de requisições',
  })
  async getTopUsers(
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
    @Query('limit') limitStr?: string,
  ) {
    const { startDate, endDate } = this.parseDates(startDateStr, endDateStr);
    const limit = limitStr ? parseInt(limitStr, 10) : 10;
    return this.dashboardService.getTopUsers(startDate, endDate, limit);
  }

  @Get('top-endpoints')
  @RequirePermissions({ allOf: ['core.dashboard.view'] })
  @ApiOperation({ summary: 'Obtém o ranking de rotas mais consumidas' })
  async getTopEndpoints(
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
    @Query('limit') limitStr?: string,
  ) {
    const { startDate, endDate } = this.parseDates(startDateStr, endDateStr);
    const limit = limitStr ? parseInt(limitStr, 10) : 10;
    return this.dashboardService.getTopEndpoints(startDate, endDate, limit);
  }

  @Get('status-distribution')
  @RequirePermissions({ allOf: ['core.dashboard.view'] })
  @ApiOperation({ summary: 'Obtém a distribuição de retornos HTTP por classe' })
  async getStatusDistribution(
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
  ) {
    const { startDate, endDate } = this.parseDates(startDateStr, endDateStr);
    return this.dashboardService.getStatusDistribution(startDate, endDate);
  }

  @Get('time-series')
  @RequirePermissions({ allOf: ['core.dashboard.view'] })
  @ApiOperation({ summary: 'Obtém a evolução temporal das requisições' })
  async getTimeSeries(
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
    @Query('interval') interval?: string,
  ) {
    const { startDate, endDate } = this.parseDates(startDateStr, endDateStr);
    return this.dashboardService.getTimeSeries(startDate, endDate, interval);
  }

  @Get('proactive-alerts')
  @RequirePermissions({ allOf: ['core.dashboard.view'] })
  @ApiOperation({
    summary:
      'Obtém lista de usuários que atingiram mais de 80% do limite mensal',
  })
  async getProactiveAlerts() {
    return this.dashboardService.getProactiveAlerts();
  }
  @Get('heartbeat')
  @RequirePermissions({ allOf: ['core.dashboard.view'] })
  @ApiOperation({ summary: 'Obtém o status de integridade do consumer log-processor' })
  async getHeartbeat() {
    return this.dashboardService.getHeartbeatStatus();
  }

  @Get('request-logs')
  @RequirePermissions({ allOf: ['core.dashboard.view'] })
  @ApiOperation({ summary: 'Obtém a lista de logs de requisições HTTP do período' })
  async getRequestLogs(
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
  ) {
    const { startDate, endDate } = this.parseDates(startDateStr, endDateStr);
    const page = pageStr ? parseInt(pageStr, 10) : 1;
    const limit = limitStr ? parseInt(limitStr, 10) : 50;
    return this.dashboardService.getRequestLogs(startDate, endDate, page, limit);
  }
  @Get('database-load')
  @RequirePermissions({ allOf: ['core.dashboard.view'] })
  @ApiOperation({
    summary: 'Obtém a carga de requisições por banco de dados/host',
  })
  async getDatabaseLoad(
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
    @Query('limit') limitStr?: string,
  ) {
    const { startDate, endDate } = this.parseDates(startDateStr, endDateStr);
    const limit = limitStr ? parseInt(limitStr, 10) : 10;
    return this.dashboardService.getDatabaseLoad(startDate, endDate, limit);
  }

  @Get('plan-distribution')
  @RequirePermissions({ allOf: ['core.dashboard.view'] })
  @ApiOperation({
    summary: 'Obtém a distribuição de requisições por tipo de plano',
  })
  async getPlanDistribution(
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
  ) {
    const { startDate, endDate } = this.parseDates(startDateStr, endDateStr);
    return this.dashboardService.getPlanDistribution(startDate, endDate);
  }

  @Get('dossier')
  @RequirePermissions({ allOf: ['core.dashboard.view'] })
  @ApiOperation({
    summary: 'Gera e faz o download de um dossiê executivo em PDF',
  })
  async downloadDossier(
    @Res() res: Response,
    @Query('type') type: 'internal' | 'client',
    @Query('userId') userId?: string,
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
  ) {
    if (type === 'client' && !userId) {
      throw new BadRequestException(
        'userId é obrigatório para dossiê do tipo "client"',
      );
    }

    const { startDate, endDate } = this.parseDates(startDateStr, endDateStr);
    const data = await this.dashboardService.getDossierData(
      type,
      startDate,
      endDate,
      userId,
    );
    const pdfBuffer = await this.dossierPdfService.generateDossierPdf(
      type,
      data,
      startDate,
      endDate,
    );

    const filename = `dossie-${type}-${userId || 'geral'}-${format(
      new Date(),
      'yyyyMMdd',
    )}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer);
  }
}
