import { Module } from '@nestjs/common';
import { IntegrationRequestController } from './integration-request.controller';
import { IntegrationRequestService } from './integration-request.service';
import { InfraRegistryModule } from 'src/infra/prisma/infra-registry.module';

@Module({
  imports: [InfraRegistryModule],
  controllers: [IntegrationRequestController],
  providers: [IntegrationRequestService],
})
export class IntegrationRequestModule {}
