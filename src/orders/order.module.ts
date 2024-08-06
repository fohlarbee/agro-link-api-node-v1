import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { AdminOrderController } from "./admin-order.controller";
import { TransactionModule } from "src/transactions/transaction.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { WalletsModule } from "src/wallets/wallets.module";

@Module({
  imports: [PrismaModule, TransactionModule, WalletsModule],
  controllers: [OrderController, AdminOrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
