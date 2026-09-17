import { UrlEntity } from '../entities/url.entity';

export interface IUrlRepository {

    create(data: {
        userId: string;
        originalUrl: string;
        shortCode: string;
    }): Promise<UrlEntity>;

    findAllByUser(
        userId: string,
        skip: number,
        limit: number,
    ): Promise<UrlEntity[]>;

    findByUserAndOriginalUrl(
        userId: string,
        originalUrl: string,
    ): Promise<UrlEntity | null>;

    countByUser(userId: string): Promise<number>;

    findActiveByShortCode(
        shortCode: string,
    ): Promise<UrlEntity | null>;

    incrementClicks(id: string): Promise<void>;

    remove(
        userId: string,
        urlId: string,
    ): Promise<boolean>;
}