import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { PaystackService } from "src/paystack/paystack.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "src/users/users.service";
import { DepositInitiationResponse } from "./entities/wallets.entity";
import { OrderStatus, PaymentProvider, PaymentType } from "@prisma/client";

@Injectable()
export class WalletsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private paystack: PaystackService,
  ) {}

  async create(userId: number): Promise<any> {
    const user = await this.usersService.profile(userId);

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

  async addFunds(userId: number, amount: number): Promise<any> {
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
      await this.paystack.createPaymentLink(payload);

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

  async payOrder(userId: number, orderId: number, businessId): Promise<any> {
    const currentOrder = await this.prisma.order.findUnique({
      where: {
        id: orderId,
        customerId: userId,
        businessId,
        status: OrderStatus.active,
      },
      select: {
        id: true,
        tip: true,
        businessId: true,
        options: {
          select: {
            quantity: true,
            option: { select: { price: true } },
          },
        },
      },
    });
    if (!currentOrder)
      throw new BadRequestException("No active order found for this customer");
    const totalAmount =
      currentOrder.options.reduce((total, option) => {
        return total + option.quantity * option.option.price;
      }, 0) + currentOrder.tip;

    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      select: { id: true, balance: true },
    });
    if (!wallet)
      this.prisma.wallet.create({
        data: { balance: 0, userId },
      });

    if (wallet.balance < totalAmount)
      throw new BadRequestException("Insufficient funds");

    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { decrement: totalAmount },
      },
    });
    const payment = await this.prisma.payment.create({
      data: {
        amount: totalAmount,
        reference: `QQ_${Date.now}`,
        type: PaymentType.ORDER_PAYMENT,
        userId,
        provider: PaymentProvider.QQ_WALLET,
        providerId: `QQ|${wallet.id}|${userId}|${Date.now()}`,
      },
    });

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.paid,
        paymentId: payment.id,
      },
    });

    return {
      message: "Order paid for successfully",
      status: "success",
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
