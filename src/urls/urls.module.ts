import { Module } from '@nestjs/common';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './schemas/url.schema';
import { AuthModule } from 'src/auth/auth.module';
import { MongoUrlRepository } from './repositories/mongo-url.repository';
import { URL_REPOSITORY } from './interfaces/url.repository.token';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
  ],
  controllers: [UrlsController],
  providers: [
    UrlsService,
    MongoUrlRepository,
    {
      provide: URL_REPOSITORY,
      useExisting: MongoUrlRepository,
    },
  ]
})
export class UrlsModule { }
