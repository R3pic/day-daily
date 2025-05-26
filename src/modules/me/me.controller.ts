import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { routes } from '@common/constants/api-routes';
import { PaginationQuery, RequestUser } from '@common/dto';
import { ReqUser } from '@common/decorator';
import { CreateDiaryResponse, GetDiaryByUserResponse } from '@diary/responses';
import { CreateDiaryDto, DeleteDiaryParamDto, UpdateDiaryDto } from '@diary/dto';
import { ApiCreateDiaryResponses, ApiDeleteDiaryResponses, ApiGetByUserResponses } from '@diary/decorator';
import { ApiUpdateDiaryResponses } from '@diary/decorator';
import { UpdateDiaryBody, UpdateDiaryParam } from '@diary/dto';
import { GetUserSettingResponse } from '@user/responses';
import { UpdateUserSettingDto, UpdateUserSettingBody, UpdatePasswordBody, UpdatePasswordDto } from '@user/dto';
import { ApiGetUserSettingResponses, ApiPatchUserSettingResponses } from '@user/decorator';
import { MeService } from '@me/me.service';
import { GetUserInfoResponse } from '@user/responses/get-user-info.response';

const MOCK_REQUEST_USER = { id: '3997d213-112a-11f0-b5c6-0242ac120002' };

@ApiTags('Me')
@ApiExtraModels(CreateDiaryResponse, GetUserSettingResponse)
@Controller(routes.me.root)
export class MeController {
  constructor(
    private readonly meService: MeService,
  ) {}

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
}
