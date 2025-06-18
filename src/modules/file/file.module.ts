import { Module } from '@nestjs/common';
import { FileService } from '@file/file.service';
import { FileController } from '@file/file.controller';

@Module({
  controllers: [
    FileController,
  ],
  providers: [
    FileService,
  ],
  exports: [
    FileService,
  ],
})
export class FileModule {}