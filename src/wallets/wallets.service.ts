import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { DepositInitiationResponse } from "./entities/wallets.entity";
import { PaymentProvider, PaymentType, TokenType } from "@prisma/client";
import { TransactionService } from "src/transactions/transaction.service";
import { v4 as uuidv4 } from "uuid";
import { WebsocketService } from "src/websocket/websocket.service";
import * as bcrypt from "bcrypt";
import { ExpressDto } from "./dto/wallets-dto";
import { NotificationsService } from "src/notifications/notifications.service";

@Injectable()
export class WalletsService {
  constructor(
    private readonly prisma: PrismaService,
    private transactionService: TransactionService,
    private event: WebsocketService,
    private readonly notificationService: NotificationsService,
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
          },
        });
    }

    const userHasWallet = await this.prisma.wallet.findFirst({
      where: { userId },
    });
    if (userHasWallet) throw new ConflictException("User already has a wallet");

    await this.prisma.wallet.create({
      data: { userId, balance: 0.0, businessId: null },
    });
    const payload = {
      title: "Wallet",
      body: "Wallet created successfully",
      metadata: {},
    };
    this.notificationService.sendPush(userId, payload);

    return {
      message: "wallet created successfully",
      status: "success",
    };
  }

  async transactionHistory(walletId: number): Promise<any> {
    if (!walletId) throw new BadRequestException("walletId is needed");
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId },
      select: { id: true, balance: true },
    });

    if (!wallet) throw new NotFoundException("Wallet not found");

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
  async transactionHistoryForWallet(
    businessId: number,
    id: number,
  ): Promise<any> {
    if (!businessId || !id) throw new BadRequestException("Params are needed");
    const staff = await this.prisma.staff.findUnique({
      where: { userId_businessId: { userId: id, businessId } },
      select: { role: true },
    });
    if (staff.role.name !== "owner" && staff.role.name !== "admin")
      throw new UnauthorizedException(
        "You are not authorized to view this transaction history",
      );
    const wallet = await this.prisma.wallet.findUnique({
      where: { businessId },
    });

    if (!wallet) throw new NotFoundException("Wallet not found");

    const transactions = await this.prisma.payment.findMany({
      where: { businessId },
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
    businessId: number,
    type: PaymentType = PaymentType.ORDER_PAYMENT,
  ) {
    if (!(await this.prisma.user.findUnique({ where: { id: userId } })))
      throw new UnauthorizedException("No such user");

    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      select: { id: true, balance: true, businessId: true },
    });
    if (!wallet)
      this.prisma.wallet.create({
        data: { balance: 0, userId },
      });
    if (wallet.businessId)
      throw new UnauthorizedException("Wallet cannot pay for an order");

    if (wallet.balance < amount)
      throw new BadRequestException("Insufficient funds");

    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { decrement: amount },
      },
    });

    await this.prisma.wallet.update({
      where: { businessId },
      data: { balance: { increment: amount } },
    });

    //User payment info
    const payment = await this.prisma.payment.create({
      data: {
        amount,
        reference: `QQ_${Date.now()}`,
        type,
        userId,
        provider: PaymentProvider.QQ_WALLET,
        providerId: `QQ|${wallet.id}|${userId}|${Date.now()}`,
        walletId: wallet.id,
        paidAt: new Date(),
        businessId,
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
        data: { balance: 0, userId },
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
  }

  async authorize(walletId: number) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { id: walletId },
    });

    if (!wallet)
      throw new BadRequestException("wallet not found or unauthorized");
    if (wallet.locked) throw new BadRequestException("wallet is locked");

    return {
      message: "Wallet authorized successfully",
      status: "success",
      data: wallet,
    };
  }

  async createPin(walletId: number, pin: string, userId: number) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId },
    });
    if (!wallet) throw new NotFoundException("wallet not found");
    if (wallet.userId !== userId)
      throw new BadRequestException("Yoou cant create a pin");
    const hashedPin = bcrypt.hashSync(pin.toString(), bcrypt.genSaltSync());

    await this.prisma.wallet.update({
      where: { id: walletId },
      data: { pin: hashedPin },
    });
    const metadata = {
      title: "Wallet",
      body: "Wallet pin created successfully",
      metadata: {
        walletId,
      },
    };

    this.notificationService.sendPush(userId, metadata);
    this.event.notifyWallet(walletId, "walletPinCreated", { walletId });

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
    const metadata = {
      title: "Wallet",
      body: "Wallet pin reset successfully",
      metadata: {
        walletId,
      },
    };

    this.notificationService.sendPush(userId, metadata);
    this.event.notifyWallet(walletId, "walletPinReset", { walletId });

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
            user: { select: { email: true, id: true } },
            business: { select: { email: true, id: true } },
          },
        });
        walletType = "user";
        break;
      case "business":
        wallet = await this.prisma.wallet.findUnique({
          where: { id: walletId },
          select: {
            id: true,
            business: { select: { id: true, email: true } },
            user: { select: { id: true, email: true } },
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
        customerId: walletType === "user" ? +wallet.user.id : null,
        businessId: walletType === "business" ? +wallet.business.id : null,
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

  async getWalletAuthToken(walletId: number, action: TokenType) {
    if (action !== TokenType.SEND && action !== TokenType.RECEIVE)
      throw new BadRequestException("Invalid action");

    const wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId },
    });
    if (!wallet) throw new NotFoundException("Wallet not found");

    const authCode = await this.prisma.authCode.create({
      data: {
        code: uuidv4(),
        type: action,
        wallet: {
          connect: { id: wallet.id },
        },
      },
    });

    return {
      message: "Wallet token generated successfully",
      status: "success",
      data: {
        authToken: authCode.code,
      },
    };
  }

  async expressFlow(userId: number, payload: ExpressDto) {
    if (!userId || !payload) throw new BadRequestException("Invalid request");

    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException("User not found");
    const staff = await this.getStaff(user.id);

    if (payload.action !== "SEND" && payload.action !== "RECEIVE")
      throw new BadRequestException("Invalid action");

    const authTokenValid = await this.getAuthToken(
      payload.authorizationCode,
      payload.action,
    );

    if (!authTokenValid)
      throw new UnauthorizedException("Invalid or Expired authorization code");

    switch (payload.action) {
      case "SEND":
        const fromWallet = await this.getWallet(authTokenValid.walletId);
        const toWallet = await this.getReceiverWallet(staff, payload.walletId);
        if (fromWallet.locked)
          throw new UnprocessableEntityException("Wallet is locked");
        if (fromWallet.balance < payload.amount)
          throw new UnprocessableEntityException("Insufficient funds");
        await this.processTransaction(
          fromWallet,
          toWallet,
          payload.amount,
          payload,
        );

        const debitPayload = {
          userId: fromWallet.userId ?? null,
          businessId: fromWallet.businessId ?? null,
          walletId: fromWallet.id,
          status: "success",
          type: "WALLET_DEBIT",
        };
        const creditPayload = {
          from: fromWallet.userId ? fromWallet.userId : fromWallet.businessId,
          walletId: toWallet.id,
          type: "WALLET_CREDIT",
        };
        this.event.notifyWallet(fromWallet.id, "walletDebit", debitPayload);
        this.event.notifyWallet(toWallet.id, "walletCredit", creditPayload);

        break;
      case "RECEIVE":
        const senderWallet = await this.getWallet(payload.walletId);
        const receiverWallet = await this.prisma.wallet.findUnique({
          where: { id: authTokenValid.walletId },
        });
        if (senderWallet.locked)
          throw new UnprocessableEntityException("Wallet is locked");

        if (senderWallet.balance < payload.amount)
          throw new UnprocessableEntityException("Insufficient funds");

        await this.processTransaction(
          senderWallet,
          receiverWallet,
          payload.amount,
          payload,
        );
        const debitPayload2 = {
          userId: senderWallet.userId ?? null,
          businessId: senderWallet.businessId ?? null,
          walletId: senderWallet.id,
          status: "success",
          type: "WALLET_DEBIT",
        };
        const creditPayload2 = {
          from: senderWallet.userId
            ? senderWallet.userId
            : senderWallet.businessId,
          walletId: receiverWallet.id,
          type: "WALLET_CREDIT",
        };
        this.event.notifyWallet(senderWallet.id, "walletDebit", debitPayload2);
        this.event.notifyWallet(
          receiverWallet.id,
          "walletCredit",
          creditPayload2,
        );

        this.notificationService.sendPush(
          receiverWallet.userId
            ? receiverWallet.userId
            : receiverWallet.businessId,
          {
            body: `Wallet credit of ${payload.amount} was successful`,
            title: "Wallet",
            metadata: { creditPayload2 },
          },
        );
        this.notificationService.sendPush(
          senderWallet.userId ? senderWallet.userId : senderWallet.businessId,
          {
            body: `Wallet debit of ${payload.amount} was successful`,
            title: "Wallet",
            metadata: { debitPayload2 },
          },
        );

        break;
    }

    return {
      message: "Wallet transfer successful",
      status: "success",
    };
  }

  async getStaff(userId: number) {
    return await this.prisma.staff.findFirst({
      where: { userId },
      select: { businessId: true, role: true },
    });
  }

  async getAuthToken(code: string, action: string) {
    return await this.prisma.authCode.findFirst({
      where: {
        code,
        type: action === "SEND" ? TokenType.SEND : TokenType.RECEIVE,
        expired: false,
      },
    });
  }

  async getWallet(walletId: number) {
    return await this.prisma.wallet.findFirst({
      where: { id: walletId },
      select: {
        id: true,
        balance: true,
        locked: true,
        userId: true,
        businessId: true,
      },
    });
  }

  async getReceiverWallet(staff: any, walletId: number) {
    if (staff && ["owner", "admin", "manager"].includes(staff.role.name)) {
      return await this.prisma.wallet.findFirst({
        where: { businessId: staff.businessId },
      });
    }
    return await this.prisma.wallet.findUnique({ where: { id: walletId } });
  }

  async processTransaction(
    fromWallet: any,
    toWallet: any,
    amount: number,
    payload: any,
  ) {
    await this.prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: fromWallet.id },
        data: { locked: true },
      });
      await tx.wallet.update({
        where: { id: fromWallet.id },
        data: { balance: { decrement: amount } },
      });
      await tx.wallet.update({
        where: { id: toWallet.id },
        data: { balance: { increment: amount } },
      });
      await tx.payment.create({
        data: this.getTransferPaymentData(fromWallet, toWallet, amount),
      });
      await tx.payment.create({
        data: this.getCreditPaymentData(fromWallet, toWallet, amount),
      });
      await tx.wallet.update({
        where: { id: fromWallet.id },
        data: { locked: false },
      });
      await tx.authCode.update({
        where: { code: payload.authorizationCode },
        data: { expired: true },
      });
    });
  }

  getTransferPaymentData(fromWallet: any, toWallet: any, amount: number) {
    return {
      reference: `QQ_${Date.now()}`,
      type: PaymentType.WALLET_TRANSFER,
      amount,
      paidAt: new Date(),
      provider: PaymentProvider.QQ_WALLET,
      userId: fromWallet.userId,
      businessId: fromWallet.businessId,
      walletId: fromWallet.id,
      providerId: `QQ|${fromWallet.id}|${fromWallet.userId ? fromWallet.userId : fromWallet.businessId}|${Date.now()}`,
    };
  }

  getCreditPaymentData(fromWallet: any, toWallet: any, amount: number) {
    return {
      reference: `QQ_${Date.now()}`,
      type: PaymentType.WALLET_CREDIT,
      amount,
      paidAt: new Date(),
      provider: PaymentProvider.QQ_WALLET,
      userId: toWallet.userId,
      businessId: toWallet.businessId,
      walletId: toWallet.id,
      providerId: `QQ|${fromWallet.id}|${fromWallet.userId ? fromWallet.userId : fromWallet.businessId}|${Date.now()}`,
    };
  }
}
