import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { DiaryService } from '@diary/diary.service';
import { GetDiaryByUserResponse } from '@diary/responses';
import { ApiGetByUserResponses } from '@diary/decorator';
import { GetUserDiariesParam } from '@user/dto';
import { routes } from '@common/constants/api-routes';
import { PaginationQuery, RequestUser } from '@common/dto';
import { ReadDiaryDto } from '@diary/dto';
import { ReqUser } from '@common/decorator';
import { GuestJwtGuard } from '@auth/guards/guest-jwt.guard';

@ApiTags('User')
@ApiExtraModels(GetDiaryByUserResponse)
@Controller(routes.user.root)
export class UserController {
  constructor(
    private readonly diaryService: DiaryService,
  ) {}

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
