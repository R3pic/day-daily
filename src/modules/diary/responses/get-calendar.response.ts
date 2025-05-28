import { ApiProperty } from '@nestjs/swagger';
import { PaginationLinkDto } from '@common/dto';

export class GetCalendarResponse {
  @ApiProperty({ description: '각 일자별 일기 작성 여부 배열' })
  calendar: boolean[];

  @ApiProperty({
    type: PaginationLinkDto,
  })
  links: PaginationLinkDto;
}