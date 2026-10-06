import { Module } from '@nestjs/common';
import { FeatureRequestService } from './feature-request.service';
import { FeatureRequestController } from './feature-request.controller';
import { InfraRegistryModule } from 'src/infra/prisma/infra-registry.module';
import { EmailModule } from 'src/infra/email/email.module';

@Module({
  imports: [InfraRegistryModule, EmailModule],
  controllers: [FeatureRequestController],
  providers: [FeatureRequestService],
  exports: [FeatureRequestService],
})
export class FeatureRequestModule {}
