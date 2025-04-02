import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ThemeRepositoryBase } from '@theme/interface';
import { ThemeEntity } from '@theme/entities';

@Injectable()
export class ThemeRepository implements ThemeRepositoryBase {
  private readonly logger = new Logger(ThemeRepository.name);
  constructor(
    @InjectRepository(ThemeEntity)
    private readonly repository: Repository<ThemeEntity>
  ) {}

  findById(id: number): Promise<ThemeEntity | null> {
    return this.repository.findOneBy({
      id,
    });
  }

  getRandomTheme(): Promise<ThemeEntity> {
    const queryBuilder = this.repository.createQueryBuilder()
      .select()
      .orderBy('RAND()')
      .limit(1);

    return queryBuilder.getOneOrFail();
  }
}