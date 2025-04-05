import { DiaryDto } from '@diary/dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetDiaryByUserResponse {
  @ApiProperty({
    description: '사용자가 작성한 일기 목록',
    type: DiaryDto,
    isArray: true,
  })
  diaries: DiaryDto[];
}