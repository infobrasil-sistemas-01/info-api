import { Module } from '@nestjs/common';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';
import { ProposalController } from './proposal.controller';
import { ProposalService } from './proposal.service';

@Module({
  imports: [TenantConnectionModule],
  controllers: [ProposalController],
  providers: [ProposalService],
  exports: [ProposalService],
})
export class ProposalModule {}
