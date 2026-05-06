import { Global, Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { StatsController } from './stats.controller';
import { InfraRegistryModule } from 'src/infra/prisma/infra-registry.module';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [InfraRegistryModule, AuthModule],
  providers: [PlanService],
  controllers: [StatsController],
  exports: [PlanService],
})
export class PlanModule { }
