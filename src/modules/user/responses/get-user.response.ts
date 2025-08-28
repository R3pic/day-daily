import { UserInfoDto } from '@user/dto/user-info.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class GetUserResponse {
  @ApiProperty({
    description: '정보 가리기 활성화시 true',
    type: 'boolean',
  })
  isHide: boolean;

  @ApiProperty({
    description: '이메일을 제외한 사용자 정보',
    type: OmitType(UserInfoDto, ['email']),
  })
  user_info: Omit<UserInfoDto, 'email'> | null;

  @ApiProperty({
    description: '아바타 경로',
    type: 'string',
  })
  avatar: string | null;
}