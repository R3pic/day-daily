import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @Expose()
  @ApiProperty({ description: '사용자 고유 아이디' })
  id: string;

  @Expose({ name: 'fullName' })
  @ApiProperty({ description: '사용자 실명' })
  full_name: string;

  @Expose()
  @ApiProperty({ description: '사용자 닉네임' })
  nickname?: string;

  @Expose()
  @ApiProperty({ description: '사용자 아바타' })
  avatar?: string;
}