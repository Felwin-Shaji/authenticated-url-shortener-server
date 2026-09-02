import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { URL_REPOSITORY } from './interfaces/url.repository.token';

describe('UrlsService', () => {
  let service: UrlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
          provide: URL_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findAllByUser: jest.fn(),
            countByUser: jest.fn(),
            findActiveByShortCode: jest.fn(),
            incrementClicks: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});