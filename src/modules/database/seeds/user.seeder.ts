import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserEntity, UserSettingEntity } from '@user/entities';

export default class UserSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ) {
    console.info('UserSeeder run');
    const userFactory = factoryManager.get(UserEntity);
    userFactory.setLocale('ko');
    const entities = await userFactory.saveMany(5);

    const repository = dataSource.getRepository(UserEntity);
    const userSettingRepository = dataSource.getRepository(UserSettingEntity);

    for (const entity of entities) {
      await userSettingRepository.save({
        userId: entity.id,
        hideProfile: false,
        hideDiaries: true,
      });
    }

    await repository.createQueryBuilder()
      .insert()
      .values(UserEntity.of({
        id: '3997d213-112a-11f0-b5c6-0242ac120002',
        email: 'test@email.com',
        fullName: '홍길동',
        nickname: '길동이',
        password: '$2b$10$0ilrBObGGuoKrpOZ849EOevPcp.5wqES4bqtRMkJh6iQAqLMSxZ2q',
      }))
      .orIgnore(true)
      .execute();

    await userSettingRepository.createQueryBuilder()
      .insert()
      .values(UserSettingEntity.of({
        userId: '3997d213-112a-11f0-b5c6-0242ac120002',
        hideDiaries: false,
        hideProfile: false,
      }))
      .orIgnore(true)
      .execute();
  }
}