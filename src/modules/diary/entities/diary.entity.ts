import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity, Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ThemeEntity } from '@theme/entities';
import { UserEntity } from '@user/entities';

@Index(['author', 'createdAt'])
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
  @Index()
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Expose()
  @Index()
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'author' })
  author: UserEntity;

  static of(diary: Partial<DiaryEntity>): DiaryEntity {
    return Object.assign(new DiaryEntity(), diary);
  }
}