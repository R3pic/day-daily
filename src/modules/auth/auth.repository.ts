import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { AuthEntity } from '@auth/entities/auth.entity';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {}

  private get repository() {
    return this.txHost.tx.getRepository(AuthEntity);
  }

  public async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const auth = await this.findAuthByUserId(userId);

    if (!auth) {
      throw new Error(`Auth entity not found for userId: ${userId}`);
    }

    auth.refresh_token = refreshToken;
    await this.repository.save(auth);
  }

  public async findAuthByUserId(userId: string): Promise<AuthEntity | null> {
    return this.repository.findOne({
      where: {
        user: { id: userId },
      },
    });
  }

  public async clearRefreshToken(userId: string): Promise<void> {
    const auth = await this.findAuthByUserId(userId);

    if (auth && auth.refresh_token) {
      auth.refresh_token = null;
      await this.repository.save(auth);
    }
  }
}