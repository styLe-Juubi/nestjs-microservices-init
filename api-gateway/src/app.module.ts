import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi-schema.validation';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/core/auth/auth.module';
import { CloudModule } from './modules/core/cloud/cloud.module';
import { SeedModule } from './modules/core/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ EnvConfiguration ],
      validationSchema: JoiValidationSchema
    }),
    MongooseModule.forRoot( process.env.MONGO_DB ),
    AuthModule,
    UserModule,
    CloudModule,
    SeedModule,
  ],
})
export class AppModule {}
