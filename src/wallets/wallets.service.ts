import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { DepositInitiationResponse } from "./entities/wallets.entity";
import { PaymentProvider, PaymentType } from "@prisma/client";
import { TransactionService } from "src/transactions/transaction.service";

@Injectable()
export class WalletsService {
  constructor(
    private readonly prisma: PrismaService,
    private transactionService: TransactionService,
  ) {}

  async create(userId: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException("No such user found");

    const business = await this.prisma.business.findFirst({
      where: { creatorId: userId },
    });

    if (business) {
      const businessHasWallet = await this.prisma.wallet.findFirst({
        where: { businessId: business?.id },
      });
      if (!businessHasWallet)
        await this.prisma.wallet.create({
          data: { businessId: business?.id, balance: 0.0 },
        });
    }

    const userHasWallet = await this.prisma.wallet.findFirst({
      where: { userId },
    });
    if (userHasWallet) throw new ConflictException("User already has a wallet");

    await this.prisma.wallet.create({
      data: { userId, balance: 0.0 },
    });

    return {
      message: "wallet created successfully",
      status: "success",
    };
  }

  async addFunds(userId: number, amount: number, provider: string): Promise<any> {
    if (!["PSK", "MNF"].includes(provider))
      throw new BadRequestException(
        `Invalid payment provider code: "${provider}"`,
      );
    let wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      select: {
        id: true,
        user: { select: { email: true } },
      },
    });

    if (!wallet)
      wallet = await this.prisma.wallet.create({
        data: { balance: 0, userId },
        select: {
          id: true,
          user: { select: { email: true } },
        },
      });

    const payload = {
      email: wallet.user.email,
      amount,
      metadata: {
        customerId: userId,
        type: PaymentType.DEPOSIT,
      },
    };

    const { paymentLink, reference } =
      await this.transactionService.createTransactionLink(provider, payload);

    return {
      message: "Deposit initiation successful",
      status: "success",
      data: {
        paymentLink,
        reference,
      },
    } as DepositInitiationResponse;
  }

  async transactionHistory(userId: number): Promise<any> {
    let wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      select: { id: true, balance: true },
    });

    if (!wallet)
      wallet = await this.prisma.wallet.create({
        data: { balance: 0, userId },
        select: { id: true, balance: true },
      });

    const transactions = await this.prisma.payment.findMany({
      where: { walletId: wallet.id },
      select: {
        id: true,
        amount: true,
        reference: true,
        type: true,
        paidAt: true,
      },
      orderBy: { paidAt: "desc" },
    });

    return {
      message: "Transaction history fetched successfully",
      status: "success",
      data: { balance: wallet.balance, transactions },
    };
  }

  async chargeWallet(
    userId: number,
    amount: number,
    type: PaymentType = PaymentType.ORDER_PAYMENT,
  ) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      select: { id: true, balance: true },
    });
    if (!wallet)
      this.prisma.wallet.create({
        data: { balance: 0, userId },
      });

    if (wallet.balance < amount)
      throw new BadRequestException("Insufficient funds");

    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { decrement: amount },
      },
    });
    const payment = await this.prisma.payment.create({
      data: {
        amount,
        reference: `QQ_${Date.now}`,
        type,
        userId,
        provider: PaymentProvider.QQ_WALLET,
        providerId: `QQ|${wallet.id}|${userId}|${Date.now()}`,
      },
    });

    return {
      message: "Wallet charged successfully",
      status: "success",
      data: { payment },
    };
  }

  async getBalance(userId: number): Promise<any> {
    let wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      select: { balance: true },
    });
    if (!wallet)
      wallet = await this.prisma.wallet.create({
        data: { balance: 0, userId },
        select: { balance: true },
      });

    return {
      message: "Wallet balance fetched successfully",
      status: "success",
      data: wallet,
    };
  }
}
