import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { FILE_UPLOAD_PATH } from '@multer/constants';
import { isErrnoException } from '@file/utils';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  async deleteAvatar(fileName: string): Promise<void> {
    const filePath = path.join(FILE_UPLOAD_PATH, fileName);

    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
    } catch (err: unknown) {
      if (isErrnoException(err) && err.code === 'ENOENT') {
        this.logger.warn(`파일이 존재하지 않아 삭제하지 않았습니다: ${filePath}`);
        return;
      }
      throw err;
    }
  }
}