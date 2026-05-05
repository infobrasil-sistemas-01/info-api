import { Module } from '@nestjs/common';
import { DbCredentialsController } from './db-credentials.controller';
import { DbCredentialsService } from './db-credentials.service';
import { InfraRegistryModule } from 'src/infra/prisma/infra-registry.module';

@Module({
  imports: [InfraRegistryModule],
  controllers: [DbCredentialsController],
  providers: [DbCredentialsService],
  exports: [DbCredentialsService],
})
export class DbCredentialsModule {}
