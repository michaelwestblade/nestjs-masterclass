import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { SignInProvider } from './sign-in.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokenProvider } from './refresh-token.provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly signInProvider: SignInProvider,
    private readonly refreshTokenProvider: RefreshTokenProvider,
  ) {}
  signIn(signInDto: SignInDto) {
    return this.signInProvider.signIn(signInDto);
  }

  isAuthenticated() {
    return true;
  }

  refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return this.refreshTokenProvider.refreshTokens(refreshTokenDto);
  }
}
