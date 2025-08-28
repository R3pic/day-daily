import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { DiaryService } from '@diary/diary.service';
import { UserInfoMapper } from '@user/user-info.mapper';
import { UserInfoDto } from '@user/dto/user-info.dto';
import { UserSettingService } from '@user/user-setting.service';
import { RequestUser } from '@common/dto';

@Injectable()
export class UserInfoService {
  private readonly logger = new Logger(UserInfoService.name);

  constructor(
    private readonly userService: UserService,
    private readonly userSettingService: UserSettingService,
    private readonly diaryService: DiaryService,
  ) {}

  async findByUserId(userId: string, requestUser: RequestUser | null): Promise<UserInfoDto | null> {
    const targetUserSetting = await this.userSettingService.findByUserId(userId);

    if (targetUserSetting.hide_profile && requestUser?.id !== userId) return null;

    const user = await this.userService.findById(userId);
    const count = await this.diaryService.getCountByUserId(userId);

    return UserInfoMapper.toDto(user, count);
  }
}