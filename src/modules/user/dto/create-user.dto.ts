import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @Length(1, 30)
  @ApiProperty({ description: '유저 실명' })
  full_name: string;
}