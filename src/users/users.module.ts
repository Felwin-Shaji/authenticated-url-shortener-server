import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { MongoUserRepository } from './repositories/mongo-user.repository';
import { USER_REPOSITORY } from './interfaces/user.repository.token';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [
    UsersService,
    MongoUserRepository,
    {
      provide: USER_REPOSITORY,
      useExisting: MongoUserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule { }
