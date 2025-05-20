import { Module } from '@nestjs/common';

import { DiaryModule } from '@diary/diary.module';
import { MeController } from '@me/me.controller';
import { UserModule } from '@user/user.module';
import { MeService } from '@me/me.service';

@Module({
  imports: [
    DiaryModule,
    UserModule,
  ],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
