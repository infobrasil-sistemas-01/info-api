import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponseDto {
  @ApiProperty({
    description: 'Novo token de acesso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token!: string;

  @ApiProperty({
    description: 'Tempo de expiração do novo token de acesso em segundos',
    example: 900,
  })
  expires_in!: number;

  @ApiProperty({
    description: 'Tempo restante de expiração do token de refresh em segundos',
    example: 2592000,
  })
  refresh_expires_in!: number;
}
