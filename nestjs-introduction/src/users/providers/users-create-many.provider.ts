import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  /**
   *
   * @param dataSource
   */
  constructor(private readonly dataSource: DataSource) {}

  /**
   *
   * @param createUserDtos
   */
  async createMany(createManyUsersDto: CreateManyUsersDto) {
    const newUsers: UserEntity[] = [];

    // create query runner
    const queryRunner = this.dataSource.createQueryRunner();

    // connect query runner to database
    await queryRunner.connect();

    // start transaction
    await queryRunner.startTransaction();

    try {
      // run queries
      for (const createUserDto of createManyUsersDto.users) {
        const newUser = queryRunner.manager.create(UserEntity, createUserDto);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }

      await queryRunner.commitTransaction();
    } catch (error: any) {
      console.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      // disconnect query runner
      await queryRunner.release();
    }

    return newUsers;
  }
}
