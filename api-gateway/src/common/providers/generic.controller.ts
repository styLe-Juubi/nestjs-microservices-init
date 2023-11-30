import { ClientProxy } from '@nestjs/microservices';
import { Body, Controller, Post } from '@nestjs/common';

@Controller()
export class GenericController<T> {

    constructor(
        private readonly _clientProxy: ClientProxy,
        private readonly actions: any
    ) {}

    @Post()
    create<T>( @Body() dto: T ) {
        console.log({ dto });
        console.log( this.actions );
    }

}