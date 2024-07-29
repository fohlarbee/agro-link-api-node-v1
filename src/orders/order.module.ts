import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { PaystackService } from "src/paystack/paystack.service";
import { AdminOrderController } from "./admin-order.controller";
import { MonnifyService } from "src/monnify/monnify.service";
import { MonnifyModule } from "src/monnify/monnify.module";
import { CacheService } from "src/utils/services/cache.service";

@Module({
  controllers: [OrderController, AdminOrderController],
  providers: [
    OrderService,
    PrismaService,
    PaystackService,
    MonnifyService,
    CacheService,
  ],
})
export class OrderModule {}
