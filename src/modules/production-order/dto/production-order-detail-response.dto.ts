import { ApiProperty } from '@nestjs/swagger';
import { ProductionOrderResponseDto } from './production-order-response.dto';
import { ProductionOrderItemResponseDto } from './production-order-item-response.dto';

export class ProductionOrderDetailResponseDto extends ProductionOrderResponseDto {
  @ApiProperty({
    type: [ProductionOrderItemResponseDto],
    description: 'Lista de insumos/itens da ordem de produção (ORDENSPRODUCAOITENS)',
  })
  items: ProductionOrderItemResponseDto[];
}

