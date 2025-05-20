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
    const entity = UserSettingEntity.of({
      userId: updateDto.user.id,
      hideDiaries: updateDto.hideDiaries,
      hideProfile: updateDto.hideProfile,
    });
    return entity;
  }
}