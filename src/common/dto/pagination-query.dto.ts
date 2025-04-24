import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationQuery {

  @ApiProperty({
    description: '몇개를 건너뛸건지',
    required: false,
  })
  @IsOptional()
  offset?: number;

  @ApiProperty({
    description: '몇개를 선택할건지',
    required: false,
  })
  @IsOptional()
  limit?: number;
}