import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import {
  AdminBusinessController,
  ClienBusinessController,
} from './business.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MenuService } from 'src/menus/menu.service';
import { OrderService } from 'src/orders/order.service';
import { PaystackService } from 'src/paystack/paystack.service';

@Module({
  imports: [],
  controllers: [ClienBusinessController, AdminBusinessController],
  providers: [
    MenuService,
    OrderService,
    PaystackService,
    PrismaService,
    BusinessService,
  ],
})
export class BusinessModule {}
