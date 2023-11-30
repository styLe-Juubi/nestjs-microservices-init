import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Authcode } from './entities/authcode.entity';
import { AUTHCODE_TYPES } from './interfaces/authcode-types.enum';
import { IDeviceInfo } from './interfaces/device-info.interface';
import { GenericService } from 'src/common/providers/generic.service';
import { ClientProxyFood } from 'src/common/proxy/client-proxy';
import { lastValueFrom, catchError, throwError } from 'rxjs';
import { MailMSG } from 'src/common/proxy/constants';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthcodeService extends GenericService {

    private clientProxyMail = this._clientProxy.clientProxyMail();
    private apiUrl: string = 
        `${ this.configService.get('apiUrl')}/${ this.configService.get('apiVersion') }`

    constructor(
        @InjectModel( Authcode.name ) readonly authcodeModel: PaginateModel<Authcode>,
        private readonly configService: ConfigService,
        private readonly _clientProxy: ClientProxyFood,
    ) { 
        super( authcodeModel, configService.get( 'pagination' ), 'AuthcodeService' ) 
    }

    async createAuthcodeUrl( user: any, type: AUTHCODE_TYPES, deviceInfo: IDeviceInfo ): Promise<String> {
        const uniqueCode = await this.generateUniqueCode( user._id, type );
        const authCode: Authcode = await this
            .create({ userId: user._id, type, code: uniqueCode, deviceInfo });
        return `${ this.apiUrl }/user/verify/verify-account?code=${ authCode.code }&type=${ authCode.type }`;
    }
    
    /**
     * * Function to create an Authcode
     * @param user 
     * @param type of authcore enum AUTHCODE_TYPES
     * @param deviceInfo come 'os', 'client', 'device' and the location from where the request was made
     * @returns 
     */
    async createAuthcode( user: any, type: AUTHCODE_TYPES, deviceInfo: IDeviceInfo ): Promise<Object> {
        const uniqueCode = await this.generateUniqueCode( user._id, type );
        const authCode: Authcode = await this.create({ userId: user._id, type, code: uniqueCode, deviceInfo });

         /** create resendCode */
         const resendUniqueCode = await this.generateUniqueCode( user._id, type );
         const resendCode: Authcode = await this.create({ userId: user._id, type: AUTHCODE_TYPES.resendCode, code: resendUniqueCode, deviceInfo });

        try {
            const payload = {
                user: {
                    ...user,
                    password: undefined,
                },
                authCode,
                service: user.multifactor_auth,
            }

            if ( type === AUTHCODE_TYPES.twoStepLogin ) 
                await lastValueFrom( this.clientProxyMail.send( MailMSG.TWO_STEP_AUTH, payload )
                    .pipe( catchError( error => throwError(() => new RpcException( error.response )))));
            
            if ( type === AUTHCODE_TYPES.forgotPassword )
                await lastValueFrom( this.clientProxyMail.send( MailMSG.FORGOT_PASSWORD, payload )
                    .pipe( catchError( error => throwError(() => new RpcException( error.response )))));

            if ( type === AUTHCODE_TYPES.verifyAccount ) 
                await lastValueFrom( this.clientProxyMail.send( MailMSG.VERIFY_ACCOUNT, payload )
                    .pipe( catchError( error => throwError(() => new RpcException( error.response )))));

        } catch (error) { 

            throw new InternalServerErrorException(`Server error, can't send authenticactión code, talk with an admin`);
        };

        if ( user.multifactor_auth === 'email' )
            return { 
                ok: true, 
                message: `created authentication code, send to email address: ${ user.email.substring(0,3) }*****@${ user.email.split('@')[1] }, after five minutes code will disappear`,
                email: `${ user.email.substring(0,3) }*****@${ user.email.split('@')[1] }`,
                resendCode: resendCode.code,
            };

        if ( user.multifactor_auth === 'phone' )
            return { 
                ok: true, 
                message: `created authentication code, send to phone number: ********${ String( user.phone ).slice(-2) }, after five minutes code will disappear`,
                phone: `********${ String( user.phone ).slice(-2) }`,
                resendCode: resendCode.code,
            };
    }

    /**
     * * Function to create an unique code, if this exists will be create another untill this doesn't
     * * exists in the database to be unique.
     * @param userId 
     * @param type of authcore enum AUTHCODE_TYPES
     * @returns a string code of 5 characters
     */
    async generateUniqueCode( userId: string, type: AUTHCODE_TYPES ): Promise<string> {

        let codeCreated = await this.generateRandomCode( 5 );

        const recursive = async ( userId: string, code: string ) => {
            let codeFound = await this.findByFields<Authcode>([
                { field: 'code', value: code, type: 'id' },
                { field: 'type', value: type, type: 'id' },
            ]);

            if ( codeFound ) {
                codeCreated = await this.generateRandomCode( 5 );
                await recursive( userId, codeCreated );
            } else {
                return;
            }
        }

        await recursive( userId, codeCreated );

        return codeCreated;
    }

    /**
     * * Function to generate a randome code with 5 characters
     * @param length 
     * @returns code of 5 characters
     */
    async generateRandomCode( length: number ): Promise<string> {
        let code: string = '';
        let characters: string = 'QWERTYUIOPASDFGHJKLZXCVBNM0123456789';
        let charactersLength = characters.length;

        for ( let i = 0; i < length; i++ ) {
            code += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        
        return code;
    }

    /**
     * * Function to delete all authcodes by user
     * @param user 
     * @returns boolean
     */
    async deleteUserAuthcodes( userId: string ): Promise<boolean> {
        const authcodes = await this.authcodeModel.deleteMany({ userId });
        
        if ( !authcodes ) return false;
        return true;
    }
}
