import { Module } from '@nestjs/common';
import { ClientProxyFood } from './client-proxy';

@Module({
    providers: [ClientProxyFood],
    exports: [ ClientProxyFood],
})
export class ProxyModule {}