import { setSeederFactory } from 'typeorm-extension';
import { DiaryEntity } from '@diary/entities';

export default setSeederFactory(DiaryEntity, (faker) => {
  return DiaryEntity.of({
    title: faker.lorem.sentence({ min: 2, max: 5 }),
    content: faker.lorem.text(),
    createdAt: faker.date.recent({ days: 3 }),
  });
});