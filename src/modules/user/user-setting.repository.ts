import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { UserSettingEntity } from '@user/entities';

@Injectable()
export class UserSettingRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {}

  private get repository() {
    return this.txHost.tx.getRepository(UserSettingEntity);
  }

  async save(userId: string) {
    const entity = UserSettingEntity.of({
      userId,
      hideDiaries: false,
      hideProfile: false,
    });

    await this.repository.save(entity);
  }

  async findByUserId(userId: string): Promise<UserSettingEntity> {
    return this.repository.findOneOrFail({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async update(entity: UserSettingEntity) {
    return this.repository.update({
      user: {
        id: entity.userId,
      },
    }, entity);
  }

  async remove(entity: UserSettingEntity) {
    return this.repository.remove(entity);
  }
}