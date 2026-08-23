import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response, Request } from 'express';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { };

    @Post("register")
    @HttpCode(201)
    register(
        @Body() registerDto: RegisterDto,
        @Res({ passthrough: true }) response: Response
    ) {
        return this.authService.register(registerDto, response)
    };

    @Post("login")
    login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) response: Response
    ) {
        return this.authService.login(loginDto, response);
    };

    @Post('refresh')
    async refresh(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response
    ) {
        return this.authService.refresh(request, response);
    };

    @Post('logout')
    logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('refreshToken');

        return {
            message: 'Logged out successfully',
        };
    }
}
