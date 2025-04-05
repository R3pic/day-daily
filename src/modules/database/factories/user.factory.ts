import { setSeederFactory } from 'typeorm-extension';
import { UserEntity } from '@user/entities';

export default setSeederFactory(UserEntity, (faker) => {
  return UserEntity.of({
    fullName: `${faker.person.firstName()}${faker.person.lastName()}`,
    nickname: faker.lorem.word({ length: 10 }),
    createdAt: faker.date.recent(),
  });
});