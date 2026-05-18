import { Controller, Get, UseGuards } from '@nestjs/common';
import { PlanService } from './plan.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { UserStatsResponseDto } from './dto/user-stats-response.dto';
import { PlanResponseDto } from './dto/plan-response.dto';

@ApiBearerAuth()
@ApiTags('Plans & Usage')
@Controller('plans')
export class StatsController {
  constructor(
    private readonly planService: PlanService,
    private readonly prisma: RegistryPrismaService
  ) { }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtém estatísticas de uso e limites do plano do usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas de uso e limites do plano retornadas com sucesso.',
    type: UserStatsResponseDto,
  })
  async getStats(@CurrentUser() user: JwtPayload) {
    return this.planService.getUserStats(user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os planos disponíveis' })
  @ApiResponse({
    status: 200,
    description: 'Lista de planos disponíveis retornada com sucesso.',
    type: [PlanResponseDto],
  })
  async findAll() {
    return this.prisma.plan.findMany({
      orderBy: { reqMonth: 'asc' }
    });
  }
}
