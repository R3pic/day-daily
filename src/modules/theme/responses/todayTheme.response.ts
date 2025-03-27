import { ApiProperty } from '@nestjs/swagger';

export class TodayThemeResponse {
  @ApiProperty({ description: '오늘의 주제', example: '오늘 한 일에서 앞으로도 계속 하고 싶은 일이 있나요?' })
  theme: string;
}