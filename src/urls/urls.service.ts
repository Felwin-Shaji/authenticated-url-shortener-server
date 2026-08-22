import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Url, UrlDocument } from './schemas/url.schema';
import { Model } from 'mongoose';
import { CreateUrlDto, PaginationQueryDto } from './dto/create-url.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class UrlsService {
    constructor(
        @InjectModel(Url.name)
        private readonly urlModel: Model<UrlDocument>
    ) { }

    async create(
        userId: string,
        createUrlDto: CreateUrlDto,
    ) {
        const shortCode = randomBytes(4).toString('hex');

        const url = await this.urlModel.create({
            userId,
            originalUrl: createUrlDto.originalUrl,
            shortCode,
            clicks: 0,
            isActive: true,
        });

        const baseUrl = process.env.APP_BASE_URL;

        return {
            id: url._id,
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            shortUrl: `${baseUrl}/urls/${url.shortCode}`,
            clicks: url.clicks,
        };
    }

    async findAll(userId: string, paginationQuery: PaginationQueryDto) {
        const { page = 1, limit = 10 } = paginationQuery;
        const skip = (page - 1) * limit;

        const [urls, totalItems] = await Promise.all([
            this.urlModel
                .find({ userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.urlModel.countDocuments({ userId }),
        ]);

        const baseUrl = process.env.APP_BASE_URL?.replace(/\/$/, '');

        const data = urls.map((url) => ({
            id: url._id,
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            shortUrl: `${baseUrl}/urls/${url.shortCode}`,
            clicks: url.clicks,
            isActive: url.isActive,
            createdAt: url.createdAt,
        }));

        const totalPages = Math.ceil(totalItems / limit);

        return {
            data,
            meta: {
                totalItems,
                itemCount: data.length,
                itemsPerPage: limit,
                totalPages,
                currentPage: page,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }
    async redirect(shortCode: string): Promise<string> {

        const url = await this.urlModel.findOne({
            shortCode,
            isActive: true,
        });

        if (!url) throw new NotFoundException('Short URL not found');


        if (
            url.expiresAt &&
            url.expiresAt <= new Date()
        ) {
            throw new NotFoundException('Short URL has expired',);
        }

        await this.urlModel.updateOne(
            { _id: url._id },
            {
                $inc: {
                    clicks: 1,
                },
            },
        );

        return url.originalUrl;
    }
}
