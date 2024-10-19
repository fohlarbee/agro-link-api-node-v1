import { Module } from "@nestjs/common";
import { WalletsController } from "./wallets.controller";
import { WalletsService } from "./wallets.service";
import { TransactionModule } from "src/transactions/transaction.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { WebsocketModule } from "src/websocket/websocket.module";
import { NotificationsModule } from "src/notifications/notifications.module";

@Module({
  imports: [
    PrismaModule,
    TransactionModule,
    WebsocketModule,
    NotificationsModule,
  ],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule {}
