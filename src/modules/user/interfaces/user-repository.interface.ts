import { UserEntity } from '@user/entities';

export interface UserRepositoryBase {
  findById(id: string): Promise<UserEntity | null>;
}