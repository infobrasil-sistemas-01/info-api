import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { JwtAuthGuard, type ReqWithAuthContext } from '../auth/guards/jwt-auth.guard';
import { CallCenterService } from './call-center.service';
import { CallCenterQueryDto } from './dto/call-center-query.dto';
import { CallCenterResponseDto } from './dto/call-center-response.dto';

@ApiTags('Call Center')
@Controller('call-centers')
export class CallCenterController {
  constructor(private readonly callCenterService: CallCenterService) { }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.call-centers.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar atendimentos do Call Center',
    description:
      'Retorna uma lista paginada de atendimentos do Call Center com descrições das aplicações, tópicos e formas de atendimento.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de atendimentos do Call Center.',
    type: [CallCenterResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação nos filtros.',
  })
  getCallCenters(
    @Req() req: ReqWithAuthContext,
    @Query() query: CallCenterQueryDto,
  ) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new UnauthorizedException('Credentials ID não encontrado no token');
    }

    return this.callCenterService.get(credentialsId, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.call-centers.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar detalhes do atendimento do Call Center por ID',
    description:
      'Retorna os detalhes completos de um atendimento do Call Center pelo número (CAL_NUMERO).',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do atendimento do Call Center.',
    type: CallCenterResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Atendimento de Call Center não encontrado.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Número do atendimento (CAL_NUMERO)',
  })
  getCallCenterById(
    @Req() req: ReqWithAuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new UnauthorizedException('Credentials ID não encontrado no token');
    }

    return this.callCenterService.getById(credentialsId, id);
  }
}
