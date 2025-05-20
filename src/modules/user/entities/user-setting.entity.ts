import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { UserEntity } from '@user/entities';

@Entity({ name: 'user_setting' })
export class UserSettingEntity {
  @OneToOne(() => UserEntity, (user) => user.userSetting)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Expose()
  @Column({ type: 'boolean', name: 'hide_diaries', nullable: false })
  hideDiaries: boolean;

  @Expose()
  @Column({ type: 'boolean', name: 'hide_profile', nullable: false })
  hideProfile: boolean;

  static of(userSetting: Partial<UserSettingEntity>): UserSettingEntity {
    return Object.assign(new UserSettingEntity(), userSetting);
  }
}