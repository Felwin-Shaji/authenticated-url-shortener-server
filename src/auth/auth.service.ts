import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import type { Response, Request } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async register(registerDto: RegisterDto, response: Response) {
        const { username, email, password } = registerDto;

        const existingEmail = await this.usersService.findByEmail(email);
        if (existingEmail) throw new ConflictException('Email already registered');

        const existingUsername = await this.usersService.findByUsername(username);
        if (existingUsername) throw new ConflictException('Username already taken');

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.usersService.createUser(
            username,
            email,
            hashedPassword,
        );

        const accessToken = await this.generateAccessToken(user._id.toString(), user.username);
        const refreshToken = await this.generateRefreshToken(user._id.toString());

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        };
    };

    async login(loginDto: LoginDto, response: Response) {
        const { email, password } = loginDto;

        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException("user not found");

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );
        if (!isPasswordValid) throw new UnauthorizedException("Invalid password");

        const accessToken = await this.generateAccessToken(user._id.toString(), user.username);
        const refreshToken = await this.generateRefreshToken(user._id.toString());

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        };
    };

    async refresh(request: Request, response: Response) {

        const refreshToken = request.cookies?.refreshToken;
        if (!refreshToken) throw new UnauthorizedException('Refresh token not found');

        const payload = await this.verifyRefreshToken(refreshToken);

        const user = await this.usersService.findById(payload.sub);
        if (!user) throw new UnauthorizedException('User not found');

        const accessToken = await this.generateAccessToken(user._id.toString(), user.username);

        return {
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        };
    }

    private async generateAccessToken(userId: string, username: string,): Promise<string> {

        const options: JwtSignOptions = {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: '15m',
        };

        return this.jwtService.signAsync(
            {
                sub: userId,
                username,
            },
            options,
        );
    }

    private async generateRefreshToken(userId: string,): Promise<string> {
        const options: JwtSignOptions = {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        };

        return this.jwtService.signAsync(
            {
                sub: userId,
            },
            options,
        );
    }

    private async verifyRefreshToken(refreshToken: string) {
        try {
            return await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            })
        } catch {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }
};