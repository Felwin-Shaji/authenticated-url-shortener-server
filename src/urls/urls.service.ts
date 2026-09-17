import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUrlDto, PaginationQueryDto } from './dto/create-url.dto';
import { randomBytes } from 'crypto';
import { URL_REPOSITORY } from './interfaces/url.repository.token';
import type { IUrlRepository } from './interfaces/url.repository.interface';
import { UrlMapper } from './mapper/urls.mapper';

@Injectable()
export class UrlsService {
    constructor(
        @Inject(URL_REPOSITORY)
        private readonly _urlRepository: IUrlRepository,
    ) { }

    async create(
        userId: string,
        createUrlDto: CreateUrlDto,
    ) {
        const existingUrl = await this._urlRepository.findByUserAndOriginalUrl(
            userId,
            createUrlDto.originalUrl,
        );

        if (existingUrl) throw new ConflictException('This URL has already been shortened');

        const shortCode = randomBytes(4).toString('hex');

        const url = await this._urlRepository.create({
            userId,
            originalUrl: createUrlDto.originalUrl,
            shortCode,
        });

        const baseUrl = process.env.APP_BASE_URL!.replace(/\/$/, '');

        return UrlMapper.toDto(url, baseUrl);
    }

    async findAll(userId: string, paginationQuery: PaginationQueryDto) {
        const { page = 1, limit = 10 } = paginationQuery;
        const skip = (page - 1) * limit;

        const [urls, totalItems] = await Promise.all([
            this._urlRepository.findAllByUser(
                userId,
                skip,
                limit,
            ),

            this._urlRepository.countByUser(userId),
        ]);

        const baseUrl = process.env.APP_BASE_URL!.replace(/\/$/, '');

        const data = urls.map((url) => UrlMapper.toDto(url, baseUrl));

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

        const url = await this._urlRepository.findActiveByShortCode(
            shortCode,
        );

        if (!url) throw new NotFoundException('Short URL not found');

        if (
            url.expiresAt &&
            url.expiresAt <= new Date()
        ) {
            throw new NotFoundException('Short URL has expired',);
        }

        await this._urlRepository.incrementClicks(
            url.id.toString(),
        );
        return url.originalUrl;
    };

    async remove(
        userId: string,
        urlId: string,
    ): Promise<void> {

        const removed = await this._urlRepository.remove(
            userId,
            urlId,
        );

        if (!removed) {
            throw new NotFoundException('URL not found');
        }
    }
}
