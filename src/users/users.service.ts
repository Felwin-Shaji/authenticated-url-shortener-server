import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from './interfaces/user.repository.token';
import type { IUserRepository } from './interfaces/user.repository.interface';
import type { UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {

    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    async findByEmail(email: string,): Promise<UserDocument | null> {
        return this.userRepository.findByEmail(email);
    }

    async findById(userId: string,): Promise<UserDocument | null> {
        return this.userRepository.findById(userId);
    }

    async findByUsername(username: string,): Promise<UserDocument | null> {
        return this.userRepository.findByUsername(username);
    }

    async createUser(username: string, email: string, hashedPassword: string,): Promise<UserDocument> {

        return this.userRepository.createUser(
            username,
            email,
            hashedPassword,
        );
    }
}