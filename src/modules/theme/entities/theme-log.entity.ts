import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn, RelationId,
} from 'typeorm';
import { ThemeEntity } from '@theme/entities';

@Entity({ name: 'theme_logs' })
export class ThemeLogEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ThemeEntity, { nullable: false })
  @JoinColumn({ name: 'theme_id' })
  theme: ThemeEntity;

  @RelationId((log: ThemeLogEntity) => log.theme)
  themeId: number;

  @CreateDateColumn({ type: 'timestamp', name: 'logged_date' })
  loggedDate: Date;
}