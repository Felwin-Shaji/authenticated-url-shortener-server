export interface UrlEntity {
    id: string;
    userId: string;
    originalUrl: string;
    shortCode: string;
    clicks: number;
    isActive: boolean;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
};