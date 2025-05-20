import { UserEntity } from '@user/entities';
import { DiaryCountDto } from '@diary/dto/diary-count.dto';
import { UserInfoDto } from '@user/dto/user-info.dto';

export class UserInfoMapper {
  static toDto(userEntity: UserEntity, diaryCountDto: DiaryCountDto): UserInfoDto {
    const dto = new UserInfoDto();

    dto.email = userEntity.email;
    dto.full_name = userEntity.fullName;
    dto.registered_at = userEntity.createdAt;
    dto.diary_count = diaryCountDto.diaryCount;

    return dto;
  }
}