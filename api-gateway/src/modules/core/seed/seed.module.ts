import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { AuthModule } from '../auth/auth.module';
import { ProxyModule } from 'src/common/proxy/proxy.module';

@Module({
  imports: [
    AuthModule,
    ProxyModule,
  ],
  controllers: [SeedController],
  providers: [SeedService]
})
export class SeedModule {}
