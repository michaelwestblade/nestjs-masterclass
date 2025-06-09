import { Inject, Injectable } from '@nestjs/common';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../users/entities/user.entity';
import { ActiveUserInterface } from '../interfaces/active-user.interfaced';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  /**
   * generate a token
   * @param userId
   * @param expiresIn
   * @param payload
   */
  async signToken<T>(
    userId: string,
    expiresIn: number,
    payload?: T,
  ): Promise<string> {
    const activeUser = { sub: userId, ...payload };

    const token = await this.jwtService.signAsync(activeUser, {
      expiresIn,
      audience: this.jwtConfiguration.audience,
      issuer: this.jwtConfiguration.issuer,
      secret: this.jwtConfiguration.secret,
    });

    return token;
  }

  /**
   * generate and return access and refresh tokens
   * @param user
   */
  async generateTokens(user: UserEntity) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserInterface>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
