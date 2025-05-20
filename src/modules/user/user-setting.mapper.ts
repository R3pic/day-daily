import { UserSettingEntity } from '@user/entities';
import { UpdateUserSettingDto, UserSettingDto } from '@user/dto';

export class UserSettingMapper {
  static toDto(entity: UserSettingEntity): UserSettingDto {
    const dto = new UserSettingDto();

    dto.hide_diaries = entity.hideDiaries;
    dto.hide_profile = entity.hideProfile;

    return dto;
  }

  static toEntity(updateDto: UpdateUserSettingDto) {
    const entity = new UserSettingEntity();

    entity.userId = updateDto.user.id;
    entity.hideProfile = updateDto.hideProfile;
    entity.hideDiaries = updateDto.hideDiaries;

    return entity;
  }
}