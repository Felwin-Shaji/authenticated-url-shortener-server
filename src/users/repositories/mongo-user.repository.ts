import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    User,
    UserDocument,
} from '../schemas/user.schema';
import { IUserRepository } from '../interfaces/user.repository.interface';

@Injectable()
export class MongoUserRepository
    implements IUserRepository {

    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) { }

    async findByEmail(
        email: string,
    ): Promise<UserDocument | null> {

        return this.userModel
            .findOne({ email })
            .exec();
    }

    async findById(
        userId: string,
    ): Promise<UserDocument | null> {

        return this.userModel
            .findById(userId)
            .exec();
    }

    async findByUsername(
        username: string,
    ): Promise<UserDocument | null> {

        return this.userModel
            .findOne({ username })
            .exec();
    }

    async createUser(
        username: string,
        email: string,
        hashedPassword: string,
    ): Promise<UserDocument> {

        const user = new this.userModel({
            username,
            email,
            password: hashedPassword,
        });

        return user.save();
    }
}