import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: User.name, useFactory: () => ( UserSchema )},
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [MongooseModule, UserService],
})
export class UserModule {}
