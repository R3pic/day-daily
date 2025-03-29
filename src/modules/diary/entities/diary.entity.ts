import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ThemeEntity } from '@theme/entities';

@Entity({ name: 'diaries' })
export class DiaryEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude()
  @ManyToOne(() => ThemeEntity, { nullable: true })
  @JoinColumn({ name: 'theme' })
  theme: ThemeEntity | null;

  @Expose()
  @Column({ type: 'varchar', length: 100, name: 'title', nullable: false })
  title: string;

  @Expose()
  @Column({ type: 'varchar', length: 2000, name: 'content', nullable: false })
  content: string;

  @Expose()
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  static of(diary: Partial<DiaryEntity>): DiaryEntity {
    return Object.assign(new DiaryEntity(), diary);
  }
}