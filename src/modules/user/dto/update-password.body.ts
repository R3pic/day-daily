import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from 'class-validator';

export class UpdatePasswordBody {
  @ApiProperty({ description: '기존 비밀번호' })
  @IsString()
  before_password: string;

  @ApiProperty({ description: '새로운 비밀번호' })
  @IsStrongPassword({
    minNumbers: 0,
    minUppercase: 0,
    minLowercase: 0,
    minSymbols: 1,
    minLength: 10,
  })
  new_password: string;
}