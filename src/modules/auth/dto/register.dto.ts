import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsEmail()
  @ApiProperty({
    description: '이메일',
  })
  email: string;

  @IsString()
  @Length(1, 30)
  @ApiProperty({
    description: '실명',
  })
  full_name: string;

  @IsStrongPassword({
    minNumbers: 0,
    minUppercase: 0,
    minLowercase: 0,
    minSymbols: 1,
    minLength: 10,
  })
  @ApiProperty({
    description: '비밀번호',
  })
  password: string;
}