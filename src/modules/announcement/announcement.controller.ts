import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';

@Controller('announcements')
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
}
