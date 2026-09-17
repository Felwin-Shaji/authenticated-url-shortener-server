import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {

    findByEmail(
        email: string,
    ): Promise<UserEntity | null>;

    findById(
        userId: string,
    ): Promise<UserEntity | null>;

    findByUsername(
        username: string,
    ): Promise<UserEntity | null>;

    createUser(
        username: string,
        email: string,
        hashedPassword: string,
    ): Promise<UserEntity>;
}