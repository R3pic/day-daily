import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserEntity } from '@user/entities';

export default class UserSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ) {
    console.info('UserSeeder run');
    const userFactory = factoryManager.get(UserEntity);
    userFactory.setLocale('ko');
    await userFactory.saveMany(5);

    const repository = dataSource.getRepository(UserEntity);

    await repository.createQueryBuilder()
      .insert()
      .values(UserEntity.of({
        id: '3997d213-112a-11f0-b5c6-0242ac120002',
        fullName: '홍길동',
        nickname: '길동이',
      }))
      .orIgnore(true)
      .execute();
  }
}