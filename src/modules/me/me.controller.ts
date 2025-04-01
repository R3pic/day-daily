import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { DiaryService } from '@diary/diary.service';
import { CreateDiaryResponse } from '@diary/responses';
import { CreateDiaryDto, DeleteDiaryDto } from '@diary/dto';
import { ApiCreateDiaryResponses, ApiDeleteDiaryResponses } from '@diary/decorator';

@ApiTags('Me')
@ApiExtraModels(CreateDiaryResponse)
@Controller('me')
export class MeController {
  constructor(
    private readonly diaryService: DiaryService,
  ) {}

  @Post('diaries')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateDiaryResponses()
  async createDiary(
    @Body() createDiaryDto: CreateDiaryDto,
  ): Promise<CreateDiaryResponse> {
    const diary = await this.diaryService.create(createDiaryDto);

    return {
      diary,
    };
  }

  @Delete('diaries/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteDiaryResponses()
  async deleteDiary(
    @Param() deleteDiaryDto: DeleteDiaryDto,
  ) {
    await this.diaryService.delete(deleteDiaryDto);
  }
}
