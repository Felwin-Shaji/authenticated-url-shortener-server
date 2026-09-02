import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { USER_REPOSITORY } from './interfaces/user.repository.token';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            findByUsername: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});