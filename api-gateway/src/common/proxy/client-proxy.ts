import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { Transport } from "@nestjs/microservices/enums";
import { RabbitMQ } from "./constants";

@Injectable()
export class ClientProxyFood {

    constructor(
        private readonly config: ConfigService,
    ) {}

    clientProxyMail(): ClientProxy {
        return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: this.config.get('amqpUrl'),
                queue: RabbitMQ.MailQueue,
            }
        });
    }

    clientProxyUser(): ClientProxy {
        return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: this.config.get('amqpUrl'),
                queue: RabbitMQ.UserQueue,
            }
        });
    }

}