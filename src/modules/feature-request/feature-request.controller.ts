import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import type { JwtPayload } from 'src/modules/auth/types/jwt-payload';
import { FeatureRequestService } from './feature-request.service';
import { CreateFeatureRequestDto } from './dto/create-feature-request.dto';
import { RespondFeatureRequestDto } from './dto/respond-feature-request.dto';

@ApiTags('Feature Requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('feature-requests')
export class FeatureRequestController {
  constructor(private readonly service: FeatureRequestService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova solicitação de funcionalidade (Cliente)' })
  create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateFeatureRequestDto,
  ) {
    return this.service.create(user.sub, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Lista as solicitações do usuário logado (Cliente)' })
  findMy(@CurrentUser() user: JwtPayload) {
    return this.service.findByUser(user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ anyOf: ['integration-request.view'] })
  @ApiOperation({ summary: 'Lista todas as solicitações de funcionalidades (Admin)' })
  findAll(@Query('status') status?: string) {
    return this.service.findAll(status);
  }

  @Patch(':id/respond')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ anyOf: ['integration-request.approve'] })
  @ApiOperation({ summary: 'Responde a uma solicitação e notifica o cliente por e-mail (Admin)' })
  respond(
    @Param('id') id: string,
    @Body() dto: RespondFeatureRequestDto,
  ) {
    return this.service.respond(id, dto);
  }
}
