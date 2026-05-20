import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiExcludeController } from '@nestjs/swagger';
import { UptimeService } from './uptime.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Uptime')
@ApiExcludeController()
@Controller('uptime')
export class UptimeController {
  constructor(private readonly uptimeService: UptimeService) {}

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get system status from Uptime Robot' })
  getStatus() {
    return this.uptimeService.getMonitorStatus();
  }
}
