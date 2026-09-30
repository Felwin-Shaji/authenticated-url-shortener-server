import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { MongoUserRepository } from './repositories/mongo-user.repository';
import { USER_REPOSITORY } from './interfaces/user.repository.token';
import { USER_SERVICE } from './interfaces/user.service.token';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [
    UsersService,
    { provide: USER_SERVICE, useExisting: UsersService },
    MongoUserRepository,
    {
      provide: USER_REPOSITORY,
      useExisting: MongoUserRepository,
    },
  ],
  exports: [USER_SERVICE],
})
export class UsersModule { }
