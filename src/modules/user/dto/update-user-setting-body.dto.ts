import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserSettingBody {
  @ApiProperty({
    description: '일기 숨김 여부', example: false,
  })
  @IsOptional()
  @IsBoolean()
  hide_diaries?: boolean;

  @ApiProperty({
    description: '프로필 숨김 여부', example: false,
  })
  @IsOptional()
  @IsBoolean()
  hide_profile?: boolean;
}