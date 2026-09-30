import type { CreateUrlDto, PaginationQueryDto } from '../dto/create-url.dto';
import type { UrlResponseDto } from '../dto/url-response.dto';

export interface IUrlsService {
  create(userId: string, dto: CreateUrlDto): Promise<UrlResponseDto>;
  findAll(userId: string, query: PaginationQueryDto): Promise<{
    data: UrlResponseDto[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }>;
  redirect(shortCode: string): Promise<string>;
  remove(userId: string, urlId: string): Promise<void>;
}
