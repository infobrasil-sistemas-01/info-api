import { Module } from '@nestjs/common';
import { TenantConnectionModule } from 'src/infra/database/tenant-connection.module';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductBrandController } from './brand/product-brand.controller';
import { ProductBrandService } from './brand/product-brand.service';
import { ProductGroupController } from './group/product-group.controller';
import { ProductGroupService } from './group/product-group.service';

@Module({
  controllers: [
    ProductController,
    ProductBrandController,
    ProductGroupController,
  ],
  imports: [TenantConnectionModule],
  providers: [ProductService, ProductBrandService, ProductGroupService],
  exports: [ProductService, ProductBrandService, ProductGroupService],
})
export class ProductModule {}
