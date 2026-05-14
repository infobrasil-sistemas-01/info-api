import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeController, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { DbCredentialsService } from './db-credentials.service';
import type { CreateDbCredentialsDto, UpdateDbCredentialsDto } from './dto/db-credentials.dto';
import { HealthService } from '../health/health.service';

@ApiTags('DbCredentials')
@ApiExcludeController()
@Controller('db-credentials')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class DbCredentialsController {
  constructor(
    private readonly dbCredentialsService: DbCredentialsService,
    private readonly healthService: HealthService,
  ) {}

  @Post()
  @RequirePermissions({ allOf: ['core.user.create'] })
  create(@Body() data: CreateDbCredentialsDto) {
    return this.dbCredentialsService.create(data);
  }

  @Get()
  @RequirePermissions({ allOf: ['core.user.view'] })
  findAll() {
    return this.dbCredentialsService.findAll();
  }

  @Get(':id')
  @RequirePermissions({ allOf: ['core.user.view'] })
  findOne(@Param('id') id: string) {
    return this.dbCredentialsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions({ allOf: ['core.user.update'] })
  update(@Param('id') id: string, @Body() data: UpdateDbCredentialsDto) {
    return this.dbCredentialsService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions({ allOf: ['core.user.delete'] })
  remove(@Param('id') id: string) {
    return this.dbCredentialsService.remove(id);
  }

  @Get(':id/test')
  @RequirePermissions({ allOf: ['core.user.view'] })
  testConnection(@Param('id') id: string) {
    return this.healthService.checkTenant(id);
  }
}
