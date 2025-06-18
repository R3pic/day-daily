import { BadRequestException, Injectable, Logger, PipeTransform } from '@nestjs/common';

@Injectable()
export class AvatarValidationPipe implements PipeTransform {
  private readonly logger = new Logger(AvatarValidationPipe.name);

  private readonly MAX_FILE_SIZE = 4 * 1024 * 1024;

  transform(value: Express.Multer.File): Express.Multer.File {
    this.logger.debug(value);

    if (!value) throw new BadRequestException('avatar image required');
    if (!value.mimetype.startsWith('image/')) throw new BadRequestException('avatar is must be image file');
    if (value.size > this.MAX_FILE_SIZE) throw new BadRequestException('file size to big. max file size is 4mb');
    return value;
  }
}