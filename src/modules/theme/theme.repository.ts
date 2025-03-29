import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';

import { ThemeRepositoryBase } from '@theme/interface';
import { ThemeEntity } from '@theme/entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ThemeRepository implements ThemeRepositoryBase {
  private readonly logger = new Logger();
  constructor(
    @InjectRepository(ThemeEntity)
    private readonly repository: Repository<ThemeEntity>
  ) {}

  findById(id: string): Promise<ThemeEntity | null> {
    return this.repository.findOneBy({
      id,
    });
  }

  getRandomTheme(): Promise<ThemeEntity> {
    const queryBuilder = this.repository.createQueryBuilder()
      .select()
      .orderBy('RAND()')
      .limit(1);
    this.logger.debug(`getRandomTheme Sql : ${queryBuilder.getSql()}`);

    return queryBuilder.getOneOrFail();
  }
}