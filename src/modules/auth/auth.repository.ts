import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { UserEntity } from '@user/entities';
import { AuthRepositoryBase } from '@auth/interfaces';

@Injectable()
export class AuthRepository implements AuthRepositoryBase {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {}

  private get repository() {
    return this.txHost.tx.getRepository(UserEntity);
  }

  async getPassword(email: string): Promise<Pick<UserEntity, 'password'>> {
    const entity = await this.repository.findOneByOrFail({
      email,
    });

    return {
      password: entity.password,
    };
  }
}