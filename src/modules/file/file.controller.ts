import { Controller, Get, HttpCode, HttpStatus, Logger, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'node:path';
import * as fs from 'node:fs';

import { FILE_UPLOAD_PATH } from '@multer/constants';
import { AvatarNotFoundException } from '@file/exceptions';
import { ApiGetAvatarResponses } from '@file/decorator';

@Controller('avatars')
export class FileController {
  private readonly logger = new Logger(FileController.name);

  @Get(':avatar')
  @HttpCode(HttpStatus.OK)
  @ApiGetAvatarResponses()
  getAvatar(
    @Param('avatar') avatar: string,
    @Res() res: Response
  ) {
    this.logger.debug('getAvatar', avatar);
    const filePath = path.join(path.resolve(), FILE_UPLOAD_PATH, avatar);

    if (!fs.existsSync(filePath)) throw new AvatarNotFoundException();
    res.setHeader('content-type', 'image/*');

    return res.sendFile(filePath, { root: '/' });
  }
}
