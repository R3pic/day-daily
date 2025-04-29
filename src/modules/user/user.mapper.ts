import { CreateUserDto, UserDto } from '@user/dto';
import { UserEntity } from '@user/entities';

export class UserMapper {
  static toEntity(dto: CreateUserDto): UserEntity {
    const entity = new UserEntity();

    entity.email = dto.email;
    entity.fullName = dto.full_name;
    entity.password = dto.password;

    return entity;
  }

  static toDto(entity: UserEntity): UserDto {
    const dto = new UserDto();

    dto.id = entity.id;
    dto.full_name = entity.fullName;
    dto.nickname = entity.nickname ?? undefined; // @TODO 더 좋은 방법 찾기

    return dto;
  }
}