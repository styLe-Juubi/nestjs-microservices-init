import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MULTIFACTOR_AUTH_TYPES } from 'src/common/enums/multifactor-auth.enum';
import { Twilio } from 'twilio';
import { ITwilioSettings } from './interfaces/twilio-settings.interface';
import { IUser } from 'src/common/interfaces/user.interface';
import { IAuthcode } from 'src/common/interfaces/authcode.interface';
import { IDeviceInfo } from 'src/common/interfaces/device-info.interface';
import { REQUEST_STATUS_TYPES } from 'src/common/enums/request-status-types.enum';
import { ICustomerCreated } from './interfaces/customer-created.interface';
import { IReceiptGenerated } from './interfaces/receipt-generated.interface';

@Injectable()
export class MailService {

    private logger = new Logger('MailService');
    private twilioSettings: ITwilioSettings = this.configService.get('smsService');
    private client: Twilio;

    constructor(
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService
    ) { 
        this.client = new Twilio( this.twilioSettings.accountSid, this.twilioSettings.authToken );
    }

    /**
     * * Function to send message of welcome to the user
     * @param user 
     * @param service is the type mail service, email or phone
     */
    async welcomeUser( 
        user: IUser,
        service: MULTIFACTOR_AUTH_TYPES,
        verificationUrl: string,
    ): Promise<boolean> {
        
        try {
            if ( service === 'email' )
            await this.mailerService.sendMail({
                to: user.email, // list of receivers
                subject: `Bienvenido a la plataforma !`, // Subject line
                template: 'welcome',
                context: {
                    username: user.username,
                    url: verificationUrl,
                },
            });

            if ( service === 'phone' ) {
                const { messagingServiceSid } = this.twilioSettings;

                await this.client.messages.create({
                    messagingServiceSid,
                    to: `+${ user.country_code }${ user.phone }`,
                    body: `Welcome ${ user.username }, your registration in the app has been successful`,
                });
            }

            return true;
        } catch (error) { 
            this.handleExceptions( error );
            return false; 
        }
    }


    /**
     * * Function to send the login code to the user OAuth
     * @param user 
     * @param authcode 
     * @param service 
     */
    async twoStepAuth( 
        user: IUser, 
        authcode: IAuthcode, 
        service: MULTIFACTOR_AUTH_TYPES 
    ): Promise<boolean> { 

        try {
            const timezone = 'Timezone ' + authcode.deviceInfo.from.timezone.split('/')[0] + ' - ' + authcode.deviceInfo.from.timezone.split('/')[1] || '';

            if ( service === 'email' )
            await this.mailerService.sendMail({
                to: user.email, // list of receivers
                subject: `Two-step authentication, access code generated ${ authcode.code }`, // Subject line
                template: 'access-oauth',
                context: {
                    username: user.username,
                    codeLetter0: authcode.code.split('')[0],
                    codeLetter1: authcode.code.split('')[1],
                    codeLetter2: authcode.code.split('')[2],
                    codeLetter3: authcode.code.split('')[3],
                    codeLetter4: authcode.code.split('')[4],
                    region: authcode.deviceInfo.from.region || '',
                    city: authcode.deviceInfo.from.city || '',
                    country: authcode.deviceInfo.from.country || '',
                    timezone,
                    os: authcode.deviceInfo.os,
                    device: authcode.deviceInfo.device,
                    client: authcode.deviceInfo.client,
                    date: this.getFormattedDate( authcode.createdAt )
                },
            });

            if ( service === 'phone' ) {
                const { messagingServiceSid } = this.twilioSettings;

                await this.client.messages.create({
                    messagingServiceSid,
                    to: `+${ user.country_code }${ user.phone }`,
                    body: `Two-step authentication, access code generated ${ authcode.code }, From ${ ( authcode.deviceInfo.from.region ) && authcode.deviceInfo.from.region }, ${ ( authcode.deviceInfo.from.city ) && authcode.deviceInfo.from.city }, ${ ( authcode.deviceInfo.from.country ) && authcode.deviceInfo.from.country }, ${ ( authcode.deviceInfo.from.timezone ) && timezone }, use this code to change your password. Device info ${ authcode.deviceInfo.os }, ${ authcode.deviceInfo.device }, ${ authcode.deviceInfo.client }, ${ this.getFormattedDate( authcode.createdAt )}`,
                });
            }

            return true;
        } catch (error) {

            this.handleExceptions( error );
            return false;
        }
    }

    /**
     * * Function to send a code to create a new password
     * @param user 
     * @param authcode 
     * @param service 
     */
    async forgotPassword( user: IUser, authcode: IAuthcode, service: MULTIFACTOR_AUTH_TYPES ): Promise<boolean> {

        try {
            const timezone = 'Timezone ' + authcode.deviceInfo.from.timezone.split('/')[0] + ' - ' + authcode.deviceInfo.from.timezone.split('/')[1] || '';

            if ( service === 'email' ) 
            await this.mailerService.sendMail({
                to: user.email, // list of receivers
                subject: `Created authentication code: ${ authcode.code }, use this code to change your password`, // Subject line
                template: 'forgot-password',
                context: {
                    username: user.username,
                    codeLetter0: authcode.code.split('')[0],
                    codeLetter1: authcode.code.split('')[1],
                    codeLetter2: authcode.code.split('')[2],
                    codeLetter3: authcode.code.split('')[3],
                    codeLetter4: authcode.code.split('')[4],
                    region: authcode.deviceInfo.from.region || '',
                    city: authcode.deviceInfo.from.city || '',
                    country: authcode.deviceInfo.from.country || '',
                    timezone,
                    os: authcode.deviceInfo.os,
                    device: authcode.deviceInfo.device,
                    client: authcode.deviceInfo.client,
                    date: this.getFormattedDate( authcode.createdAt )
                },
            });

            if ( service === 'phone' ) {
                const { messagingServiceSid } = this.twilioSettings;

                await this.client.messages.create({
                    messagingServiceSid,
                    to: `+${ user.country_code }${ user.phone }`,
                    body: `Forgot password, restore code ${ authcode.code }, From ${ ( authcode.deviceInfo.from.region ) && authcode.deviceInfo.from.region }, ${ ( authcode.deviceInfo.from.city ) && authcode.deviceInfo.from.city }, ${ ( authcode.deviceInfo.from.country ) && authcode.deviceInfo.from.country }, ${ ( authcode.deviceInfo.from.timezone ) && timezone }, use this code to change your password. Device info ${ authcode.deviceInfo.os }, ${ authcode.deviceInfo.device }, ${ authcode.deviceInfo.client }, ${ this.getFormattedDate( authcode.createdAt )}`,
                });
            }

            return true;
        } catch (error) { 
            
            this.handleExceptions( error );
            return false;
        }
    }

    /**
     * * Function to send a message that user's password was reset
     * @param user 
     * @param deviceInfo 
     * @param service 
     */
    async newPassword( 
        user: IUser, 
        deviceInfo: IDeviceInfo, 
        service: MULTIFACTOR_AUTH_TYPES 
    ): Promise<boolean> {

        try {
            const timezone = 'Timezone ' + deviceInfo.from.timezone.split('/')[0] + ' - ' + deviceInfo.from.timezone.split('/')[1] || '';

            if ( service === 'email' )
                await this.mailerService.sendMail({
                    to: user.email, // list of receivers
                    subject: `Password restore successfully`, // Subject line
                    template: 'new-password',
                    context: {
                        username: user.username,
                        region: deviceInfo.from.region || '',
                        city: deviceInfo.from.city || '',
                        country: deviceInfo.from.country || '',
                        timezone,
                        os: deviceInfo.os,
                        device: deviceInfo.device,
                        client: deviceInfo.client,
                        date: this.getFormattedDate( new Date() )
                    },
                });
    
            if ( service === 'phone' ) {
                const { messagingServiceSid } = this.twilioSettings;
    
                await this.client.messages.create({
                    messagingServiceSid,
                    to: `+${ user.country_code }${ user.phone }`,
                    body: `New password generated, From ${ ( deviceInfo.from.region ) && deviceInfo.from.region }, ${ ( deviceInfo.from.city ) && deviceInfo.from.city }, ${ ( deviceInfo.from.country ) && deviceInfo.from.country }, ${ ( deviceInfo.from.timezone ) && timezone }, Device info ${ deviceInfo.os }, ${ deviceInfo.device }, ${ deviceInfo.client }, ${ this.getFormattedDate( new Date() )}`,
                });
            }

            return true;
         } catch (error) { 

            this.handleExceptions( error );
            return false;
        }
    }

    /**
     * * Function to send a message that user's password was reset
     * @param user 
     * @param deviceInfo 
     * @param service 
     */
    async verifyAccount( 
        user: IUser, 
        authcode: IAuthcode, 
        service: MULTIFACTOR_AUTH_TYPES 
    ) { 
        try {
            const timezone = 'Timezone ' + authcode.deviceInfo.from.timezone.split('/')[0] + ' - ' + authcode.deviceInfo.from.timezone.split('/')[1] || '';

            if ( service === 'email' ) 
            await this.mailerService.sendMail({
                to: user.email, // list of receivers
                subject: `Created authentication code: ${ authcode.code }, use this code to change your password`, // Subject line
                template: 'forgot-password',
                context: {
                    username: user.username,
                    codeLetter0: authcode.code.split('')[0],
                    codeLetter1: authcode.code.split('')[1],
                    codeLetter2: authcode.code.split('')[2],
                    codeLetter3: authcode.code.split('')[3],
                    codeLetter4: authcode.code.split('')[4],
                    region: authcode.deviceInfo.from.region || '',
                    city: authcode.deviceInfo.from.city || '',
                    country: authcode.deviceInfo.from.country || '',
                    timezone,
                    os: authcode.deviceInfo.os,
                    device: authcode.deviceInfo.device,
                    client: authcode.deviceInfo.client,
                    date: this.getFormattedDate( authcode.createdAt )
                },
            });

            if ( service === 'phone' ) {
                const { messagingServiceSid } = this.twilioSettings;

                await this.client.messages.create({
                    messagingServiceSid,
                    to: `+${ user.country_code }${ user.phone }`,
                    body: `Forgot password, restore code ${ authcode.code }, From ${ ( authcode.deviceInfo.from.region ) && authcode.deviceInfo.from.region }, ${ ( authcode.deviceInfo.from.city ) && authcode.deviceInfo.from.city }, ${ ( authcode.deviceInfo.from.country ) && authcode.deviceInfo.from.country }, ${ ( authcode.deviceInfo.from.timezone ) && timezone }, use this code to change your password. Device info ${ authcode.deviceInfo.os }, ${ authcode.deviceInfo.device }, ${ authcode.deviceInfo.client }, ${ this.getFormattedDate( authcode.createdAt )}`,
                });
            }

            return true;
        } catch (error) { 
            
            this.handleExceptions( error );
            return false;
        }
    }

    /**
     * * Function to send a request for customer role
     *  @param user
     */
    async sendRequesCutomerRole(
        user: IUser,
    ) {
        try {
            
            await this.mailerService.sendMail({
                to: user.email, // list of receivers
                subject: `Se ha enviado una solicitud para ser uno de nuestros colaboradores !`, // Subject line
                template: `request-role-customer`,
                context: {
                    name: user.name,
                    surname: user.surname,
                },
            });

            const { messagingServiceSid } = this.twilioSettings;
            await this.client.messages.create({
                messagingServiceSid,
                to: `+${ user.country_code }${ user.phone }`,
                body: `Hola ${ user.name } ${ user.surname }, te informamos que se ha enviado una solicitud para ser uno de nuestros colaboradores !`,
            });

            return true;
        } catch (error) { 
            this.handleExceptions( error );
            return false; 
        }
    }

    /**
     * * Function to send a response for the request of customer role
     * @param user
     * @param status
     */
    async requestCustomerRole(
        user: IUser,
        status: REQUEST_STATUS_TYPES,
    ) {
        try {
            
            await this.mailerService.sendMail({
                to: user.email, // list of receivers
                subject: `Estado de solicitud para ser colaborador en Food App: ${ status.toUpperCase() } !`, // Subject line
                template: `${ status }-role-customer`,
                context: {
                    name: user.name,
                    surname: user.surname,
                },
            });

            const { messagingServiceSid } = this.twilioSettings;
            await this.client.messages.create({
                messagingServiceSid,
                to: `+${ user.country_code }${ user.phone }`,
                body: `Hola ${ user.name } ${ user.surname }, te informamos que la solicitud enviada para ser uno de nuestros colaboradores se encuentra en estado: ${ status.toUpperCase() }`,
            });

            return true;
        } catch (error) { 
            this.handleExceptions( error );
            return false; 
        }
    }

    /**
     * * function to send an email notifying the creation 
     * * and payment method of a business
     * @param payload with : User, Plan, Customer and Payment.
     */
    async customerCreated(
        payload: ICustomerCreated,
    ) {
        let { user, plan, customer, payment } = payload;
        switch ( true ) {
            case plan.pay_each === 'weekly':
                plan.pay_each = 'Semanalmente cada 7 dias'
                
                break;
            case plan.pay_each === 'monthly':
                plan.pay_each = 'Mensualmente cada 30 dias'
                    
                break;
            case plan.pay_each === 'quarterly':
                plan.pay_each = 'Trimestalmente cada 90 dias'
                        
                break;
        
            default:
                break;
        }

        payment = {
            ...payment,
            ...( payment.status === 'pending' ) &&
                { status: 'Pendiente' },
            ...( payment.payment_method === 'cash' ) ?
                    { payment_method: 'Efectivo' } :
                ( payment.payment_method === 'card' ) ?
                    { payment_date: 'Tarjeta de debito / credito' } :
                ( payment.payment_method === 'transfer' ) &&
                    { payment_method: 'Transferencia' },
            payment_date: this.getFormattedDate( new Date( payment.payment_date ), false ),
            payday_limit: this.getFormattedDate( new Date( payment.payday_limit ), false ),
            plan_start_date: this.getFormattedDate( new Date( payment.plan_start_date ), false ),
        }

        try {
            
            await this.mailerService.sendMail({
                to: user.email, // list of receivers
                subject: `Se ha registrado exitosamente su negocio '${ customer.name }'!`, // Subject line
                template: `created-customer`,
                context: {
                    name: user.name,
                    surname: user.surname,
                    customer_name: customer.name,
                    customer_location: customer.location,
                    plan_name: plan.name,
                    plan_description: plan.description,
                    plan_price: plan.price,
                    plan_pay_each: plan.pay_each,
                    payment_method: payment.payment_method,
                    payment_status: payment.status,
                    payment_start_plan_date: payment.plan_start_date,
                    payment_date: payment.payment_date,
                    payment_payday_limit: payment.payday_limit,
                    payment_url: payment.payment_url,
                },
            });

            return true;
        } catch (error) { 
            this.handleExceptions( error );
            return false; 
        }
    }

    /**
     * * Function to send a receipt of the payment to the user
     * @param payload
     */
    async receiptGenerated(
        payload: IReceiptGenerated,
    ) {
        let { user, customer, payment } = payload;
        switch ( true ) {
            case payment.plan.pay_each === 'weekly':
                payment.plan.pay_each = 'Semanalmente cada 7 dias'
                
                break;
            case payment.plan.pay_each === 'monthly':
                payment.plan.pay_each = 'Mensualmente cada 30 dias'
                    
                break;
            case payment.plan.pay_each === 'quarterly':
                payment.plan.pay_each = 'Trimestalmente cada 90 dias'
                        
                break;
        
            default:
                break;
        }

        payment = {
            ...payment,
            ...( payment.payment_method === 'cash' ) ?
                    { payment_method: 'Efectivo' } :
                ( payment.payment_method === 'card' ) ?
                    { payment_date: 'Tarjeta de debito / credito' } :
                ( payment.payment_method === 'transfer' ) &&
                    { payment_method: 'Transferencia' },
            payment_date: this.getFormattedDate( new Date( payment.payment_date ), false ),
            payday_limit: this.getFormattedDate( new Date( payment.payday_limit ), false ),
            plan_start_date: this.getFormattedDate( new Date( payment.plan_start_date ), false ),
        }

        try {
            
            await this.mailerService.sendMail({
                to: user.email, // list of receivers
                subject: `Se ha procesado exitosamente el pago del plan para su negocio '${ customer.name }'!`, // Subject line
                template: `receipt-generated`,
                context: {
                    name: user.name,
                    surname: user.surname,
                    customer_name: customer.name,
                    customer_location: customer.location,
                    plan_name: payment.plan.name,
                    plan_description: payment.plan.description,
                    plan_price: payment.plan.price,
                    plan_pay_each: payment.plan.pay_each,
                    payment_method: payment.payment_method,
                    payment_start_plan_date: payment.plan_start_date,
                    payment_made_date: payment.payment_made_date,
                },
            });

            return true;
        } catch (error) { 
            this.handleExceptions( error );
            return false; 
        }
    }
    /**
     * * Function to format the date, example: '2022-10-05 19:55:26'
     * @param date 
     * @returns 
     */
    private getFormattedDate( date: Date, time: boolean = true ): string {
        date = new Date();
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let day  = ("0" + (date.getDate())).slice(-2);
        let year = date.getFullYear();
        let hour =  ("0" + (date.getHours())).slice(-2);
        let min =  ("0" + (date.getMinutes())).slice(-2);
        let seg = ("0" + (date.getSeconds())).slice(-2);

        if ( !time )
            return month + "-" + day + "-" + year;
        
        return month + "-" + day + "-" + year + "  " + hour + ":" +  min + ":" + seg;
    }

    /**
     * * Function to handle the errors 
     * @param error 
     */
    async handleExceptions( error: any ): Promise<void> {
        this.logger.error( error );
    }
}
