import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class QueryRunnerFactory {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  create(): QueryRunner {
    return this.dataSource.createQueryRunner();
  }
}