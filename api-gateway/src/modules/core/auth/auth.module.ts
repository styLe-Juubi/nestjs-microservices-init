import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Authcode, AuthcodeSchema } from './entities/authcode.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { AuthcodeService } from './authcode.service';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
    ProxyModule,
    ConfigModule,
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRES_IN')
          }
        }
      }
    }),
    MongooseModule.forFeatureAsync([
      { name: Authcode.name, useFactory: () => ( AuthcodeSchema )},
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthcodeService, JwtStrategy],
  exports: [AuthService, AuthcodeService, JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
