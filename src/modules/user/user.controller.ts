import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeController, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { UserService } from './user.service';
import type { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@ApiTags('User')
@ApiExcludeController()
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @RequirePermissions({ allOf: ['core.user.create'] })
  @ApiOperation({ summary: 'Criar um novo usuário' })
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Get()
  @RequirePermissions({ allOf: ['core.user.view'] })
  @ApiOperation({ summary: 'Listar todos os usuários' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @RequirePermissions({ allOf: ['core.user.view'] })
  @ApiOperation({ summary: 'Obter detalhes de um usuário' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions({ allOf: ['core.user.update'] })
  @ApiOperation({ summary: 'Atualizar um usuário' })
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions({ allOf: ['core.user.delete'] })
  @ApiOperation({ summary: 'Excluir um usuário' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post('me/rotate-password')
  @ApiOperation({ summary: 'Rotacionar senha do usuário logado' })
  rotateMe(@Request() req: any) {
    return this.userService.rotatePassword(req.user.sub);
  }
}
