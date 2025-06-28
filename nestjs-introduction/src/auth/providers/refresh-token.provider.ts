import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from '../../users/providers/users.service';

@Injectable()
export class RefreshTokenProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(jwtConfig.KEY)
    private readonly generateTokenProvider: GenerateTokensProvider,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      // verify the refresh token
      const { sub } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.secret,
          issuer: this.jwtConfiguration.issuer,
        },
      );

      // fetch user from the db
      const user = await this.usersService.findOne({ id: sub });

      if (!user) {
        throw new UnauthorizedException(`User ${sub} not found!`);
      }

      // generate tokens
      return await this.generateTokenProvider.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
