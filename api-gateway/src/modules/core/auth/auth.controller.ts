import { Controller, Get, Post, Body, Patch } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { IUser } from './interfaces/user.interface';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { DeviceInfo } from 'src/common/decorators/device-info.decorator';
import { IDeviceInfo } from './interfaces/device-info.interface';
import { ValidRoles } from './interfaces/valid-roles.enum';
import { ClientProxyFood } from 'src/common/proxy/client-proxy';
import { MailMSG } from 'src/common/proxy/constants';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { CreateCustomerUserDto } from 'src/modules/user/dto/create-customer-user.dto';
import { AuthcodeService } from './authcode.service';
import { AUTHCODE_TYPES } from './interfaces/authcode-types.enum';

@Controller('auth')
export class AuthController {

  private clientProxyMail = this._clientProxy.clientProxyMail();

  constructor(
    private readonly authService: AuthService,
    private readonly authcodeService: AuthcodeService,
    private readonly _clientProxy: ClientProxyFood,
  ) {}

  /**
   * * *****************************************
   * *   ENDPOINTS TO USERS WITH ROLE "USER"   *
   * * ***************************************** 
   */

  @Post('sign-up')
  async signUp( 
    @Body() createUserDto: CreateUserDto, 
    @DeviceInfo() deviceInfo: IDeviceInfo 
  ) {
    const user = await this.authService.signUp( createUserDto );
    const urlVerification = await this.authcodeService
      .createAuthcodeUrl( user.user, AUTHCODE_TYPES.verifyAccount, deviceInfo );

    await lastValueFrom( 
      this.clientProxyMail.send( 
        MailMSG.WELCOME_USER, { user: user.user, url: urlVerification }
      )
    .pipe( catchError( error => throwError(() => new RpcException( error.response )))));

    return user;
  }

  @Post('sign-in')
  async signIn( 
    @Body() loginUserDto: LoginUserDto, 
    @DeviceInfo() deviceInfo: IDeviceInfo 
  ) {
    return this.authService.signIn( loginUserDto, deviceInfo );
  }

  @Post('two-step-auth')
  async twoStepAuth( 
    @Body() verifyCodeDto: VerifyCodeDto 
  ) {
    return this.authService.twoStepAuth( verifyCodeDto );
  }

  @Post('resend-code')
  async resendCode( 
    @Body() resendCodeDto: VerifyCodeDto, 
    @DeviceInfo() deviceInfo: IDeviceInfo 
  ) {
    return this.authService.resendCode( resendCodeDto, deviceInfo );
  }

  @Post('forgot-password')
  async forgotPassword( 
    @Body() forgotPasswordDto: ForgotPasswordDto, 
    @DeviceInfo() deviceInfo: IDeviceInfo 
  ) {
    return this.authService.forgotPassword( forgotPasswordDto, deviceInfo );
  }

  @Post('verify-code')
  async verifyCode( 
    @Body() verifyCodeDto: VerifyCodeDto 
  ) {
    return this.authService.verifyCode( verifyCodeDto );
  }

  @Patch('new-password')
  async newPassword( 
    @Body() newPasswordDto: NewPasswordDto, 
    @DeviceInfo() deviceInfo: IDeviceInfo 
  ) {
    return this.authService.newPassword( newPasswordDto, deviceInfo );
  }

  @Get('check-status')
  @Auth([ ValidRoles.admin, ValidRoles.user ])
  async checkAuthStatus( 
    @GetUser() user: IUser 
  ) {
    return this.authService.userToken( user );
  }

   /**
   * * ************************************************
   * * ENDPOINTS TO CREATE USERS WITH ROLE "CUSTOMER" *
   * * ************************************************ 
   */

  @Post('customer/sign-up')
  async customerSignUp( 
    @Body() createCustomerUserDto: CreateCustomerUserDto,
    @DeviceInfo() deviceInfo: IDeviceInfo,
  ) {
    const user = await this.authService.signUpUserCustomer( createCustomerUserDto );
    const urlVerification = await this.authcodeService
      .createAuthcodeUrl( user.user, AUTHCODE_TYPES.verifyAccount, deviceInfo );

    await lastValueFrom( 
      this.clientProxyMail.send( 
        MailMSG.WELCOME_USER, { user: user.user, url: urlVerification }
      )
    .pipe( catchError( error => throwError(() => new RpcException( error.response )))));

    return user;
  }
}