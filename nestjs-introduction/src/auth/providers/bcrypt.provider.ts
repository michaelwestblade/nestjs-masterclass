import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class BcryptProvider implements HashingProvider {
  async hashPassword(password: string | Buffer): Promise<string> {
    // generate salt
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const salt = await bcrypt.genSalt();

    // hash password
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return bcrypt.hash(password, salt);
  }
  comparePassword(
    password: string | Buffer,
    encryptedPassword: string,
  ): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return bcrypt.compare(password, encryptedPassword);
  }
}
