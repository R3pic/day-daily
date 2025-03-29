import { Injectable } from '@nestjs/common';

import { DiaryRepositoryBase } from '@diary/interfaces/diary.repository.interface';
import { DiaryEntity } from '@diary/entities';

@Injectable()
export class DiaryRepository implements DiaryRepositoryBase {
  private diaries: DiaryEntity[] = [
    {
      id: '1',
      theme_id: '1',
      title: '일기 제목 샘플',
      content: '일기 내용 샘플입니다.',
      created_at: new Date(),
    },
    {
      id: '2',
      theme_id: null,
      title: '일기 제목 샘플',
      content: '일기 내용 샘플입니다.',
      created_at: new Date(),
    },
  ];
  private diaryId = 2;
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

  async findByRecent(): Promise<DiaryEntity[]> {
    return Promise.resolve(this.diaries.slice(-5));
  }
}