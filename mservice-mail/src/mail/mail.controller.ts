import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MailMSG } from 'src/common/constants';
import { MailService } from './mail.service';
import { IWelcomeUser } from './interfaces/welcome-user.interface';
import { IArgs } from './interfaces/args.interface';
import { INewPassword } from './interfaces/new-password.interface';
import { IRequestCustomerRole } from './interfaces/request-customer-role.interface';
import { IUser } from 'src/common/interfaces/user.interface';
import { ICustomerCreated } from './interfaces/customer-created.interface';
import { IReceiptGenerated } from './interfaces/receipt-generated.interface';

@Controller('mail')
export class MailController {

    constructor(
        private readonly mailService: MailService,
    ) {}

    @MessagePattern( MailMSG.WELCOME_USER )
    async welcomeUser( 
        @Payload() payload: IWelcomeUser 
    ): Promise<boolean> {
        const { url, user } = payload;
        return this.mailService.welcomeUser( user, user.multifactor_auth, url );
    }

    @MessagePattern( MailMSG.TWO_STEP_AUTH )
    async twoStepAuth( 
        @Payload() payload: IArgs 
    ): Promise<boolean> {
        const { user, authCode, service } = payload;
        return this.mailService.twoStepAuth( user, authCode, service );
    }

    @MessagePattern( MailMSG.FORGOT_PASSWORD )
    async forgotPassword( 
        @Payload() payload: IArgs 
    ): Promise<boolean> {
        const { user, authCode, service } = payload;
        return this.mailService.forgotPassword( user, authCode, service );
    }

    @MessagePattern( MailMSG.NEW_PASSWORD ) 
    async newPassword( 
        @Payload() payload: INewPassword 
    ): Promise<boolean> {
        const { user, deviceInfo, service } = payload;
        return this.mailService.newPassword( user, deviceInfo, service );
    }

    @MessagePattern( MailMSG.SEND_REQUEST_CUSTOMER_ROLE )
    async sendRequesCutomerRole( 
        @Payload() payload: IUser 
    ) {
        return this.mailService.sendRequesCutomerRole( payload );
    }

    @MessagePattern( MailMSG.REQUEST_CUSTOMER_ROLE )
    async requestCustomerRole( 
        @Payload() payload: IRequestCustomerRole 
    ) {
        const { user, status } = payload;
        return this.mailService.requestCustomerRole( user, status );
    }

    @MessagePattern( MailMSG.CUSTOMER_CREATED )
    async customerCreated( 
        @Payload() payload: ICustomerCreated 
    ) {
        return this.mailService.customerCreated( payload );
    }

    @MessagePattern( MailMSG.RECEIPT_GENERATED )
    async receiptGenerated(
        @Payload() payload: IReceiptGenerated,
    ) {
        return this.mailService.receiptGenerated( payload )
    }

}
