import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeController,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { UserInvitationService } from './user-invitation.service';

@ApiTags('User Invitation')
@ApiExcludeController()
@Controller('user-invitations')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class UserInvitationController {
  constructor(private readonly service: UserInvitationService) {}

  @Get()
  @RequirePermissions({ allOf: ['core.user.view'] })
  @ApiOperation({ summary: 'Listar todos os convites' })
  findAll() {
    return this.service.findAll();
  }

  @Delete(':id')
  @RequirePermissions({ allOf: ['core.user.delete'] })
  @ApiOperation({ summary: 'Revogar um convite' })
  remove(@Param('id') id: string) {
    return this.service.revoke(id);
  }

  @Post(':id/resend')
  @RequirePermissions({ allOf: ['core.user.create'] })
  @ApiOperation({ summary: 'Reenviar um convite' })
  resend(@Param('id') id: string) {
    return this.service.resend(id);
  }
}
