import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query, UploadedFile, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { routes } from '@common/constants/api-routes';
import { PaginationQuery, RequestUser } from '@common/dto';
import { ReqUser } from '@common/decorator';
import { CreateDiaryResponse, GetDiaryByUserResponse } from '@diary/responses';
import { CreateDiaryDto, DeleteDiaryParamDto, UpdateDiaryDto } from '@diary/dto';
import {
  ApiCreateDiaryResponses,
  ApiDeleteDiaryResponses,
  ApiGetByUserResponses,
  ApiGetCalendarResponse,
} from '@diary/decorator';
import { ApiUpdateDiaryResponses } from '@diary/decorator';
import { UpdateDiaryBody, UpdateDiaryParam, GetCalendarQuery } from '@diary/dto';
import { GetCalendarResponse } from '@diary/responses';
import { GetUserSettingResponse, GetUserInfoResponse } from '@user/responses';
import { UpdateUserSettingDto, UpdateUserSettingBody, UpdatePasswordBody, UpdatePasswordDto } from '@user/dto';
import { ApiGetUserInfoResponse, ApiGetUserSettingResponses, ApiPatchUserSettingResponses } from '@user/decorator';
import { MeService } from '@me/me.service';
import { GetMeResponse } from '@me/resposnes';
import { ApiGetMeResponses } from '@me/decorator';
import { ApiPatchMeProfileResponses } from '@me/decorator/patch-me-profile.decorator';
import { AvatarValidationPipe } from '@me/pipe';
import { FormDataOnlyGuard } from '@common/guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_UPLOAD_PATH } from '@multer/constants';

const MOCK_REQUEST_USER = { id: '3997d213-112a-11f0-b5c6-0242ac120002' };

@ApiTags('Me')
@ApiExtraModels(GetMeResponse, CreateDiaryResponse, GetUserSettingResponse, GetUserInfoResponse, GetCalendarResponse)
@Controller(routes.me.root)
export class MeController {
  constructor(
    private readonly meService: MeService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiGetMeResponses()
  async getMe(
    @ReqUser() requestUser: RequestUser,
  ): Promise<GetMeResponse> {
    requestUser = MOCK_REQUEST_USER;

    const user = await this.meService.getMe(requestUser);

    return {
      user,
    };
  }

  @Get(routes.me.diary.root)
  @HttpCode(HttpStatus.OK)
  @ApiGetByUserResponses()
  async getDiaries(
    @ReqUser() requestUser: RequestUser,
    @Query() query: PaginationQuery,
  ): Promise<GetDiaryByUserResponse> {
    requestUser = MOCK_REQUEST_USER;

    query.offset = query.offset ? query.offset : 0;
    query.limit = query.limit ? query.limit : 15;

    const diaries = await this.meService.findDiaries(requestUser, query);

    const nextOffset = query.offset + query.limit;
    const limit = query.limit;

    return {
      diaries,

      links: {
        next: `/${routes.me.root}/${routes.me.diary.root}?offset=${nextOffset}&limit=${limit}`,
      },
    };
  }

  @Post(routes.me.diary.root)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateDiaryResponses()
  async createDiary(
    @ReqUser() requestUser: RequestUser,
    @Body() createDiaryDto: CreateDiaryDto,
  ): Promise<CreateDiaryResponse> {
    requestUser = MOCK_REQUEST_USER;

    const diary = await this.meService.createDiary(requestUser, createDiaryDto);

    return {
      diary,
    };
  }

  @Patch(routes.me.diary.detail)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiUpdateDiaryResponses()
  async updateDiary(
    @ReqUser() requestUser: RequestUser,
    @Param() updateDiaryParam: UpdateDiaryParam,
    @Body() updateDiaryBody: UpdateDiaryBody,
  ): Promise<void> {
    requestUser = MOCK_REQUEST_USER;

    const updateDiaryDto = UpdateDiaryDto.of(updateDiaryParam, updateDiaryBody);

    await this.meService.updateDiary(requestUser, updateDiaryDto);
  }

  @Delete(routes.me.diary.detail)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteDiaryResponses()
  async deleteDiary(
    @ReqUser() requestUser: RequestUser,
    @Param() deleteDiaryParamDto: DeleteDiaryParamDto,
  ) {
    requestUser = MOCK_REQUEST_USER;

    await this.meService.deleteDiary(requestUser, deleteDiaryParamDto);
  }

  @Get(routes.me.setting.root)
  @HttpCode(HttpStatus.OK)
  @ApiGetUserSettingResponses()
  async getSetting(
    @ReqUser() requestUser: RequestUser,
  ): Promise<GetUserSettingResponse> {
    requestUser = MOCK_REQUEST_USER;

    const settings = await this.meService.findUserSetting(requestUser);

    return {
      settings,
    };
  }

  @Patch(routes.me.setting.root)
  @HttpCode(HttpStatus.OK)
  @ApiPatchUserSettingResponses()
  async updateSetting(
    @ReqUser() requestUser: RequestUser,
    @Body() updateUserSettingBody: UpdateUserSettingBody,
  ): Promise<void> {
    requestUser = MOCK_REQUEST_USER;

    const dto = new UpdateUserSettingDto(
      requestUser,
      updateUserSettingBody,
    );

    await this.meService.updateUserSetting(dto);
  }

  @Get(routes.me.info.root)
  @HttpCode(HttpStatus.OK)
  @ApiGetUserInfoResponse()
  async findUserInfo(
    @ReqUser() requestUser: RequestUser,
  ): Promise<GetUserInfoResponse> {
    requestUser = MOCK_REQUEST_USER;

    const userInfo = await this.meService.findUserInfo(requestUser);

    return {
      user_info: userInfo,
    };
  }

  @Patch(routes.me.password.root)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @ReqUser() requestUser: RequestUser,
    @Body() updatePasswordDto: UpdatePasswordBody,
  ): Promise<void> {
    requestUser = MOCK_REQUEST_USER;

    const dto = new UpdatePasswordDto(
      requestUser,
      updatePasswordDto
    );

    await this.meService.changePassword(dto);
  }

  @Get(routes.me.diary.calendar.root)
  @HttpCode(HttpStatus.OK)
  @ApiGetCalendarResponse()
  async getCalendar(
    @ReqUser() requestUser: RequestUser,
    @Query() query: GetCalendarQuery,
  ): Promise<GetCalendarResponse> {
    requestUser = MOCK_REQUEST_USER;

    const year = query.year;
    const month = query.month;

    const calendar = await this.meService.getCalendar(requestUser, query);

    return {
      calendar,

      links: {
        next: `/${routes.me.root}/${routes.me.diary.root}/${routes.me.diary.calendar.root}?year=${year}&month=${month + 1}`,
        prev: `/${routes.me.root}/${routes.me.diary.root}/${routes.me.diary.calendar.root}?year=${year}&month=${month - 1}`,
      },
    };
  }

  @Patch(routes.me.profile.root)
  @UseGuards(FormDataOnlyGuard)
  @UseInterceptors(FileInterceptor('avatar', {
    dest: FILE_UPLOAD_PATH,
  }))
  @HttpCode(HttpStatus.OK)
  @ApiPatchMeProfileResponses()
  async updateProfileAvatar(
    @ReqUser() requestUser: RequestUser,
    @UploadedFile(new AvatarValidationPipe()) avatar: Express.Multer.File,
  ) {
    requestUser = MOCK_REQUEST_USER;

    await this.meService.updateProfileAvatar({
      requestUser,
      avatar,
    });
  }
}
