import { ApiProperty } from '@nestjs/swagger';

export class ClientCreateResponseDto {
  @ApiProperty({
    description: 'Código identificador do cliente criado (CLI_CODIGO)',
    example: 105,
  })
  CLI_CODIGO!: number;
}
