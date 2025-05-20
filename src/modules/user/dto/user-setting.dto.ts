import { ApiProperty } from '@nestjs/swagger';

export class UserSettingDto {
  @ApiProperty({ description: '일기 숨김 여부' })
  hide_diaries: boolean;

  @ApiProperty({ description: '프로필 숨김 여부' })
  hide_profile: boolean;
}