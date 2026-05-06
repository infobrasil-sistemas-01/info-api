import { Controller, Get, UseGuards } from '@nestjs/common';
import { PlanService } from './plan.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';

@ApiBearerAuth()
@ApiTags('Plans & Usage')
@Controller('plans')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(
    private readonly planService: PlanService,
    private readonly prisma: RegistryPrismaService
  ) { }

  @Get('stats')
  @ApiOperation({ summary: 'Obtém estatísticas de uso e limites do plano do usuário logado' })
  async getStats(@CurrentUser() user: JwtPayload) {
    return this.planService.getUserStats(user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os planos disponíveis' })
  async findAll() {
    return this.prisma.plan.findMany({
      orderBy: { reqMonth: 'asc' }
    });
  }
}
