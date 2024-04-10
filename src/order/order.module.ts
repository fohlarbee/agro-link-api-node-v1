import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaystackService } from 'src/paystack/paystack.service';
import { VendorOrderController } from './vendor-order.controller';

@Module({
  controllers: [OrderController, VendorOrderController],
  providers: [OrderService, PrismaService, PaystackService],
})
export class OrderModule {}
