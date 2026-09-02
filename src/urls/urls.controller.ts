import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUrlDto, PaginationQueryDto } from './dto/create-url.dto';
import { type AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import type { Response } from 'express';

@Controller('urls')
export class UrlsController {
    constructor(
        private readonly urlsService: UrlsService
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createUrl(
        @Body() createUrlDto: CreateUrlDto,
        @Req() request: AuthenticatedRequest,
    ) {
        const data = await this.urlsService.create(
            request.user.sub,
            createUrlDto,
        );

        return {
            success: true,
            message: 'URL created successfully',
            data,
        };
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(
        @Req() request: AuthenticatedRequest,
        @Query() paginationQuery: PaginationQueryDto,
    ) {
        const result = await this.urlsService.findAll(
            request.user.sub,
            paginationQuery,
        );

        return {
            success: true,
            message: 'URLs fetched successfully',
            data: result.data,
            meta: result.meta,
        };
    }

    @Get(':shortCode')
    async redirect(
        @Param('shortCode') shortCode: string,
        @Res() response: Response,
    ) {
        const originalUrl =
            await this.urlsService.redirect(
                shortCode,
            );

        return response.redirect(originalUrl);
    }

}
