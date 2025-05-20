import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { DiaryService } from '@diary/diary.service';
import { UserInfoMapper } from '@user/user-info.mapper';
import { UserInfoDto } from '@user/dto/user-info.dto';

@Injectable()
export class UserInfoService {
  private readonly logger = new Logger(UserInfoService.name);

  constructor(
    private readonly userService: UserService,
    private readonly diaryService: DiaryService,
  ) {}

  async findByUserId(userId: string): Promise<UserInfoDto> {
    const user = await this.userService.findById(userId);
    const count = await this.diaryService.getCountByUserId(userId);

    return UserInfoMapper.toDto(user, count);
  }
}