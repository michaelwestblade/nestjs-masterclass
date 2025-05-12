import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetUsersDto } from '../dtos/get-users.dto';
import { GetUserDto } from '../dtos/get-user.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { PatchUserDto } from '../dtos/patch-user.dto';
import { AuthService } from '../../auth/providers/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  /**
   *
   * @param authService
   * @param usersRepository
   */
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * get all users matching a set of filters
   * @param getUsersDto
   */
  async findAll(getUsersDto: GetUsersDto) {
    const users = await this.usersRepository.findBy({
      email: getUsersDto.email,
    });

    return users;
  }

  /**
   * get a single user by ID
   * @param getUserDto
   */
  findOne(getUserDto: GetUserDto) {
    return this.usersRepository.findOne({
      where: {
        id: getUserDto.id,
      },
    });
  }

  /**
   * create a user
   * @param createUserDto
   */
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const newUser = this.usersRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      password: createUserDto.password,
    });

    return this.usersRepository.save(newUser);
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
}
