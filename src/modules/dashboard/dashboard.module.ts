import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { InfraRegistryModule } from 'src/infra/prisma/infra-registry.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [InfraRegistryModule, AuthModule],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
