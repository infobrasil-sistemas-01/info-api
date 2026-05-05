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
import { ApiBearerAuth, ApiExcludeController, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { RoleService } from './role.service';
import type { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';

@ApiTags('Role')
@ApiExcludeController()
@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post()
  @RequirePermissions({ allOf: ['core.user.create'] })
  @ApiOperation({ summary: 'Criar uma nova role' })
  create(@Body() data: CreateRoleDto) {
    return this.roleService.create(data);
  }

  @Get()
  @RequirePermissions({ allOf: ['core.user.view'] })
  @ApiOperation({ summary: 'Listar todas as roles' })
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @RequirePermissions({ allOf: ['core.user.view'] })
  @ApiOperation({ summary: 'Obter detalhes de uma role' })
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions({ allOf: ['core.user.update'] })
  @ApiOperation({ summary: 'Atualizar uma role' })
  update(@Param('id') id: string, @Body() data: UpdateRoleDto) {
    return this.roleService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions({ allOf: ['core.user.delete'] })
  @ApiOperation({ summary: 'Excluir uma role' })
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
