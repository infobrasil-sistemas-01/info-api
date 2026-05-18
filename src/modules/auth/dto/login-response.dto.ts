import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ description: 'ID do usuário', example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' })
  id!: string;

  @ApiProperty({ description: 'Nome de usuário', example: 'infomobile' })
  username!: string;

  @ApiProperty({ description: 'Função/Role do usuário', example: 'client', nullable: true })
  role!: string | null;

  @ApiProperty({ description: 'Lista de permissões permitidas', example: ['tenant.orders.view', 'tenant.products.view'] })
  permissions!: string[];
}

export class LoginResponseDto {
  @ApiProperty({ description: 'Token de acesso JWT', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token!: string;

  @ApiProperty({ description: 'Token de refresh para obter novos tokens de acesso', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refresh_token!: string;

  @ApiProperty({ description: 'Dados do usuário autenticado', type: LoginUserDto })
  user!: LoginUserDto;
}
