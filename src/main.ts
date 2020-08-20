import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Class Validator is now available
  app.useGlobalPipes(new ValidationPipe());

  // Swagger is now available 
  const options = new DocumentBuilder()
            .addBearerAuth()
            .setTitle('COIN MARKET DEV API Documentation')
            .setDescription('This is API REST To see BTC , ETH, DASH,  PTR (Petros), BS (Bolívares) and Euro values based on USD Dolar.')
            .setVersion('0.0.1')
            .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('documentation', app, document);

  let port = process.env.PORT || 3002;
  await app.listen(port);
  console.log('Server running on port: ', port)
  
}
bootstrap();
