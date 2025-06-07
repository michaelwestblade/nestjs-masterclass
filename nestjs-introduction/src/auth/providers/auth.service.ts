import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  async signIn({ email, password }: SignInDto) {
    // check if user exists
    const user = await this.usersService.findOneByEmail(email);
  }

  isAuthenticated() {
    return true;
  }
}
