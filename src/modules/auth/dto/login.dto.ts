import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: '이메일', example: 'test@email.com' })
  email: string;

  @ApiProperty({ description: '비밀번호', example: 'Test123$' })
  password: string;
}