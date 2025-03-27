import { Module } from '@nestjs/common';

import { DiaryModule } from '@diary/diary.module';
import { MeController } from '@me/me.controller';

@Module({
  imports: [DiaryModule],
  controllers: [MeController],
})
export class MeModule {}
