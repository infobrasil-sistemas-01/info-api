import { ApiProperty } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import z from 'zod';

export const OperatorVerifySchema = z.object({
  username: z.string().min(1, 'Username é obrigatório'),
  password: z.string().min(1, 'Password é obrigatório'),
});

export class OperatorVerifyDto extends ZodDto(OperatorVerifySchema) {
  @ApiProperty({
    description: 'Apelido/Login do operador no ERP (USU_APELIDO)',
    example: 'OPERADOR1',
  })
  username!: string;

  @ApiProperty({
    description: 'Senha de acesso do operador',
    example: 'senha123',
  })
  password!: string;
}
