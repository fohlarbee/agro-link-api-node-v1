import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PaystackService } from "src/paystack/paystack.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "src/users/users.service";
import { DepositInitiationResponse } from "./entities/wallets.entity";
import { OrderStatus, PaymentType } from "@prisma/client";

@Injectable()
export class WalletsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private paystack: PaystackService,
  ) {}

  async create(customerId: number): Promise<any> {
    const user = await this.usersService.profile(customerId);
    if (!user) throw new UnauthorizedException("User not found");

    const existingWallet = await this.prisma.wallet.findFirst({
      where: { ownerId: user.data.id },
    });
    if (existingWallet)
      throw new ConflictException("User already has a wallet");

    await this.prisma.wallet.create({
      data: {
        ownerId: user.data.id,
        balance: 0.0,
      },
    });

    return {
      message: "Wallet created successfully",
      status: "success",
    };
  }

  async addFunds(customerId: number, amount: number): Promise<any> {
    const user = await this.usersService.profile(customerId);
    if (!user) throw new UnauthorizedException("User not found");

    const wallet = await this.prisma.wallet.findFirst({
      where: { ownerId: customerId },
      select: { id: true, balance: true },
    });
    if (!wallet)
      throw new UnauthorizedException("No wallet for user " + customerId);

    const payload = {
      email: user.data.email,
      amount,
      metadata: { customerId, walletId: wallet.id, type: PaymentType.DEPOSIT },
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

  async transactionHistory(customerId: number, walletId: number): Promise<any> {
    const transactions = await this.prisma.wallet.findUnique({
      where: { id: walletId, ownerId: customerId },
      select: {
        id: true,
        balance: true,
        ownerId: true,
        createdAt: true,
        payments: {
          select: {
            id: true,
            amount: true,
            reference: true,
            type: true,
            paidAt: true,
            orderId: true,
          },
          orderBy: { paidAt: "desc" },
        },
      },
    });

    return {
      message: "Transaction history fetched successfully",
      status: "success",
      data: transactions,
    };
  }

  async payOrder(
    customerId: number,
    walletId: number,
    orderId: number,
    businessId,
  ): Promise<any> {
    const currentOrder = await this.prisma.order.findUnique({
      where: {
        id: orderId,
        customerId,
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

    // const totalAmount = currentOrders.reduce((total, order) => {
    //   const totalPrice = order.options.reduce((acc, option) => {
    //     return acc + option.quantity * option.option.price;
    //   }, 0);
    //   return total + totalPrice + order.tip;
    // }, 0);
    const totalAmount =
      currentOrder.options.reduce((total, option) => {
        return total + option.quantity * option.option.price;
      }, 0) + currentOrder.tip;

    const wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId, ownerId: customerId },
      select: { id: true, balance: true },
    });
    if (!wallet) throw new UnauthorizedException("Wallet not found");

    if (wallet.balance < totalAmount)
      throw new ConflictException("Insufficient funds");

    await this.prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: wallet.balance - totalAmount,
        payments: {
          create: {
            amount: totalAmount,
            reference: `ORD-${currentOrder.id}${currentOrder.businessId}${customerId}`,
            type: PaymentType.ORDER_PAYMENT,
            userId: customerId,
            orderId: currentOrder.id,
          },
        },
      },
    });

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.paid,
        completedAt: new Date(),
        cancelledAt: null,
      },
    });

    return {
      message: "Order paid for successfully",
      status: "success",
    };
  }

  async getBalance(customerId: number): Promise<any> {
    const wallet = await this.prisma.wallet.findFirst({
      where: { ownerId: customerId },
      select: { balance: true },
    });
    if (!wallet) throw new UnauthorizedException("Wallet not found");

    return {
      message: "Wallet balance fetched successfully",
      status: "success",
      data: wallet,
    };
  }
}
