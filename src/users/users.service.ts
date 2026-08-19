import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>
    ) { }

    async findByEmail(email: string): Promise<UserDocument | null> {
        const user = this.userModel.findOne({ email }).exec();

        console.log(`User found with email ${email}:`, user);

        return user;
    };

    async findByUsername(username: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ username }).exec();
    }

    async createUser(username: string, email: string, hashedPassword: string): Promise<UserDocument> {

        const user = new this.userModel({
            username,
            email,
            password: hashedPassword,
        });

        return user.save();
    };


}
