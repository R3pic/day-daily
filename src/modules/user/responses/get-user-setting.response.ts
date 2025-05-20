import { UserSettingDto } from '@user/dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserSettingResponse {
  @ApiProperty({
    description: '유저 설정',
    type: UserSettingDto,
  })
  settings: UserSettingDto;
}