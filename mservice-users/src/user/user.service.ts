import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { User } from './entities/user.entity';

import * as argon2 from "argon2";
import { v4 as uuid } from 'uuid';
import { GenericService } from 'src/common/providers/generic.service';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { errorMessage400 } from 'src/common/constants/error.constants';
import { CreateCustomerUserDto } from './dto/create-customer-user.dto';

@Injectable()
export class UserService extends GenericService {

  constructor(
    @InjectModel( User.name ) readonly userModel: PaginateModel<User>,
    private readonly configService: ConfigService,
  ) { 
    super( userModel, configService.get( 'pagination' ), 'UserService' )
  }


  async createUserDto( createUserDto: any ): Promise<User> {
    const { register_type } = createUserDto;

    const user = await this.create<User, any>({
      ...createUserDto,
      uuid: uuid(),
      multifactor_auth: register_type,
      password: await argon2.hash( createUserDto.password ),
    });
      
    return user;
  }

  async createUserCustomerDto( dto: CreateCustomerUserDto ): Promise<User> {
    return await this.create({
      ...dto,
      uuid: uuid(),
      multifactor_auth: 'email',
      password: await argon2.hash( dto.password ),
      roles: ['user', 'customer-apply'],
    });
  }

  async findByEmailOrPhone( payload: any ): Promise<User> {
    let user: User;
    const { email, phone } = payload;
    
    if ( email )
      user = await this.userModel.findOne({ 
        email: { 
          $regex: new RegExp(["^", email, "$"].join(""), "i") 
        } 
      }).select('+password');

    if ( phone )
      user = await this.userModel.findOne({ phone }).select('+password');

    return user;
  }

  async removeAllFilesFrom( type: string, id: string ): Promise<User> {
    await this.findOne( id );
    const user: User = await this.userModel.findOneAndUpdate({ _id: id, [type]: { $exists: true }},{ $unset: { [type]: "" }}, { new: true })

    if ( !user )
      throw new RpcException(
        new BadRequestException( errorMessage400([{
          property: 'user',
          message: `user with id ${ id } don't have ${[ type ]}s`,
        }]))
      );

    return user;
  }

  async removeFileFrom( type: string, id: string, filename: string ): Promise<User> {
    let user: User;
    await this.findOne( id );
    user = await this.userModel.findOneAndUpdate({ _id: id, [type]: { $in: [filename] }},{ $pull: { [type]: filename } },{ new: true });

    if ( !user )
      throw new RpcException(
        new BadRequestException( errorMessage400([{
          property: type,
          message: `image ${ filename } not exists in`,
        }]))
      );

    if ( user[type].length === 0 )
      user = await this.userModel.findOneAndUpdate({ _id: id, [type]: { $exists: true }},{ $unset: { [type]: "" }}, { new: true });

    return user;
  }

  async newPassword( userId: string, password: string ): Promise<User> {
    const updatedUser = await this.update<User, Object>( userId, { password: await argon2.hash( password ) });
    
    return updatedUser;
  }

}
