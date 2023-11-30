import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { AppModule } from './app.module';
import { RpcExceptionFilter } from './common/filters/rpc-exception.filter';
import { TimeOutInterceptor } from './common/interceptors/timeout.interceptor';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix( process.env.API_VERSION );
  app.useGlobalInterceptors( new TimeOutInterceptor() );
  app.useGlobalFilters(new RpcExceptionFilter());
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
        property: error.property,
        message: error.constraints,
      }));
      return new BadRequestException( result )
    },
  }));
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('Boost API')
    .setDescription('Boost App Gateway')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument( app, options );
  SwaggerModule.setup( '/api/docs', app, document, {
    swaggerOptions: {
      filter: true,
    }
  });

  await app.listen( process.env.PORT );
}
bootstrap();
