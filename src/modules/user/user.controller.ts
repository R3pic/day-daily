import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { DiaryService } from '@diary/diary.service';
import { GetDiaryByUserResponse } from '@diary/responses';
import { ApiGetByUserResponses } from '@diary/decorator';
import { GetUserDiariesParam } from '@user/dto';
import { routes } from '@common/constants/api-routes';
import { PaginationQuery } from '@common/dto';

@ApiTags('User')
@ApiExtraModels(GetDiaryByUserResponse)
@Controller(routes.user.root)
export class UserController {
  constructor(
    private readonly diaryService: DiaryService,
  ) {}

  @Get(routes.user.detail.diaries)
  @HttpCode(HttpStatus.OK)
  @ApiGetByUserResponses()
  async getUserDiaries(
    @Param() getUserDiariesParam: GetUserDiariesParam,
    @Query() query: PaginationQuery,
  ): Promise<GetDiaryByUserResponse> {
    query.offset =  query.offset ? query.offset : 0;
    query.limit = query.limit ? query.limit : 15;

    const diaries = await this.diaryService.findManyByUserId(getUserDiariesParam.id, query);

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
