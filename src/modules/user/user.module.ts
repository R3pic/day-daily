import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DiaryModule } from '@diary/diary.module';
import { UserService } from '@user/user.service';
import { UserController } from '@user/user.controller';
import { UserRepository } from '@user/user.repository';
import { UserEntity, UserSettingEntity } from '@user/entities';
import { UserSettingService } from '@user/user-setting.service';
import { UserSettingRepository } from '@user/user-setting.repository';
import { UserInfoService } from '@user/user-info.service';
import { HashService } from '@auth/hash.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserSettingEntity]),
    forwardRef(() => DiaryModule),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserSettingService,
    UserInfoService,
    UserRepository,
    UserSettingRepository,
    HashService,
  ],
  exports: [
    UserService,
    UserInfoService,
    UserSettingService,
  ],
})
export class UserModule {}
