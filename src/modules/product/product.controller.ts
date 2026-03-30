import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { ReqWithAuthContext } from '../auth/guards/jwt-auth.guard';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getProducts(@Req() req: ReqWithAuthContext) {
    const credentialsId = req.authContext?.credentialsId;
    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }
    return this.productService.getProducts(credentialsId);
  }
}
