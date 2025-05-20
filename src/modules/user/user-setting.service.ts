import { Injectable, Logger } from '@nestjs/common';
import { UserSettingRepository } from '@user/user-setting.repository';
import { CreateUserSettingDto, UpdateUserSettingDto } from '@user/dto';
import { UserSettingEntity } from '@user/entities';
import { RequestUser } from '@common/dto';
import { UserSettingMapper } from '@user/user-setting.mapper';

@Injectable()
export class UserSettingService {
  private readonly logger = new Logger(UserSettingService.name);

  constructor(
    private readonly userSettingRepository: UserSettingRepository,
  ) {}

  async findByUser(requestUser: RequestUser) {
    const entity = await this.userSettingRepository.findByUserId(requestUser.id);
    return UserSettingMapper.toDto(entity);
  }

  async save(dto: CreateUserSettingDto) {
    this.logger.debug('save');
    await this.userSettingRepository.save(dto.userId);
  }

  async update(dto: UpdateUserSettingDto) {
    this.logger.debug('update');
    const entity = UserSettingMapper.toEntity(dto);
    await this.userSettingRepository.update(entity);
  }

  async remove(userId: string) {
    this.logger.debug('remove');
    const entity = UserSettingEntity.of({
      userId,
    });

    await this.userSettingRepository.remove(entity);
  }
}