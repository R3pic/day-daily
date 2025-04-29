import { RegisterDto } from '@auth/dto';

export class CreateUserDto {
  email: string;
  full_name: string;
  password: string;

  static of(registerDto: RegisterDto): CreateUserDto {
    return Object.assign(new CreateUserDto(), registerDto);
  }
}