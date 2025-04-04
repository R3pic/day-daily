import { Injectable } from '@nestjs/common';

import { UserEntity } from '@user/entities';
import { UserRepository } from '@user/user.repository';
import { UserNotFoundException } from '@user/exceptions';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new UserNotFoundException();

    return user;
  }
}
