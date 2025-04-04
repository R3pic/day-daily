import {
  AbstractLogger,
  LogLevel,
  LogMessage,
} from 'typeorm';
import { Logger } from '@nestjs/common';

export class TypeOrmCustomLogger extends AbstractLogger {
  private readonly logger = new Logger('TypeORM');
  constructor() {
    super(['query', 'info', 'log', 'error']);
  }
  protected writeLog(
    level: LogLevel,
    logMessage: LogMessage | LogMessage[],
    // queryRunner?: QueryRunner,
  ) {
    const messages = this.prepareLogMessages(logMessage, {
      highlightSql: true,
    });

    for (const message of messages) {
      switch (message.type ?? level) {
        case 'log':
        case 'schema-build':
        case 'migration':
          this.logger.log(message.message);
          break;

        case 'info':
        case 'query':
          if (message.prefix) {
            this.logger.log(`${message.prefix} ${message.message}`);
          } else {
            this.logger.log(message.message);
          }
          break;

        case 'warn':
        case 'query-slow':
          if (message.prefix) {
            this.logger.warn(message.prefix, message.message);
          } else {
            this.logger.warn(message.message);
          }
          break;

        case 'error':
        case 'query-error':
          if (message.prefix) {
            this.logger.error(message.prefix, message.message);
          } else {
            this.logger.error(message.message);
          }
          break;
      }
    }
  }
}