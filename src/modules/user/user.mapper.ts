import { CreateUserDto, UserDto } from '@user/dto';
import { UserEntity } from '@user/entities';
import { UpdateProfileAvatarDto } from '@me/dto';

export class UserMapper {
  static toEntity(dto: CreateUserDto): UserEntity {
    const entity = new UserEntity();

    entity.email = dto.email;
    entity.fullName = dto.full_name;
    entity.password = dto.password;

    return entity;
  }

  static profileAvatarToEntity(dto: UpdateProfileAvatarDto): UserEntity {
    const entity = new UserEntity();

    entity.id = dto.requestUser.id;
    entity.avatar = dto.avatar.filename;

    return entity;
  }

  static toDto(entity: UserEntity): UserDto {
    const dto = new UserDto();

    dto.id = entity.id;
    dto.full_name = entity.fullName;
    dto.nickname = entity.nickname ?? undefined; // @TODO 더 좋은 방법 찾기
    dto.avatar = entity.avatar ?? undefined;

    return dto;
  }
}