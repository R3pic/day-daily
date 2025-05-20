import { Module } from '@nestjs/common';

import { DiaryModule } from '@diary/diary.module';
import { MeController } from '@me/me.controller';
import { UserModule } from '@user/user.module';

@Module({
  imports: [
    DiaryModule,
    UserModule,
  ],
  controllers: [MeController],
})
export class MeModule {}
