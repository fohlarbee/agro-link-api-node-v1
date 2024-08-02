import { Module } from "@nestjs/common";
import { WalletsController } from "./wallets.controller";
import { WalletsService } from "./wallets.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UsersModule } from "src/users/users.module";
import { PaystackModule } from "src/paystack/paystack.module";
import { UsersService } from "src/users/users.service";
import { PaystackService } from "src/paystack/paystack.service";

@Module({
  imports: [],
  controllers: [WalletsController],
  providers: [WalletsService, PrismaService, UsersService, PaystackService],
})
export class WalletsModule {}
