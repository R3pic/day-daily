import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDiaryParam {
  @IsUUID()
  @ApiProperty({ description: '일기 고유 아이디' })
  id: string;
}