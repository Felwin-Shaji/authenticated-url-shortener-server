import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUrlRepository } from '../interfaces/url.repository.interface';
import { Url, UrlDocument } from '../schemas/url.schema';

@Injectable()
export class MongoUrlRepository implements IUrlRepository {

    constructor(
        @InjectModel(Url.name)
        private readonly urlModel: Model<UrlDocument>,
    ) {}

    async create(data: {
        userId: string;
        originalUrl: string;
        shortCode: string;
    }): Promise<UrlDocument> {

        return this.urlModel.create({
            userId: data.userId,
            originalUrl: data.originalUrl,
            shortCode: data.shortCode,
            clicks: 0,
            isActive: true,
        });
    }

    async findAllByUser(
        userId: string,
        skip: number,
        limit: number,
    ): Promise<UrlDocument[]> {

        return this.urlModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
    }

    async countByUser(userId: string): Promise<number> {

        return this.urlModel.countDocuments({ userId });
    }

    async findActiveByShortCode(
        shortCode: string,
    ): Promise<UrlDocument | null> {

        return this.urlModel.findOne({
            shortCode,
            isActive: true,
        });
    }

    async incrementClicks(id: string): Promise<void> {

        await this.urlModel.updateOne(
            { _id: id },
            {
                $inc: {
                    clicks: 1,
                },
            },
        );
    }
}