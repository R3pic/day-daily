import { Injectable, Logger } from '@nestjs/common';
import { DiaryService } from '@diary/diary.service';
import { UserInfoService } from '@user/user-info.service';
import { UserSettingService } from '@user/user-setting.service';
import { PaginationQuery, RequestUser } from '@common/dto';
import { CreateDiaryDto, DeleteDiaryParamDto, GetCalendarQuery, ReadDiaryDto, UpdateDiaryDto } from '@diary/dto';
import { UpdatePasswordDto, UpdateUserSettingDto, UserDto, UserSettingDto } from '@user/dto';
import { UserInfoDto } from '@user/dto/user-info.dto';
import { DeleteDiaryDto } from '@diary/dto/delete-diary.dto';
import { UserService } from '@user/user.service';
import { DiaryCalendarService } from '@diary/diary-calendar.service';
import { UserMapper } from '@user/user.mapper';
import { UpdateProfileAvatarDto } from '@me/dto';
import { UserNotFoundException } from '@user/exceptions';

@Injectable()
export class MeService {
  private readonly logger = new Logger(MeService.name);
  constructor(
    private readonly diaryService: DiaryService,
    private readonly diaryCalendarService: DiaryCalendarService,
    private readonly userService: UserService,
    private readonly userInfoService: UserInfoService,
    private readonly userSettingService: UserSettingService,
  ) {}
  async getMe(requestUser: RequestUser): Promise<UserDto> {
    const user = await this.userService.findById(requestUser.id);

    return UserMapper.toDto(user);
  }

  async findDiaries(requestUser: RequestUser, query: PaginationQuery) {
    const dto = new ReadDiaryDto(
      requestUser,
      requestUser.id,
    );

    const diaries = await this.diaryService.findManyByUserId(dto, query);

    return diaries;
  }

  async createDiary(requestUser: RequestUser, createDiaryDto: CreateDiaryDto) {
    const diary = await this.diaryService.create(requestUser, createDiaryDto);
    const previousDiaries = await this.diaryService.findTodayThemeDiariesByUser(requestUser, diary);

    return {
      diary,
      previousDiaries,
    };
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
    const userInfo = await this.userInfoService.findByUserId(requestUser.id, requestUser);

    if (userInfo === null) throw new UserNotFoundException();

    return userInfo;
  }

  async changePassword(updatePasswordDto: UpdatePasswordDto): Promise<void> {
    await this.userService.updatePassword(updatePasswordDto);
  }

  async getCalendar(requestUser: RequestUser, query: GetCalendarQuery): Promise<boolean[]> {
    const calendar = await this.diaryCalendarService.findByUserId(requestUser.id, query);

    return calendar;
  }

  async updateProfileAvatar(updateProfileAvatarDto: UpdateProfileAvatarDto) {
    await this.userService.updateProfileAvatar(updateProfileAvatarDto);
  }
}