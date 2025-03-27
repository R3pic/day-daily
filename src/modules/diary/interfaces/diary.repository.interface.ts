import { DiaryEntity } from '@diary/entities';

export interface DiaryRepositoryBase {
  save(diaryEntity: DiaryEntity): Promise<DiaryEntity>;
}