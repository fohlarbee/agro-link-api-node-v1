import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { FilesModule } from 'src/files/files.module';
import { MenuModule } from 'src/menu/menu.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    FilesModule,
    MenuModule,
    RestaurantModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
