import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    User,
    UserDocument,
} from '../schemas/user.schema';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class MongoUserRepository implements IUserRepository {

    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) { }

    async findByEmail(
        email: string,
    ): Promise<UserEntity | null> {

        const document = await this.userModel
            .findOne({ email })
            .exec();

        return document
            ? this.toEntity(document)
            : null;
    }

    async findById(
        userId: string,
    ): Promise<UserEntity | null> {

        const document = await this.userModel
            .findById(userId)
            .exec();

        return document
            ? this.toEntity(document)
            : null;
    }

    async findByUsername(
        username: string,
    ): Promise<UserEntity | null> {

        const document = await this.userModel
            .findOne({ username })
            .exec();

        return document
            ? this.toEntity(document)
            : null;
    }

    async createUser(
        username: string,
        email: string,
        hashedPassword: string,
    ): Promise<UserEntity> {

        const document = await this.userModel.create({
            username,
            email,
            password: hashedPassword,
        });

        return this.toEntity(document);
    }

    private toEntity(
        document: UserDocument,
    ): UserEntity {

        return {
            id: document._id.toString(),
            username: document.username,
            email: document.email,
            password: document.password,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        };
    }
}