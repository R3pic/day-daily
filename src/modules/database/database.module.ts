import { Global, Module } from '@nestjs/common';
import { QueryRunnerFactory } from '@database/query-runner.factory';

@Global()
@Module({
  providers: [QueryRunnerFactory],
  exports: [QueryRunnerFactory],
})
export class DatabaseModule {}
