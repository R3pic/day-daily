import { Injectable, Logger } from '@nestjs/common';
import { DiaryService } from '@diary/diary.service';
import { UserInfoService } from '@user/user-info.service';
import { UserSettingService } from '@user/user-setting.service';
import { PaginationQuery, RequestUser } from '@common/dto';
import { CreateDiaryDto, DeleteDiaryParamDto, ReadDiaryDto, UpdateDiaryDto } from '@diary/dto';
import { UpdatePasswordDto, UpdateUserSettingDto, UserSettingDto } from '@user/dto';
import { UserInfoDto } from '@user/dto/user-info.dto';
import { DeleteDiaryDto } from '@diary/dto/delete-diary.dto';
import { UserService } from '@user/user.service';

@Injectable()
export class MeService {
  private readonly logger = new Logger(MeService.name);
  constructor(
    private readonly diaryService: DiaryService,
    private readonly userService: UserService,
    private readonly userInfoService: UserInfoService,
    private readonly userSettingService: UserSettingService,
  ) {}

  async findDiaries(requestUser: RequestUser, query: PaginationQuery) {
    const dto = new ReadDiaryDto(
      requestUser,
      requestUser.id,
    );

    const diaries = await this.diaryService.findManyByUserId(dto, query);

    return diaries;
  }

  async createDiary(requestUser: RequestUser, createDiaryDto: CreateDiaryDto) {
    const diary = this.diaryService.create(requestUser, createDiaryDto);

    return diary;
  }

  async updateDiary(requestUser: RequestUser, updateDiaryDto: UpdateDiaryDto) {
    await this.diaryService.update(requestUser, updateDiaryDto);
  }

  async deleteDiary(requestUser: RequestUser, deleteDiaryParamDto: DeleteDiaryParamDto) {
    const deleteDiaryDto = new DeleteDiaryDto(requestUser, deleteDiaryParamDto);
    await this.diaryService.delete(deleteDiaryDto);
  }

  async findUserSetting(requestUser: RequestUser): Promise<UserSettingDto> {
    const userSetting = this.userSettingService.findByUser(requestUser);

    return userSetting;
  }

  async updateUserSetting(updateUserSettingDto: UpdateUserSettingDto) {
    await this.userSettingService.update(updateUserSettingDto);
  }

  async findUserInfo(requestUser: RequestUser): Promise<UserInfoDto> {
    const userInfo = this.userInfoService.findByUserId(requestUser.id);

    return userInfo;
  }

  async changePassword(updatePasswordDto: UpdatePasswordDto): Promise<void> {
    await this.userService.updatePassword(updatePasswordDto);
  }
}