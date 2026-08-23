import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUrlDto, PaginationQueryDto } from './dto/create-url.dto';
import { type AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import type { Response } from 'express';

@Controller('urls')
export class UrlsController {
    constructor(
        private readonly urlsService: UrlsService
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    createUrl(
        @Body() createUrlDto: CreateUrlDto,
        @Req() request: AuthenticatedRequest
    ) {
        console.log('Authenticated user:', request.user);
        return this.urlsService.create(request.user.sub, createUrlDto);
    };

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(
        @Req() request: AuthenticatedRequest,
        @Query() paginationQuery: PaginationQueryDto,
    ) {
        return this.urlsService.findAll(request.user.sub, paginationQuery);
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
