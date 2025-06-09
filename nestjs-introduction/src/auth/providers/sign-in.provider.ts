import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from '../../users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { ActiveUserInterface } from '../interfaces/active-user.interfaced';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly generateTokenProvider: GenerateTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOneByEmail(signInDto.email);
    let passwordsMatch = false;

    try {
      passwordsMatch = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare passwords',
      });
    }

    if (!passwordsMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const activeUser: ActiveUserInterface = { sub: user.id, email: user.email };

    const token = await this.jwtService.signAsync(activeUser, {
      expiresIn: this.jwtConfiguration.accessTokenTtl,
      audience: this.jwtConfiguration.audience,
      issuer: this.jwtConfiguration.issuer,
      secret: this.jwtConfiguration.secret,
    });
    return token;
  }
}
