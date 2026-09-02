import { UrlResponseDto } from "../dto/url-response.dto";
import { UrlDocument } from "../schemas/url.schema";

export class UrlMapper {
    static toDto(url: UrlDocument, baseUrl: string): UrlResponseDto {
        return {
            id: url._id.toString(),
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            shortUrl: `${baseUrl}/urls/${url.shortCode}`,
            clicks: url.clicks,
            isActive: url.isActive,
            createdAt: url.createdAt,
        };
    }
}