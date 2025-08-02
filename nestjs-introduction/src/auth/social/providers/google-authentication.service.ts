import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
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

  /**
   * Authenticates a user based on the provided Google token.
   * Verifies the token using Google's authentication services, extracts user details,
   * and either generates tokens for an existing user or creates a new user and generates tokens.
   * @param {GoogleTokenDto} googleTokenDto - An object containing the Google token for authentication.
   * @return {Promise<any>} A promise that resolves to an object containing authentication tokens if the process is successful.
   * @throws {BadRequestException} If the provided token is invalid or missing required payload attributes.
   * @throws {UnauthorizedException} If the authentication process fails due to invalid token or other reasons.
   */
  public async authentication(googleTokenDto: GoogleTokenDto) {
    try {
      // verify the token
      const loginTicket = await this.authClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });

      // extract payload
      const payload = loginTicket.getPayload();

      if (
        !payload ||
        !payload.sub ||
        !payload.email ||
        !payload.given_name ||
        !payload.family_name
      ) {
        throw new BadRequestException('Invalid token');
      }

      const { email, sub: googleId, given_name, family_name } = payload;

      // find user in the db
      const user = await this.usersService.findOneByGoogleId(googleId);

      if (user) {
        // if googleid exists, generate the token
        return this.generateTokensProvider.generateTokens(user);
      } else {
        // if not create a new user and generate tokens
        const newUser = await this.usersService.createGoogleUser({
          googleId,
          email,
          firstName: given_name,
          lastName: family_name,
        });

        return this.generateTokensProvider.generateTokens(newUser);
      }
    } catch (error) {
      throw new UnauthorizedException(error, {
        description: 'Invalid token',
      });
    }
  }
}
