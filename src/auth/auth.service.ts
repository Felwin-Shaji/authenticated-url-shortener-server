import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService
    ) { }

    async register(registerDto: RegisterDto) {
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

        return {
            id: user._id,
            username: user.username,
            email: user.email,
        };
    }
};