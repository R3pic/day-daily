import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DiaryModule } from '@diary/diary.module';
import { UserService } from '@user/user.service';
import { UserController } from '@user/user.controller';
import { UserRepository } from '@user/user.repository';
import { UserEntity } from '@user/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => DiaryModule),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
  ],
  exports: [UserService],
})
export class UserModule {}
