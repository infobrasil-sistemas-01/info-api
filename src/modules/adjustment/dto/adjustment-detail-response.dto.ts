import { ApiProperty } from '@nestjs/swagger';
import { AdjustmentResponseDto } from './adjustment-response.dto';
import { AdjustmentItemResponseDto } from './adjustment-item-response.dto';

export class AdjustmentDetailResponseDto extends AdjustmentResponseDto {
  @ApiProperty({
    type: [AdjustmentItemResponseDto],
    description: 'Lista de itens do acerto (ITENSACE)',
  })
  items: AdjustmentItemResponseDto[];
}
