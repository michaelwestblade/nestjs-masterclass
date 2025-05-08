import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersDto } from '../dtos/get-users.dto';
import { GetUserDto } from '../dtos/get-user.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { PatchUserDto } from '../dtos/patch-user.dto';
import { AuthService } from '../../auth/providers/auth.service';

@Injectable()
export class UsersService {
  /**
   * constructor
   * @param authService
   */
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  /**
   * get all users matching a set of filters
   * @param getUsersDto
   */
  findAll(getUsersDto: GetUsersDto) {
    const isAuth = this.authService.isAuthenticated();
    console.log(isAuth);

    return [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@doe.com',
      },
    ];
  }

  /**
   * get a single user by ID
   * @param getUserDto
   */
  findOne(getUserDto: GetUserDto) {
    return {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com',
    };
  }

  /**
   * create a user
   * @param createUserDto
   */
  create(createUserDto: CreateUserDto) {
    return {
      firstName: 'new',
      lastName: 'user',
      email: 'new@user.com',
    };
  }

  /**
   * update a user by ID
   * @param id
   * @param patchUserDto
   */
  update(id: string, patchUserDto: PatchUserDto) {
    return {
      firstName: 'updated',
      lastName: 'user',
      email: 'updated@user.com',
    };
  }
}
