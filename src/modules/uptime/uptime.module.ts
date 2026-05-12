import { Module } from '@nestjs/common';
import { UptimeService } from './uptime.service';
import { UptimeController } from './uptime.controller';
import { EnvModule } from '../../config/env/env.module';

@Module({
  imports: [EnvModule],
  controllers: [UptimeController],
  providers: [UptimeService],
  exports: [UptimeService],
})
export class UptimeModule {}
