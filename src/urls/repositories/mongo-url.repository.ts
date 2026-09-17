import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUrlRepository } from '../interfaces/url.repository.interface';
import { Url, UrlDocument } from '../schemas/url.schema';
import { UrlEntity } from '../entities/url.entity';

@Injectable()
export class MongoUrlRepository implements IUrlRepository {

    constructor(
        @InjectModel(Url.name)
        private readonly urlModel: Model<UrlDocument>,
    ) { }

    async create(data: {
        userId: string;
        originalUrl: string;
        shortCode: string;
    }): Promise<UrlEntity> {

        const document = await this.urlModel.create({
            userId: data.userId,
            originalUrl: data.originalUrl,
            shortCode: data.shortCode,
            clicks: 0,
            isActive: true,
        })

        return this.toEntity(document);
    }

    async findAllByUser(
        userId: string,
        skip: number,
        limit: number,
    ): Promise<UrlEntity[]> {

        const documents = await this.urlModel
            .find({ userId, isActive: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return documents.map((ele) => this.toEntity(ele));
    }

    async findByUserAndOriginalUrl(
        userId: string,
        originalUrl: string,
    ): Promise<UrlEntity | null> {

        const document = await this.urlModel.findOne({
            userId,
            originalUrl,
            isActive: true,
        }).exec();

        return document ? this.toEntity(document) : null;
    }

    async countByUser(userId: string): Promise<number> {

        return this.urlModel.countDocuments({ userId, isActive: true, });
    }

    async findActiveByShortCode(
        shortCode: string,
    ): Promise<UrlEntity | null> {

        const document = await this.urlModel.findOne({
            shortCode,
            isActive: true,
        }).exec();

        return document ? this.toEntity(document) : null;
    }

    async incrementClicks(id: string): Promise<void> {

        await this.urlModel.updateOne(
            { _id: id, isActive: true, },
            {
                $inc: {
                    clicks: 1,
                },
            },
        )
    }

    async remove(
        userId: string,
        urlId: string,
    ): Promise<boolean> {

        const result = await this.urlModel.updateOne(
            {
                _id: urlId,
                userId,
                isActive: true,
            },
            {
                $set: {
                    isActive: false,
                },
            },
        )

        return result.modifiedCount > 0;
    }

    private toEntity(document: UrlDocument): UrlEntity {
        return {
            id: document._id.toString(),
            userId: document.userId.toString(),
            originalUrl: document.originalUrl,
            shortCode: document.shortCode,
            clicks: document.clicks,
            isActive: document.isActive,
            expiresAt: document.expiresAt,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        }
    }
}