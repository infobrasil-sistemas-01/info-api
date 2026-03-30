import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { ReqWithAuthContext } from '../auth/guards/jwt-auth.guard';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  getProducts(
    @Req() req: ReqWithAuthContext,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const credentialsId = req.authContext?.credentialsId;
    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }
    return this.productService.getProducts(credentialsId, page, pageSize);
  }
}
