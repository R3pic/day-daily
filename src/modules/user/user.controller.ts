import { Controller, Get, HttpCode, HttpStatus, Param, Query, Res, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { DiaryService } from '@diary/diary.service';
import { GetDiaryByUserResponse } from '@diary/responses';
import { ApiGetByUserResponses } from '@diary/decorator';
import { GetUserDiariesParam, GetUserParam } from '@user/dto';
import { routes } from '@common/constants/api-routes';
import { PaginationQuery, RequestUser } from '@common/dto';
import { ReadDiaryDto } from '@diary/dto';
import { ReqUser } from '@common/decorator';
import { GuestJwtGuard } from '@auth/guards/guest-jwt.guard';
import { UserInfoService } from '@user/user-info.service';
import { GetUserResponse } from '@user/responses/get-user.response';
import { ApiGetUserResponses } from '@user/decorator';
import { UserService } from '@user/user.service';
import { Response } from 'express';
import { ApiCheckEmailResponses } from '@user/decorator/api-check-email.decorator';
import { DuplicatedEmailException } from '@auth/exceptions';

@ApiTags('User')
@ApiExtraModels(GetDiaryByUserResponse, GetUserResponse)
@Controller(routes.user.root)
export class UserController {
  constructor(
    private readonly diaryService: DiaryService,
    private readonly userService: UserService,
    private readonly userInfoService: UserInfoService,
  ) {}

  @Get(routes.user.checkEmail)
  @ApiCheckEmailResponses()
  async checkEmail(
    @Query('email') email: string,
    @Res() res: Response,
  ): Promise<void> {
    const isExists = await this.userService.existsByEmail(email);

    if (isExists) throw new DuplicatedEmailException();

    res.status(200).json();
  }

  @Get(routes.user.detail.root)
  @HttpCode(HttpStatus.OK)
  @ApiGetUserResponses()
  async getUser(
    @ReqUser() requestUser: RequestUser | null,
    @Param() getUserParam: GetUserParam,
  ): Promise<GetUserResponse> {
    const user_info = await this.userInfoService.findByUserId(getUserParam.id, requestUser);
    const user = await this.userService.findById(getUserParam.id);

    const isHide = user_info === null;

    return {
      isHide,
      user_info,
      avatar: user.avatar,
    };
  }

  @Get(routes.user.detail.diaries)
  @HttpCode(HttpStatus.OK)
  @UseGuards(GuestJwtGuard)
  @ApiGetByUserResponses()
  async getUserDiaries(
    @ReqUser() requestUser: RequestUser | null,
    @Param() getUserDiariesParam: GetUserDiariesParam,
    @Query() query: PaginationQuery,
  ): Promise<GetDiaryByUserResponse> {
    query.offset =  query.offset ? query.offset : 0;
    query.limit = query.limit ? query.limit : 15;

    const dto = new ReadDiaryDto(
      requestUser,
      getUserDiariesParam.id,
    );

    const diaries = await this.diaryService.findManyByUserId(dto, query);

    const nextOffset = query.offset + query.limit;
    const limit = query.limit;

    return {
      diaries,

      links: {
        next: `/${routes.user.root}/${getUserDiariesParam.id}/diaries?offset=${nextOffset}&limit=${limit}`,
      },
    };
  }
}
