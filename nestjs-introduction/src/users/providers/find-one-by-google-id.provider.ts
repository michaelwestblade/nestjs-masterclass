import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class FindOneByGoogleIdProvider {
  constructor(
    @Inject() private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async findOneByGoogleId(googleId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { googleId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
