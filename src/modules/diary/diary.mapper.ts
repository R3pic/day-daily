import { plainToInstance } from 'class-transformer';

import { DiaryEntity } from '@diary/entities';
import { CreateDiaryDto } from '@diary/dto/create-diary.dto';
import { DiaryDto, DeleteDiaryParamDto } from '@diary/dto';

export class DiaryMapper {
  static toEntity(dto: CreateDiaryDto | DeleteDiaryParamDto) {
    return plainToInstance(DiaryEntity, dto, { excludeExtraneousValues: true });
  }

  static toDto(entity: DiaryEntity): DiaryDto {
    return plainToInstance(DiaryDto, entity, { excludeExtraneousValues: true });
  }
}