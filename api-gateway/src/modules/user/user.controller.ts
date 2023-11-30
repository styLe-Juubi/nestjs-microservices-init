import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ClientProxyFood } from 'src/common/proxy/client-proxy';
import { CreateUserDto } from './dto/create-user.dto';
import { catchError, lastValueFrom, Observable, throwError } from 'rxjs';
import { IUser } from './interfaces/user.interface';
import { MailMSG, UserMSG } from 'src/common/proxy/constants';
import { UserQueryParamsDto } from './dto/user-query-params.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RpcException } from '@nestjs/microservices';
import { FileService } from '../core/file/file.service';
import { Auth } from '../core/auth/decorators/auth.decorator';
import { ValidRoles } from '../core/auth/interfaces/valid-roles.enum';
import { maxSize, fileFilter } from '../core/file/helpers/file-filter.helper';
import { UserOwner } from 'src/common/guards/user-owner.guard';
import { VerifyAccountParamsDto } from './dto/verify-account.params.dto';
import { AuthcodeService } from '../core/auth/authcode.service';
import { Authcode } from '../core/auth/entities/authcode.entity';
import { errorMessage400 } from 'src/common/constants/error.constants';

@Controller('user')
export class UserController {

    private clientProxyUser = this._clientProxy.clientProxyUser();

    constructor(
        private readonly _clientProxy: ClientProxyFood,
        private readonly fileService: FileService,
        private readonly authcodeService: AuthcodeService,
    ) {}

    @Auth([ ValidRoles.admin ])
    @Post()
    async create( @Body() dto: CreateUserDto ): Promise<Observable<IUser>> { 
        return await lastValueFrom( this.clientProxyUser.send( UserMSG.CREATE, dto )
            .pipe( catchError( error => throwError(() => new RpcException( error.response )))));
    }

    // @Auth([ ValidRoles.admin ])
    @Auth()
    @Get()
    async findAll( @Query() paramsDto: UserQueryParamsDto ): Promise<Observable<PaginateResult<IUser>>> {
        return await lastValueFrom( this.clientProxyUser.send( UserMSG.FIND_ALL, paramsDto )
            .pipe( catchError( error => throwError(() => new RpcException( error.response )))));
    }
    

    @Auth()
    @Get(':userId')
    async findOne( @Param('userId', ParseMongoIdPipe) id: string ): Promise<Observable<IUser>> {
        return await lastValueFrom( this.clientProxyUser.send( UserMSG.FIND_ONE, id )
            .pipe( catchError( error => throwError(() => new RpcException( error.response )))));
    }
    
    // @Auth([ ValidRoles.admin ])
    @Auth()
    @Get('username/:username')
    async findByUsername( @Param('username') username: string ): Promise<Observable<IUser>> {
        return await lastValueFrom( this.clientProxyUser.send( UserMSG.FIND_BY_USERNAME, { username })
            .pipe( catchError( error => throwError(() => new RpcException( error.response )))));
    }

    @Get('verify/verify-account')
    async verifyAccount( 
        @Query() params: VerifyAccountParamsDto
    ) {
        const authCode: Authcode = await this.authcodeService
            .findByFields([
                { field: 'code', value: params.code, type: 'id' },
                { field: 'type', value: params.type, type: 'id' }
            ]);
        if ( !authCode )
            throw new BadRequestException( errorMessage400([{
                property: 'code',
                message: 'The verification code has expired and the account has also been deleted'
            }]));

        const userVerified: IUser = await lastValueFrom(
            this.clientProxyUser.send( 
                UserMSG.VERIFY, authCode.userId
            )
        .pipe( catchError( error => throwError(() => new RpcException( error.response )))));
        
        if ( !userVerified.roles.includes( ValidRoles.customer_apply ))
            return 'bienvenido usuario';
    }

    @Auth([ ValidRoles.admin, ValidRoles.user ], UserOwner )
    @Patch(':userId')
    @UseInterceptors( FileFieldsInterceptor([
        { name: 'avatar', maxCount: 2 },
        { name: 'background', maxCount: 2 },
      ],{ limits: { fileSize: maxSize }, fileFilter: fileFilter }
    ))
    async update(
        @Param('userId', ParseMongoIdPipe) id: string,
        @Body() updateUserDto: UpdateUserDto,
        @UploadedFiles() files: Array<Express.Multer.File[]>
    ): Promise<Observable<IUser>> {

        if ( !files && Object.keys(updateUserDto).length === 0  ) {
            throw new BadRequestException( errorMessage400([{
                property: 'body',
                message: `You must send information to update`
            }]));
        }
        
        let dtoToUpdate = { ...updateUserDto };
        if ( Object.keys(files).length > 0 ) {
            const filesUploaded: any = await this.fileService.uploadFiles( files ); 
            dtoToUpdate = { ...dtoToUpdate, ...filesUploaded };
        }

        return await lastValueFrom(
            this.clientProxyUser.send( 
                UserMSG.UPDATE, { id, dto: dtoToUpdate }
            )
        .pipe( catchError( error => throwError(() => new RpcException( error.response )))));
    }

    @Auth([ ValidRoles.admin, ValidRoles.user ], UserOwner )
    @Delete(':userId')
    async delete( @Param('userId', ParseMongoIdPipe) id: string ): Promise<Observable<IUser>> {
        return await lastValueFrom( this.clientProxyUser.send( UserMSG.DELETE, id )
            .pipe( catchError( error => throwError(() => new RpcException( error.response )))));
    }

    @Auth([ ValidRoles.admin, ValidRoles.user ], UserOwner )
    @Patch('remove-all-files-from/:type/:userId')
    async removeAllFilesFrom( @Param('type') type: string, @Param('userId', ParseMongoIdPipe) id: string ) {
        return await lastValueFrom( this.clientProxyUser.send( UserMSG.REMOVE_ALL_FILES_FROM, { type: type.toLowerCase(), id })
            .pipe( catchError( error => throwError(() => new RpcException( error.response )))));
    }

    @Auth([ ValidRoles.admin, ValidRoles.user ], UserOwner )
    @Patch('remove-file-from/:type/:userId/:filename')
    async removeFileFrom( 
        @Param('type') type: string, 
        @Param('userId', ParseMongoIdPipe) id: string,
        @Param('filename') filename: string,
    ) {
        return await lastValueFrom( this.clientProxyUser.send( UserMSG.REMOVE_FILE_FROM, { type: type.toLowerCase(), id, filename })
            .pipe( catchError( error => throwError(() => new RpcException( error.response )))));
    }

}
