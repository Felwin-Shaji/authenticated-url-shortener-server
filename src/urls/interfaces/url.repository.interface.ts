import { UrlDocument } from '../schemas/url.schema';

export interface IUrlRepository {
    
    create(data: {
        userId: string;
        originalUrl: string;
        shortCode: string;
    }): Promise<UrlDocument>;

    findAllByUser(
        userId: string,
        skip: number,
        limit: number,
    ): Promise<UrlDocument[]>;

    countByUser(userId: string): Promise<number>;

    findActiveByShortCode(
        shortCode: string,
    ): Promise<UrlDocument | null>;

    incrementClicks(id: string): Promise<void>;
}