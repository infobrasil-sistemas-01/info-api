import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiExcludeController } from '@nestjs/swagger';
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
  constructor(private readonly dashboardService: DashboardService) {}

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
  @ApiOperation({ summary: 'Obtém o ranking de usuários por volume de requisições' })
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
  @ApiOperation({ summary: 'Obtém lista de usuários que atingiram mais de 80% do limite mensal' })
  async getProactiveAlerts() {
    return this.dashboardService.getProactiveAlerts();
  }

  @Get('top-ips')
  @RequirePermissions({ allOf: ['core.dashboard.view'] })
  @ApiOperation({ summary: 'Obtém a lista de IPs de origem mais ativos' })
  async getTopIPs(
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
    @Query('limit') limitStr?: string,
  ) {
    const { startDate, endDate } = this.parseDates(startDateStr, endDateStr);
    const limit = limitStr ? parseInt(limitStr, 10) : 10;
    return this.dashboardService.getTopIPs(startDate, endDate, limit);
  }

  @Get('database-load')
  @RequirePermissions({ allOf: ['core.dashboard.view'] })
  @ApiOperation({ summary: 'Obtém a carga de requisições por banco de dados/host' })
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
  @ApiOperation({ summary: 'Obtém a distribuição de requisições por tipo de plano' })
  async getPlanDistribution(
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
  ) {
    const { startDate, endDate } = this.parseDates(startDateStr, endDateStr);
    return this.dashboardService.getPlanDistribution(startDate, endDate);
  }
}
