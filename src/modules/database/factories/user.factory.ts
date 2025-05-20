import { setSeederFactory } from 'typeorm-extension';
import { UserEntity } from '@user/entities';

export default setSeederFactory(UserEntity, (faker) => {
  return UserEntity.of({
    email: `${faker.internet.email()}`,
    fullName: `${faker.person.firstName()}${faker.person.lastName()}`,
    nickname: faker.lorem.word({ length: 10 }),
    password: faker.internet.password(),
    createdAt: faker.date.recent(),
  });
});