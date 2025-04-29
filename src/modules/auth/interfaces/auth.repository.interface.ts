import { UserEntity } from '@user/entities';

export interface AuthRepositoryBase {
  getPassword(email: string): Promise<Pick<UserEntity, 'password'>>;
}