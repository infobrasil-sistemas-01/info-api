import { ApiProperty } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import z from 'zod';

export const RefreshTokenDto = z.object({
  refresh_token: z.string(),
});

export class RefreshDto extends ZodDto(RefreshTokenDto) {
  @ApiProperty({
    description: 'Token de refresh para obter um novo token de acesso',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  refresh_token!: string;
}
