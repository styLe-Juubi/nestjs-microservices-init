import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RpcException, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { RabbitMQ } from './common/constants';
import { ValidationError } from 'class-validator';

async function bootstrap() {

  const app = await NestFactory.createMicroservice( AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.AMQP_URL],
      queue: RabbitMQ.UserQueue,
    }
  });

  app.useGlobalPipes( new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    validateCustomDecorators: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    exceptionFactory: (errors) => {
      const result = errors.map((error) => ({
          ...( error.children && error.children.length > 0 ) ? {
            property: error.children[0].property,
            message: ( error.children[0].constraints )
              ? error.children[0].constraints[Object.keys(error.children[0].constraints)[0]] 
              : `Invalid object properties in '${ error.property }'`,
          } : {
            property: error.property,
            message: error.constraints,
          }
        })
      );
      return new RpcException(
        new BadRequestException( result )
      );
    },
  }));
  
  await app.listen();
}
bootstrap();
