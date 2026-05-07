import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeController, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { PermissionService } from './permission.service';

@ApiTags('Permission')
@ApiExcludeController()
@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) { }

  @Get()
  @RequirePermissions({ anyOf: ['core.user.view', 'core.user.view', 'core.user.update', 'core.user.delete'] })
  @ApiOperation({ summary: 'Listar todas as permissões do sistema' })
  @ApiResponse({ status: 200, description: 'Lista de permissões' })
  findAll() {
    return this.permissionService.findAll();
  }
}
