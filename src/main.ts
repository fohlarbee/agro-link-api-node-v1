import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v2');

  const config = new DocumentBuilder()
    .setTitle('Chopmoni')
    .setDescription('Chopmoni api documentation')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('bankfieh/api-docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
