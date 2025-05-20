import { UserInfoDto } from '@user/dto/user-info.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserInfoResponse {
  @ApiProperty({
    description: '사용자 정보',
    type: UserInfoDto,
  })
  user_info: UserInfoDto;
}