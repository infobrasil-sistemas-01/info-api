import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseDto {
  @ApiProperty({ description: 'ID do usuário', example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' })
  id!: string;

  @ApiProperty({ description: 'Nome de usuário', example: 'infomobile' })
  username!: string;

  @ApiProperty({ description: 'Lista de permissões permitidas', example: ['tenant.orders.view', 'tenant.products.view'] })
  permissions!: string[];

  @ApiProperty({ description: 'Lista de papéis/roles do usuário', example: ['admin', 'client'] })
  roles!: string[];
}
