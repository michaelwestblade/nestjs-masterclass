import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneUserByEmailProvider {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  /**
   *
   * @param email
   */
  public async findOneByEmail(email: string): Promise<UserEntity> {
    let user: UserEntity | null;

    try {
      user = await this.usersRepository.findOne({ where: { email } });
    } catch (error) {
      console.warn(error);
      throw new RequestTimeoutException(error, {
        description: 'Could not fetch the user',
      });
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
