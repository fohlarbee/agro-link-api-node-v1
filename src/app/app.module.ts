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
import { BarModule } from 'src/bar/bar.module';

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
<<<<<<< HEAD
<<<<<<< HEAD
=======
    BarItemsModule
>>>>>>> d846499 (Prisma relationship conflict)
=======
    BarModule
>>>>>>> d34f7f9 (fixed the Hotel, Bar, BarItems and Orders relationship conflicts)
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
