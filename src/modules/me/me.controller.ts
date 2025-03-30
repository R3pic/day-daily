import { Body, Controller, Post } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { DiaryService } from '@diary/diary.service';
import { CreateDiaryResponse } from '@diary/responses';
import { CreateDiaryDto } from '@diary/dto';
import { ApiCreateDiaryResponses } from '@diary/decorator';

@ApiTags('Me')
@ApiExtraModels(CreateDiaryResponse)
@Controller('me')
export class MeController {
  constructor(
    private readonly diaryService: DiaryService,
  ) {}

  @Post('diaries')
  @ApiCreateDiaryResponses()
  async createDiary(
    @Body() createDiaryDto: CreateDiaryDto,
  ): Promise<CreateDiaryResponse> {
    const diary = await this.diaryService.create(createDiaryDto);

    return {
      diary,
    };
  }
}
