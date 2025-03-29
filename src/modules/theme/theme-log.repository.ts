import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';

import { ThemeLogRepositoryBase } from '@theme/interface';
import { ThemeEntity, ThemeLogEntity } from '@theme/entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ThemeLogRepository implements ThemeLogRepositoryBase {
  private readonly logger = new Logger();

  constructor(
    @InjectRepository(ThemeLogEntity)
    private readonly repository: Repository<ThemeLogEntity>,
  ) {}

  async saveLog(themeEntity: ThemeEntity): Promise<void> {
    this.logger.log('saveLog');
    await this.repository.save({ theme: themeEntity });
  }

  async getLastLog(): Promise<ThemeLogEntity | null> {
    this.logger.log('getLastLog');
    const [log] = await this.repository.find({
      order: { id: 'DESC' },
      take: 1,
    });
    return log ?? null;
  }
}