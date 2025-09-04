import { ApiProperty } from '@nestjs/swagger';
import { DiaryDto } from '@diary/dto/diary.dto';

export class CreateDiaryResponse {
  @ApiProperty({ description: '일기' })
  diary: DiaryDto;

  @ApiProperty({ description: '이전에 동일한 주제로 작성된 일기', type: DiaryDto, isArray: true })
  previous_diaries: DiaryDto[];
}