import { plainToInstance } from 'class-transformer';

import { DiaryEntity } from '@diary/entities';
import { CreateDiaryDto } from '@diary/dto/create-diary.dto';
import { DiaryDto, DeleteDiaryDto } from '@diary/dto';

export class DiaryMapper {
  static toEntity(dto: CreateDiaryDto | DeleteDiaryDto) {
    return plainToInstance(DiaryEntity, dto, { excludeExtraneousValues: true });
  }

  static toDto(entity: DiaryEntity): DiaryDto {
    return plainToInstance(DiaryDto, entity, { excludeExtraneousValues: true });
  }
}