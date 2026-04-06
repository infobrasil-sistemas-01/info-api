import { ApiProperty } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import z from 'zod';

export const RefreshTokenDto = z.object({
  refresh_token: z.string(),
});

export class RefreshDto extends ZodDto(RefreshTokenDto) {
  @ApiProperty({
    description: 'Token de refresh para obter um novo token de acesso',
  })
  refresh_token!: string;
}
