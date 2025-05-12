import bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
  private readonly SALT_ROUND: number;

  constructor() {
    this.SALT_ROUND = 10;
  }

  async hash(plain: string): Promise<string> {
    const hashed = await bcrypt.hash(plain, this.SALT_ROUND);
    return hashed;
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    const isEqual = await bcrypt.compare(plain, hashed);

    return isEqual;
  }
}