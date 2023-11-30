import { Module } from '@nestjs/common';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { UserController } from './user.controller';
import { AuthModule } from '../core/auth/auth.module';
import { FileModule } from '../core/file/file.module';

@Module({
  imports: [
    AuthModule,
    ProxyModule,
    FileModule,
  ],
  controllers: [UserController]
})
export class UserModule {}
