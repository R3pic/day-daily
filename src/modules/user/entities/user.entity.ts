import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { UserSettingEntity } from '@user/entities/user-setting.entity';
import { AuthEntity } from '@auth/entities/auth.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column({ type: 'varchar', length: 255, name: 'email', nullable: false })
  email: string;

  @Expose()
  @Column({ type: 'varchar', length: 30, name: 'full_name', nullable: false })
  fullName: string;

  @Expose()
  @Column({ type: 'varchar', length: 30, nullable: true })
  nickname: string | null;

  @Expose()
  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string | null;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Expose()
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => UserSettingEntity, (setting) => setting.user, { cascade: true })
  userSetting: UserSettingEntity;

  @OneToOne(() => AuthEntity, (auth) => auth.user, { cascade: true })
  auth: AuthEntity;

  static of(user: Partial<UserEntity>): UserEntity {
    return Object.assign(new UserEntity(), user);
  }
}
