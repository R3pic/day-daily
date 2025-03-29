import {
  IsEnum,
  IsNumber,
  IsString,
  Max, Min,
} from 'class-validator';

export enum Environment {
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

  // DATABASE
  @IsString()
  DATABASE_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  DATABASE_PORT: number;

  @IsString()
  DATABASE_ROOT_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  @IsString()
  DATABASE_USER: string;

  @IsString()
  DATABASE_PASSWORD: string;
}