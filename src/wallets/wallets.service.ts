import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { DepositInitiationResponse } from "./entities/wallets.entity";
import { PaymentProvider, PaymentType } from "@prisma/client";
import { TransactionService } from "src/transactions/transaction.service";
import { v4 as uuidv4 } from "uuid";
import { WebsocketService } from "src/websocket/websocket.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class WalletsService {
  constructor(
    private readonly prisma: PrismaService,
    private transactionService: TransactionService,
    private event: WebsocketService,
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
          data: {
            businessId: business?.id,
            balance: 0.0,
            userId: null,
            authToken: uuidv4(),
          },
        });
    }

    const userHasWallet = await this.prisma.wallet.findFirst({
      where: { userId },
    });
    if (userHasWallet) throw new ConflictException("User already has a wallet");

    await this.prisma.wallet.create({
      data: { userId, balance: 0.0, businessId: null, authToken: uuidv4() },
    });

    return {
      message: "wallet created successfully",
      status: "success",
    };
  }

  // async addFunds(
  //   userId: number,
  //   amount: number,
  //   provider: string,
  // ): Promise<any> {
  //   if (!["PSK", "MNF"].includes(provider))
  //     throw new BadRequestException(
  //       `Invalid payment provider code: "${provider}"`,
  //     );
  //   let wallet = await this.prisma.wallet.findUnique({
  //     where: { userId },
  //     select: {
  //       id: true,
  //       user: { select: { email: true } },
  //     },
  //   });

  //   if (!wallet)
  //     wallet = await this.prisma.wallet.create({
  //       data: { balance: 0, userId, authToken: uuidv4() },
  //       select: {
  //         id: true,
  //         user: { select: { email: true } },
  //       },
  //     });

  //   const payload = {
  //     email: wallet.user.email,
  //     amount,
  //     metadata: {
  //       customerId: userId,
  //       type: PaymentType.DEPOSIT,
  //     },
  //   };

  //   const { paymentLink, reference } =
  //     await this.transactionService.createTransactionLink(provider, payload);

  //   return {
  //     message: "Deposit initiation successful",
  //     status: "success",
  //     data: {
  //       paymentLink,
  //       reference,
  //     },
  //   } as DepositInitiationResponse;
  // }

  async transactionHistory(userId: number): Promise<any> {
    let wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      select: { id: true, balance: true },
    });

    if (!wallet)
      wallet = await this.prisma.wallet.create({
        data: { balance: 0, userId, authToken: uuidv4() },
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
        data: { balance: 0, userId, authToken: uuidv4() },
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
      select: { id: true, balance: true, pin: true },
    });
    if (!wallet)
      wallet = await this.prisma.wallet.create({
        data: { balance: 0, userId, authToken: uuidv4() },
        select: { id: true, balance: true, pin: true },
      });

    return {
      message: "Wallet balance fetched successfully",
      status: "success",
      data: { id: wallet.id, balance: wallet.balance, pin: wallet.pin },
    };
  }
  async transfer(
    amount: number,
    fromWalletId: number,
    toWalletId: number,
    userId: number,
    pin: string,
  ): Promise<any> {
    // try {
    await this.prisma.$transaction(async (tx) => {
      const authorizeFromWallet = await this.authorize(fromWalletId);
      const authorizeToWallet = await this.authorize(toWalletId);

      if (
        authorizeToWallet.status !== "success" ||
        authorizeToWallet.status !== "success"
      )
        throw new BadRequestException("Wallet not authorized");
      // const validatePin =
      await this.validatePin(fromWalletId, pin);

      if (fromWalletId === toWalletId)
        throw new BadRequestException("Cannot transfer to same wallet");

      if (authorizeFromWallet.data.balance < amount)
        throw new BadRequestException("Insufficient funds");
      await tx.wallet.update({
        where: { id: fromWalletId },
        data: { locked: true },
      });

      await tx.wallet.update({
        where: { id: fromWalletId },
        data: { balance: { decrement: amount } },
      });
      await tx.wallet.update({
        where: { id: toWalletId },
        data: { balance: { increment: amount } },
      });

      await tx.payment.create({
        data: {
          reference: `QQ_${Date.now()}`,
          type: PaymentType.WALLET_TRANSFER,
          amount,
          paidAt: new Date(),
          provider: PaymentProvider.QQ_WALLET,
          userId,
          providerId: `QQ|${fromWalletId}|${userId}|${Date.now()}`,
        },
      });
      await tx.wallet.update({
        where: { id: fromWalletId },
        data: { locked: false },
      });
      const debitPayload = {
        userId: authorizeFromWallet.data.userId ?? null,
        businessId: authorizeFromWallet.data.businessId ?? null,
        status: "success",
        type: "WALLET_DEBIT",
      };
      const creditPayload = {
        from:
          authorizeFromWallet.data.businessId ??
          authorizeFromWallet.data.userId,
        type: "WALLET_CREDIT",
      };

      const fromType = authorizeFromWallet.data.userId ? "user" : "business";
      const toType = authorizeToWallet.data.userId ? "user" : "business";

      switch (`${fromType}->${toType}`) {
        case "user->user":
          this.event.notifyUser(
            authorizeFromWallet.data.userId,
            "walletDebit",
            debitPayload,
          );
          this.event.notifyUser(
            authorizeToWallet.data.userId,
            "walletCredit",
            creditPayload,
          );
          break;
        case "user->business":
          this.event.notifyUser(
            authorizeFromWallet.data.userId,
            "walletDebit",
            debitPayload,
          );
          this.event.notifyBusiness(
            authorizeToWallet.data.businessId,
            "walletCredit",
            creditPayload,
          );
          break;
        case "business->user":
          this.event.notifyBusiness(
            authorizeFromWallet.data.businessId,
            "walletDebit",
            debitPayload,
          );
          this.event.notifyUser(
            authorizeToWallet.data.userId,
            "walletCredit",
            creditPayload,
          );
          break;
        case "business->business":
          this.event.notifyBusiness(
            authorizeFromWallet.data.businessId,
            "walletDebit",
            debitPayload,
          );
          this.event.notifyBusiness(
            authorizeToWallet.data.businessId,
            "walletCredit",
            creditPayload,
          );
          break;
        default:
          throw new BadRequestException("Invalid transfer type");
      }
    });

    return {
      message: "Wallet transfer successful",
      status: "success",
    };
    // } catch (error) {
    //   console.log(error);
    // }
  }

  async authorize(walletId: number) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { id: walletId },
    });

    if (!wallet)
      throw new BadRequestException("wallet not found or unauthorized");
    if (wallet.locked) throw new BadRequestException("wallet is locked");
    if (!wallet.authToken)
      throw new BadRequestException("wallet not authorized");

    return {
      message: "Wallet authorized successfully",
      status: "success",
      data: wallet,
    };
  }

  async createPin(walletId: number, pin: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId },
    });
    if (!wallet) throw new NotFoundException("wallet not found");
    const hashedPin = bcrypt.hashSync(pin.toString(), bcrypt.genSaltSync());

    const walletPin = await this.prisma.wallet.update({
      where: { id: walletId },
      data: { pin: hashedPin },
    });
    console.log(walletPin);
    return {
      message: "Wallet pin created",
      status: "success",
    };
  }
  async validatePin(walletId: number, pin: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId },
    });
    if (!wallet) throw new NotFoundException("wallet not found");
    if (!bcrypt.compareSync(pin, wallet.pin))
      throw new UnauthorizedException("Invalid pin");

    return {
      message: "Pin validated",
      status: "success",
    };
  }
  async resetPin(userId: number, walletId: number, pin: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId },
      select: { business: true, userId: true },
    });
    if (!wallet) throw new NotFoundException("Wallet not found");

    if (wallet.userId !== userId && wallet.business.creatorId !== userId)
      throw new UnauthorizedException("Unauthorized to reset pin");

    await this.prisma.wallet.update({
      where: { id: walletId },
      data: { pin: bcrypt.hashSync(pin, bcrypt.genSaltSync()) },
    });

    return {
      message: "Pin reset successfully",
      status: "success",
    };
  }

  async checkWalletExistence(walletId: number): Promise<"user" | "business"> {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId },
    });
    if (!wallet) throw new NotFoundException(`Wallet not found`);

    if (wallet.userId) return "user";
    if (wallet.businessId) return "business";
  }

  async addFunds(
    walletId: number,
    amount: number,
    provider: string,
  ): Promise<any> {
    if (!["PSK", "MNF"].includes(provider))
      throw new BadRequestException(
        `Invalid payment provider code: "${provider}"`,
      );

    let wallet;
    let walletType: "user" | "business";

    // Check wallet existence and determine wallet type
    switch (await this.checkWalletExistence(walletId)) {
      case "user":
        wallet = await this.prisma.wallet.findUnique({
          where: { id: walletId },
          select: {
            id: true,
            user: { select: { email: true } },
          },
        });
        walletType = "user";
        break;
      case "business":
        wallet = await this.prisma.wallet.findUnique({
          where: { id: walletId },
          select: {
            id: true,
            business: { select: { email: true } },
          },
        });
        walletType = "business";
        break;
      default:
        throw new NotFoundException(`Wallet not found for ID: ${walletId}`);
    }

    const payload = {
      email: walletType === "user" ? wallet.user.email : wallet.business.email,
      amount,
      metadata: {
        customerId: walletType === "user" ? wallet.user.id : wallet.business.id,
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

  async getWalletAuthToken(walletId: number) {
    let wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId },
    });
    if (!wallet) throw new NotFoundException("Wallet not found");

    if (!wallet.authToken)
      wallet = await this.prisma.wallet.update({
        where: { id: walletId },
        data: { authToken: uuidv4() },
      });

    wallet = await this.prisma.wallet.update({
      where: { id: walletId },
      data: { authToken: uuidv4() },
    });

    return {
      message: "Wallet token generated successfully",
      status: "success",
      data: {
        authToken: wallet.authToken,
      },
    };
  }
}
