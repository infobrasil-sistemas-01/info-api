import { Module } from '@nestjs/common';
import { IntegrationRequestController } from './integration-request.controller';
import { IntegrationRequestService } from './integration-request.service';
import { InfraRegistryModule } from 'src/infra/prisma/infra-registry.module';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [InfraRegistryModule, UserModule],
  controllers: [IntegrationRequestController],
  providers: [IntegrationRequestService, JwtService],
})
export class IntegrationRequestModule {}
