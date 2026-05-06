import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { InfraRegistryModule } from 'src/infra/prisma/infra-registry.module';
import { UserInvitationController } from './user-invitation.controller';
import { UserInvitationService } from './user-invitation.service';

@Module({
  imports: [InfraRegistryModule],
  controllers: [UserController, UserInvitationController],
  providers: [UserService, UserInvitationService],
  exports: [UserService, UserInvitationService],
})
export class UserModule {}