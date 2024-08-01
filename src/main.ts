import { HttpAdapterHost, NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { PrismaClientExceptionFilter } from "./prisma-client-exception/prisma-client-exception.filter";
import { PrismaService } from "./prisma/prisma.service";
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: console,
    cors: true,
  });

  app.setGlobalPrefix("v2");
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const config = new DocumentBuilder()
    .setTitle("Chopmoni")
    .setDescription("Chopmoni api documentation")
    .setVersion("0.1")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("bankfieh/api-docs", app, document, { explorer: true });

  await app.listen(4000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  async function connectToDb() {
    while (true) {
      try {
        await new PrismaService().$connect();
        console.log("connected to db");
        break;
      } catch (e) {
        console.log(`Error connecting to db: ${e}. Retrying in 5 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }
  connectToDb();
}
bootstrap();
