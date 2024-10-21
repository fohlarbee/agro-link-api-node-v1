import { Module } from "@nestjs/common";
import { BusinessService } from "./business.service";
import { BusinessController } from "./business.controller";
import { MenuModule } from "src/menus/menu.module";
import { OrderModule } from "src/orders/order.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { WalletsModule } from "src/wallets/wallets.module";

@Module({
  imports: [MenuModule, OrderModule, PrismaModule, WalletsModule],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}
