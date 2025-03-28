import { plainToInstance } from 'class-transformer';

import { DiaryEntity } from '@diary/entities';
import { CreateDiaryDto } from '@diary/dto/create-diary.dto';
import { DiaryDto } from '@diary/dto';

export class DiaryMapper {
  static createDtoToEntity(createDiaryDto: CreateDiaryDto): DiaryEntity {
    return plainToInstance(DiaryEntity, createDiaryDto, { excludeExtraneousValues: true });
  }

  static toDto(entity: DiaryEntity): DiaryDto {
    return plainToInstance(DiaryDto, entity, { excludeExtraneousValues: true });
  }
}