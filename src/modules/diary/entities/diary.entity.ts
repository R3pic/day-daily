import { Exclude, Expose } from 'class-transformer';

export class DiaryEntity {
  @Expose()
  id: string;

  @Exclude()
  theme_id: string;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  created_at: Date;

  constructor(diary: Partial<DiaryEntity>) {
    Object.assign(this, diary);
  }
}