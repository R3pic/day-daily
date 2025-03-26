import {
  IsEnum,
  IsNumber,
  IsString,
  Max, Min,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
};

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;
}