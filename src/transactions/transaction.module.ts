import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PaystackService } from 'src/paystack/paystack.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, PaystackService, PrismaService],
})
export class TransactionModule {}
