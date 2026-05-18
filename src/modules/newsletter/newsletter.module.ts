import { Module } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { InfraRegistryModule } from 'src/infra/prisma/infra-registry.module';
import { EmailModule } from 'src/infra/email/email.module';

@Module({
  imports: [InfraRegistryModule, EmailModule],
  controllers: [NewsletterController],
  providers: [NewsletterService],
  exports: [NewsletterService],
})
export class NewsletterModule {}
