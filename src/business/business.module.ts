import { Module } from "@nestjs/common";
import { BusinessService } from "./business.service";
import {
  AdminBusinessController,
  ClientBusinessController,
} from "./business.controller";
import { MenuModule } from "src/menus/menu.module";
import { OrderModule } from "src/orders/order.module";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [
    MenuModule,
    OrderModule,
    PrismaModule
  ],
  controllers: [ClientBusinessController, AdminBusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}
