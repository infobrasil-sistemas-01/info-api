import { Module } from '@nestjs/common';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductBrandController } from './brand/product-brand.controller';
import { ProductBrandService } from './brand/product-brand.service';

@Module({
  controllers: [ProductController, ProductBrandController],
  imports: [TenantConnectionModule],
  providers: [ProductService, ProductBrandService],
})
export class ProductModule {}
