import { Controller, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { UserMSG } from 'src/common/constants';
import { ParseQueryTypes } from 'src/common/pipes/parse-query-types.pipe';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { EmailOrPhoneDto } from './dto/email-phone.dto';
import { RemoveFilesFromDto } from './dto/remove-files-from.dto';
import { RemoveFileFromDto } from './dto/remove-file-from.dto';
import { UpdateUserPayloadDto } from './dto/update-payload.dto';
import { UsernameDto } from './dto/username.dto';
import { IUserQueryParams } from './interfaces/user-query-params.interface';
import { CreateCustomerUserDto } from './dto/create-customer-user.dto';
import { AcceptedCustomerRole } from './dto/accepted-customer-role.dto';

@Controller()
export class UserController {

  constructor(
    private readonly userService: UserService
  ) {}

  @MessagePattern( UserMSG.CREATE )
  async create( @Payload() payload: CreateUserDto ) {
    return this.userService.createUserDto( payload );
  }

  @MessagePattern( UserMSG.CREATE_USER_CUSTOMER )
  async createUserCustomer( @Payload() payload: CreateCustomerUserDto ) {
    return this.userService.createUserCustomerDto( payload );
  }

  @MessagePattern( UserMSG.FIND_ALL )
  async findAll( @Payload( ParseQueryTypes ) payload: IUserQueryParams ) {
    return this.userService.findAll<User, IUserQueryParams>( payload );
  }

  @MessagePattern( UserMSG.FIND_ONE )
  async findOne( @Payload( ParseMongoIdPipe ) payload: string ) {
    return this.userService.findOne( payload );
  }

  @MessagePattern( UserMSG.FIND_BY_USERNAME )
  async findByUsername( @Payload() payload: UsernameDto ) {
    const user = await this.userService
      .findByFields<User>([{ field: 'username', value: payload.username, type: 'id' }]);
    
    if ( !user )
      throw new RpcException(
        new NotFoundException(`user with username "${ payload.username }" not found`)
      );
    return user;
  }

  @MessagePattern( UserMSG.FIND_BY_EMAIL_OR_PHONE )
  async findByEmailOrPhone( @Payload() payload: EmailOrPhoneDto ) {
    return this.userService.findByEmailOrPhone( payload );
  }

  @MessagePattern( UserMSG.UPDATE )
  async update( @Payload() payload: UpdateUserPayloadDto ) {
    return await this.userService.update( payload.id, payload.dto );
  }

  @MessagePattern( UserMSG.ACCEPTED_CUSTOMER_ROLE )
  async acceptedCustomerRole( @Payload() payload: AcceptedCustomerRole ) {
    return await this.userService.update( payload.id, payload.dto );
  }

  @MessagePattern( UserMSG.VERIFY )
  async verifyCustomer( @Payload( ParseMongoIdPipe ) payload: string ) {
    return await this.userService.update( payload, { verified: true });
  }

  @MessagePattern( UserMSG.NEW_PASSWORD )
  async newPassword( @Payload() payload: NewPasswordDto ) {
    const { id, password } = payload;
    return this.userService.newPassword( id, password );
  }

  @MessagePattern( UserMSG.DELETE )
  async delete( @Payload( ParseMongoIdPipe ) id: string ) {
    return this.userService.delete( id );
  }

  @MessagePattern( UserMSG.REMOVE_ALL_FILES_FROM )
  async removeAllFilesFrom( @Payload() payload: RemoveFilesFromDto ) {
    return this.userService.removeAllFilesFrom( payload.type.toLowerCase(), payload.id );
  }

  @MessagePattern( UserMSG.REMOVE_FILE_FROM )
  async removeFileFrom( @Payload() payload: RemoveFileFromDto ) {
    return this.userService.removeFileFrom( payload.type.toLowerCase(), payload.id, payload.filename );
  }
}
