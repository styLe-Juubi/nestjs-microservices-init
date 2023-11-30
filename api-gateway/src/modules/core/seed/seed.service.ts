import { Injectable } from '@nestjs/common';
import { usersCustomer } from './users';
import { ClientProxyFood } from 'src/common/proxy/client-proxy';
import { lastValueFrom, catchError, throwError } from 'rxjs';
import { UserMSG } from 'src/common/proxy/constants';
import { RpcException } from '@nestjs/microservices';
import { IUser } from '../auth/interfaces/user.interface';

@Injectable()
export class SeedService {

    private userProxy = this.clientProxy.clientProxyUser();
    private users = usersCustomer;

    constructor(
        private readonly clientProxy: ClientProxyFood,
    ) {}

    async executeSeed(): Promise<string> {
        
        await Promise.all(
            this.users.map( async ( user: any ) => {
                const x = await lastValueFrom(
                    this.userProxy.send( 
                        UserMSG.CREATE, { 
                            ...user, 
                            register_type: 'email', 
                            phone: undefined,
                            country_code: undefined,
                        },
                    ).pipe(
                        catchError( error => throwError(
                            () => new RpcException( error.response ))
                        )
                    )
                );
            })
        )

        return 'Seed Executed !';
    }

}
