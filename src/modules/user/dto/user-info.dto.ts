import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty({ description: '이름' })
  full_name: string;

  @ApiProperty({ description: '이메일' })
  email: string;

  @ApiProperty({ description: '가입 일자' })
  registered_at: Date;

  @ApiProperty({ description: '작성한 일기 수' })
  diary_count: number;
}