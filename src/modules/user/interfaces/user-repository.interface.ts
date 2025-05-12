import { UserEntity } from '@user/entities';

export interface UserRepositoryBase {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  existsByEmail(email: string): Promise<boolean>;
}