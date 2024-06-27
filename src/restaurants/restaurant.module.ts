import { Module } from '@nestjs/common';
import { RestaurantService as RestaurantService } from './restaurant.service';
import {
  AdminRestaurantController,
  ClientRestaurantController as ClientRestaurantController,
} from './restaurant.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MenuService } from 'src/menus/menu.service';
import { OrderService } from 'src/orders/order.service';
import { PaystackService } from 'src/paystack/paystack.service';

@Module({
  imports: [],
  controllers: [ClientRestaurantController, AdminRestaurantController],
  providers: [
    MenuService,
    OrderService,
    PaystackService,
    PrismaService,
    RestaurantService,
  ],
})
export class RestaurantModule {}
