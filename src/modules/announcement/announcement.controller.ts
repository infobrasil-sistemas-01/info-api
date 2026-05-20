import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller('announcements')
@ApiExcludeController()
@UseGuards(JwtAuthGuard)
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.announcementService.findAllForUser(user.sub);
  }

  @Post(':id/view')
  markAsViewed(@CurrentUser() user: any, @Param('id') id: string) {
    return this.announcementService.markAsViewed(user.sub, id);
  }

  // --- ADMIN ROUTES ---

  @Get('admin/all')
  @RequirePermissions({ allOf: ['core.announcement.view'] })
  findAllAdmin() {
    return this.announcementService.findAll();
  }

  @Post()
  @RequirePermissions({ allOf: ['core.announcement.create'] })
  create(@Body() data: any) {
    return this.announcementService.create(data);
  }

  @Patch(':id')
  @RequirePermissions({ allOf: ['core.announcement.update'] })
  update(@Param('id') id: string, @Body() data: any) {
    return this.announcementService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions({ allOf: ['core.announcement.delete'] })
  remove(@Param('id') id: string) {
    return this.announcementService.delete(id);
  }
}
