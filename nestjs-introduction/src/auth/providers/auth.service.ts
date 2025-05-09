import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  async login(email: string, password: string) {
    // check if user exists
    const [user] = await this.usersService.findAll({
      limit: 1,
      page: 1,
      email,
    });

    if (!user) {
      throw new NotFoundException();
    }
    // login
    // token
  }

  isAuthenticated() {
    return true;
  }
}
