import { UrlResponseDto } from "../dto/url-response.dto";
import { UrlEntity } from "../entities/url.entity";

export class UrlMapper {
    static toDto(url: UrlEntity, baseUrl: string): UrlResponseDto {
        return {
            id: url.id.toString(),
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            shortUrl: `${baseUrl}/urls/${url.shortCode}`,
            clicks: url.clicks,
            isActive: url.isActive,
            createdAt: url.createdAt,
        };
    }
}