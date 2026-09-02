import type { UserDocument } from '../schemas/user.schema';

export interface IUserRepository {

    findByEmail(
        email: string,
    ): Promise<UserDocument | null>;

    findById(
        userId: string,
    ): Promise<UserDocument | null>;

    findByUsername(
        username: string,
    ): Promise<UserDocument | null>;

    createUser(
        username: string,
        email: string,
        hashedPassword: string,
    ): Promise<UserDocument>;
}