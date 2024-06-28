/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { RestaurantModule } from 'src/restaurants/restaurant.module';
import { FilesModule } from 'src/files/files.module';
import { MenuModule } from 'src/menus/menu.module';
import { OrderModule } from 'src/orders/order.module';
import { TransactionModule } from 'src/transactions/transaction.module';
import { ShiftsModule } from 'src/shifts/shifts.module';
import { StaffsModule } from 'src/staffs/staffs.module';
import { RolesModule } from 'src/roles/roles.module';
import { OutletsModule } from 'src/outlets/outlets.module';
import { MealsModule } from 'src/meals/meals.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    FilesModule,
    MealsModule,
    MenuModule,
    OutletsModule,
    RestaurantModule,
    RolesModule,
    OrderModule,
    ShiftsModule,
    StaffsModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
