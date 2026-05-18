import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { SendNewsletterDto } from './dto/send-newsletter.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller('newsletter')
@ApiExcludeController()
@UseGuards(JwtAuthGuard)
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Get('next-id')
  @RequirePermissions({ allOf: ['core.announcement.view'] })
  async getNextId() {
    const nextId = await this.newsletterService.getNextId();
    return { nextId };
  }

  @Post('preview')
  @RequirePermissions({ allOf: ['core.announcement.view'] })
  async getPreview(@Body() dto: SendNewsletterDto) {
    return this.newsletterService.getPreview(dto);
  }

  @Post('send')
  @RequirePermissions({ allOf: ['core.announcement.create'] })
  async send(@Body() dto: SendNewsletterDto) {
    return this.newsletterService.send(dto);
  }
}
