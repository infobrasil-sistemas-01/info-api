import { Module } from '@nestjs/common';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';
import { CityController } from './city.controller';
import { CityService } from './city.service';

@Module({
  imports: [TenantConnectionModule],
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService],
})
export class CityModule {}
