import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { GetUsersDto } from '../dtos/get-users.dto';
import { GetUserDto } from '../dtos/get-user.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { PatchUserDto } from '../dtos/patch-user.dto';
import { AuthService } from '../../auth/providers/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import ProfileConfig from '../config/profile.config';
import { ConfigType } from '@nestjs/config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';

@Injectable()
export class UsersService {
  /**
   *
   * @param authService
   * @param usersRepository
   * @param profileConfig
   * @param usersCreateManyProvider
   * @param createUserProvider
   * @param findOneUserByEmailProvider
   */
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @Inject(ProfileConfig.KEY)
    private readonly profileConfig: ConfigType<typeof ProfileConfig>,
    private readonly usersCreateManyProvider: UsersCreateManyProvider,
    private readonly createUserProvider: CreateUserProvider,
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
  ) {}

  /**
   * get all users matching a set of filters
   * @param getUsersDto
   */
  async findAll(getUsersDto: GetUsersDto) {
    const profileApiKey = this.profileConfig.apiKey;

    console.log(profileApiKey);

    const users = await this.usersRepository.findBy({
      email: getUsersDto.email,
    });

    return users;
  }

  /**
   * get a single user by ID
   * @param getUserDto
   */
  async findOne(getUserDto: GetUserDto) {
    let user: UserEntity | null;

    try {
      user = await this.usersRepository.findOne({
        where: {
          id: getUserDto.id,
        },
      });
    } catch (error: any) {
      throw new RequestTimeoutException('Unable to process request', {
        cause: error,
        description: 'Unable to connect to database',
      });
    }

    if (!user) {
      throw new NotFoundException(`User with id ${getUserDto.id} not found`);
    }

    return user;
  }

  /**
   * create a user
   * @param createUserDto
   */
  async create(createUserDto: CreateUserDto) {
    return this.createUserProvider.create(createUserDto);
  }

  async createMany(createManyUsersDto: CreateManyUsersDto) {
    return this.usersCreateManyProvider.createMany(createManyUsersDto);
  }

  /**
   * update a user by ID
   * @param id
   * @param patchUserDto
   */
  async update(id: string, patchUserDto: PatchUserDto) {
    const user = await this.usersRepository.findOne({ where: { id: id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.usersRepository.save(user);
  }

  /**
   *
   * @param email
   */
  public async findOneByEmail(email: string): Promise<UserEntity> {
    return this.findOneUserByEmailProvider.findOneByEmail(email);
  }
}
