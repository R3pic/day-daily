import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { ThemeEntity } from '@theme/entities';
import { DiaryEntity } from '@diary/entities';
import { UserEntity } from '@user/entities';

export default class DiarySeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ) {
    console.info('DiarySeeder Run');
    const diaryRepository = dataSource.getRepository(DiaryEntity);
    const themeRepository = dataSource.getRepository(ThemeEntity);
    const userRepository = dataSource.getRepository(UserEntity);

    const themes = await themeRepository.find();
    const users = await userRepository.find();

    const diaryFactory = factoryManager.get(DiaryEntity);
    diaryFactory.setLocale('ko');

    const makeEntity = async () => await diaryFactory.make({
      theme: getRandom(themes, true),
      author: getRandom(users),
    });

    const promises = Array.from({ length: 10 }).map(makeEntity);
    const diaryEntities = await Promise.all(promises);

    await diaryRepository.save(diaryEntities);
  }
}

function getRandom<T>(arr: T[], canBeNull: true): T | null;
function getRandom<T>(arr: T[], canBeNull?: false): T;
function getRandom<T>(arr: T[], canBeNull = false): T | null {
  if (canBeNull && Math.random() < 0.2) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}
