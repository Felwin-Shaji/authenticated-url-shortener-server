import { Body, Controller, HttpCode, Inject, Post, Req, Res } from '@nestjs/common';
import type { IAuthService } from './interfaces/auth.service.interface';
import { AUTH_SERVICE } from './interfaces/auth.service.token';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response, Request } from 'express';


@Controller('auth')
export class AuthController {
    constructor(
        @Inject(AUTH_SERVICE)
        private readonly authService: IAuthService
    ) { };

    @Post('register')
    @HttpCode(201)
    async register(
        @Body() registerDto: RegisterDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const data = await this.authService.register(
            registerDto,
            response,
        );

        return {
            success: true,
            message: 'Registration successful',
            data,
        };
    }

    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const data = await this.authService.login(
            loginDto,
            response,
        );

        return {
            success: true,
            message: 'Login successful',
            data,
        };
    }

    @Post('refresh')
    async refresh(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        const data = await this.authService.refresh(
            request,
            response,
        );

        console.log('Refresh token response:', data);

        return {
            success: true,
            message: 'Token refreshed successfully',
            data,
        };
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('refreshToken');

        return {
            success: true,
            message: 'Logged out successfully',
            data: null,
        };
    }
}
