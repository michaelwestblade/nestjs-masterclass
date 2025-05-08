import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersDto } from '../dtos/get-users.dto';
import { GetUserDto } from '../dtos/get-user.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { PatchUserDto } from '../dtos/patch-user.dto';
import { AuthService } from '../../auth/providers/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
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

  findOne(getUserDto: GetUserDto) {
    return {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com',
    };
  }

  create(createUserDto: CreateUserDto) {
    return {
      firstName: 'new',
      lastName: 'user',
      email: 'new@user.com',
    };
  }

  update(id: string, patchUserDto: PatchUserDto) {
    return {
      firstName: 'updated',
      lastName: 'user',
      email: 'updated@user.com',
    };
  }
}
