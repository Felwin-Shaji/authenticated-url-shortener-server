import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AUTH_SERVICE } from './interfaces/auth.service.token';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
    })
  ],

  controllers: [AuthController],

  providers: [
    AuthService,

    {
      provide: AUTH_SERVICE,
      useExisting: AuthService
    },
    
    JwtAuthGuard
  ],

  exports: [AUTH_SERVICE, JwtAuthGuard, JwtModule]

})
export class AuthModule { }
