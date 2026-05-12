import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { ClientService } from './client.service';
import { GetClientsQueryDto } from './dto/get-clients-query.dto';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';

@ApiTags('Client')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) { }

  @Get()
  @RequirePermissions({ allOf: ['tenant.clients.view'] })
  @ApiOperation({ summary: 'Listar clientes' })
  async get(
    @CurrentUser() user: any,
    @Query() query: GetClientsQueryDto,
  ) {
    return this.clientService.get(
      user.credentials_id,
      user.store_id,
      query.page,
      query.pageSize,
      query.search,
      query.situation,
      query.birthdate,
    );
  }

  @Get(':id')
  @RequirePermissions({ allOf: ['tenant.clients.view'] })
  @ApiOperation({ summary: 'Obter detalhe do cliente' })
  async getById(
    @CurrentUser() user: any,
    @Param('id') id: number,
  ) {
    return this.clientService.getById(user.credentials_id, user.store_id, id);
  }
}
