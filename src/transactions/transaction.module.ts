import { Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { MonnifyModule } from "src/monnify/monnify.module";
import { PaystackModule } from "src/paystack/paystack.module";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [MonnifyModule, PaystackModule, PrismaModule],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
