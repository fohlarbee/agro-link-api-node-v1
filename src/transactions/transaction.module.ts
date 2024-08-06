import { Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { PaystackService } from "src/paystack/paystack.service";
import { PrismaService } from "src/prisma/prisma.service";
import { MonnifyService } from "src/monnify/monnify.service";
import { CacheService } from "src/utils/services/cache.service";

@Module({
  controllers: [TransactionController],
  providers: [
    CacheService,
    MonnifyService,
    PaystackService,
    PrismaService,
    TransactionService
  ],
})
export class TransactionModule {}
