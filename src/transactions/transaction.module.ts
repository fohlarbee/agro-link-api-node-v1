import { Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { MonnifyModule } from "src/monnify/monnify.module";
import { PaystackModule } from "src/paystack/paystack.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { WebsocketModule } from "src/websocket/websocket.module";
import { NotificationsModule } from "src/notifications/notifications.module";

@Module({
  imports: [
    MonnifyModule,
    PaystackModule,
    PrismaModule,
    WebsocketModule,
    NotificationsModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
