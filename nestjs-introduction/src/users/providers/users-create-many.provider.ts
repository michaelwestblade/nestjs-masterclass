import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { DataSource } from 'typeorm';
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

    try {
      // connect query runner to database
      await queryRunner.connect();

      // start transaction
      await queryRunner.startTransaction();
    } catch (error: any) {
      throw new RequestTimeoutException('Could not connect to database.', {
        cause: error,
        description: 'Unable to connect to database.',
      });
    }

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
      throw new ConflictException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Could not complete the transaction. ${error?.message}`,
      );
    } finally {
      try {
        // disconnect query runner
        await queryRunner.release();
      } catch (error: any) {
        // eslint-disable-next-line no-unsafe-finally
        throw new RequestTimeoutException('Could not release db connection.', {
          cause: error,
          description:
            'Unable to release db connection. Please try again later.',
        });
      }
    }

    return { users: newUsers, count: newUsers.length };
  }
}
