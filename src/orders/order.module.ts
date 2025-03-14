import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { AdminOrderController } from "./admin-order.controller";
import { TransactionModule } from "src/transactions/transaction.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { WalletsModule } from "src/wallets/wallets.module";
import { WebsocketModule } from "src/websocket/websocket.module";
import { JwtModule } from "@nestjs/jwt";
import { NotificationsModule } from "src/notifications/notifications.module";

@Module({
  imports: [
    PrismaModule,
    TransactionModule,
    WalletsModule,
    WebsocketModule,
    JwtModule,
    NotificationsModule,
  ],
  controllers: [OrderController, AdminOrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
