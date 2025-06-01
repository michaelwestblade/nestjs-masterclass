import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from '../users/users.module';
import { BcryptProvider } from './providers/bcrypt.provider';

@Module({
  controllers: [AuthController],
  imports: [forwardRef(() => UsersModule)],
  providers: [AuthService, BcryptProvider],
  exports: [AuthService],
})
export class AuthModule {}
