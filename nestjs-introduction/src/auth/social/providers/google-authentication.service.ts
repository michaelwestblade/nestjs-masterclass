import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../../config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UsersService } from '../../../users/providers/users.service';
import { GenerateTokensProvider } from '../../providers/generate-tokens.provider';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private authClient: OAuth2Client;

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject() private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  /**
   * Initializes the module by setting up the authentication client using the provided Google client ID and secret
   * from the JWT configuration.
   *
   * @return {void} This method does not return any value.
   */
  onModuleInit() {
    const { googleClientId, googleClientSecret } = this.jwtConfiguration;
    this.authClient = new OAuth2Client({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    });
  }

  public async authentication(googleTokenDto: GoogleTokenDto) {
    // verify the token
    const loginTicket = await this.authClient.verifyIdToken({
      idToken: googleTokenDto.token,
    });

    // extract payload
    const payload = loginTicket.getPayload();

    if (!payload || !payload.sub || !payload.email || !payload.name) {
      throw new BadRequestException('Invalid token');
    }

    const { email, sub: googleId, name } = payload;

    // find user in the db
    const user = await this.usersService.findOneByGoogleId(googleId);

    if (user) {
      // if googleid exists, generate the token
      return this.generateTokensProvider.generateTokens(user);
    } else {
      // if not create a new user and generate tokens
      const user = await this.usersService.create({
        email,
        firstName: name?.split(' ')[0],
        lastName: name?.split(' ')[1],
        password: '',
      });
      return this.generateTokensProvider.generateTokens(user);
    }
    // throw unauth exception
  }
}
