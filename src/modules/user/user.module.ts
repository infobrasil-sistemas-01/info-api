import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { InfraRegistryModule } from 'src/infra/prisma/infra-registry.module';

@Module({
  imports: [InfraRegistryModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}