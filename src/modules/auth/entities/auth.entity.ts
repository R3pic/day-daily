import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@user/entities';

@Entity({ name: 'auth' })
export class AuthEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  refresh_token: string | null;

  @OneToOne(() => UserEntity, (user) => user.auth)
  @JoinColumn()
  user: UserEntity;
}