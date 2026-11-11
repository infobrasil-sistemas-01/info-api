import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DossierPdfService } from './dossier-pdf.service';
import { DashboardRollupService } from './dashboard-rollup.service';
import { InfraRegistryModule } from 'src/infra/prisma/infra-registry.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [InfraRegistryModule, AuthModule],
  providers: [DashboardService, DossierPdfService, DashboardRollupService],
  controllers: [DashboardController],
  exports: [DashboardService, DashboardRollupService],
})
export class DashboardModule {}
