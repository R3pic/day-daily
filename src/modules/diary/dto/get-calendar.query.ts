import { IsNumber, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetCalendarQuery {
  @ApiProperty({
    description: '검색할 년도',
    example: 2025,
  })
  @IsNumber()
  @Min(2000)
  @Max(2100)
  year: number;

  @ApiProperty({
    description: '검색할 월',
    example: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;
}