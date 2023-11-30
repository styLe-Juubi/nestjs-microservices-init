import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { lastValueFrom } from 'rxjs';
import { UserMSG } from 'src/common/proxy/constants';
import { ClientProxyFood } from 'src/common/proxy/client-proxy';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    private clientProxyUser = this._clientProxy.clientProxyUser();

    constructor(
        private readonly _clientProxy: ClientProxyFood,
        configService: ConfigService,
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }


    async validate( payload: any ): Promise<any> {
        const { id } = payload;
        
        const user = await lastValueFrom( this.clientProxyUser.send( UserMSG.FIND_ONE, id ));

        if ( !user ) 
            throw new UnauthorizedException('Token has expired')
            
        if ( user.banned ) 
            throw new UnauthorizedException('User is banned, talk with an admin');

        if ( !user.active ) 
            throw new UnauthorizedException('User is disabled, talk with an admin');

        return user;
    }

}