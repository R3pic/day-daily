import { Injectable } from '@nestjs/common';

import { DiaryRepositoryBase } from '@diary/interfaces/diary.repository.interface';
import { DiaryEntity } from '@diary/entities';

@Injectable()
export class DiaryRepository implements DiaryRepositoryBase {
  private diaries: DiaryEntity[] = [];
  private diaryId = 0;
  constructor() {}

  async save(diaryEntity: DiaryEntity): Promise<DiaryEntity> {
    this.diaryId++;
    this.diaries.push({
      id: String(this.diaryId),
      theme_id: diaryEntity.theme_id,
      title: diaryEntity.title,
      content: diaryEntity.content,
      created_at: new Date(),
    });

    const createdEntity = this.diaries.at(-1);

    if (!createdEntity)
      return Promise.reject(new Error('Database Error'));
    else
      return Promise.resolve(createdEntity);
  }
}