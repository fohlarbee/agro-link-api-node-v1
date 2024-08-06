import {
  // BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotImplementedException,
} from "@nestjs/common";
import { OrderStatus, PaymentProvider, PaymentType } from "@prisma/client";
import { MonnifyService } from "src/monnify/monnify.service";
import { PaystackService } from "src/paystack/paystack.service";
import { PrismaService } from "src/prisma/prisma.service";

type TransactionPayload = {
  reference: string;
  providerId: string;
  customerId: number;
  businessId?: number;
  type: PaymentType;
  amount: number;
  paidAt: Date;
  provider: PaymentProvider;
};

@Injectable()
export class TransactionService {
  constructor(
    private readonly monnify: MonnifyService,
    private readonly paystack: PaystackService,
    private readonly prisma: PrismaService,
  ) {}

  async handlePaystackTransaction(reference: string) {
    const verificationResult = await this.paystack.verifyPayment(reference);
    const {
      paid_at,
      amount,
      status,
      metadata: { customerId, type, businessId },
    } = verificationResult.data;
    if (status !== "success")
      throw new HttpException("Payment failed", HttpStatus.PAYMENT_REQUIRED);
    return this.processTransaction({
      reference,
      customerId: +customerId,
      businessId: +businessId || businessId,
      type: type ?? PaymentType.ORDER_PAYMENT,
      amount: +amount / 100,
      paidAt: new Date(paid_at),
      provider: PaymentProvider.PAYSTACK,
      providerId: reference,
    });
  }
  private async processTransaction(payload: TransactionPayload) {
    // Check that payment already exists
    const existingPayment = await this.prisma.payment.findUnique({
      where: { reference: payload.reference },
    });
    if (existingPayment)
      return { message: "Payment successful", status: "success" };
    if (payload.type == PaymentType.DEPOSIT)
      return this.processDeposit(payload);
    else if (payload.type == PaymentType.ORDER_PAYMENT)
      return this.processOrderPayment(payload);
    throw new NotImplementedException("Unhandled payment transaction type");
  }

  private async processDeposit({
    reference,
    customerId,
    type,
    amount,
    paidAt,
    provider,
    providerId,
  }: TransactionPayload) {
    let wallet = await this.prisma.wallet.findFirst({
      where: { AND: [{ userId: customerId }, { businessId: null }] },
    });
    if (!wallet)
      wallet = await this.prisma.wallet.create({
        data: {
          balance: 0,
          userId: customerId,
        },
      });

    await this.prisma.payment.create({
      data: {
        reference,
        type,
        amount,
        paidAt,
        userId: customerId,
        walletId: wallet.id,
        provider,
        providerId,
      },
    });
    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { increment: amount },
      },
    });
    return { message: "Deposit successful", status: "success" };
  }

  private async processOrderPayment({
    reference,
    customerId,
    businessId,
    type,
    amount,
    paidAt,
    provider,
    providerId,
  }: TransactionPayload) {
    const orders = await this.prisma.order.findMany({
      where: { customerId, businessId, status: "active" },
      select: {
        id: true,
        businessId: true,
        tip: true,
        options: {
          select: {
            quantity: true,
            option: {
              select: { price: true },
            },
          },
        },
      },
    });

    const total = orders.reduce((total, order) => {
      const orderTotal = order.options.reduce((orderTotal, option) => {
        const {
          quantity,
          option: { price },
        } = option;
        return orderTotal + quantity * price;
      }, 0);
      return total + orderTotal + order.tip;
    }, 0);

    if (total > amount)
      return this.processDeposit({
        reference,
        customerId,
        type,
        amount,
        paidAt,
        provider,
        providerId,
      });

    const payment = await this.prisma.payment.create({
      data: {
        reference,
        type,
        amount,
        paidAt,
        userId: customerId,
        provider,
        providerId,
      },
    });
    const orderIds = orders.map((order) => order.id);
    await this.prisma.order.updateMany({
      where: { id: { in: orderIds } },
      data: {
        status: OrderStatus.paid,
        paidAt,
        paymentId: payment.id,
      },
    });
    return { message: "Payment successful", status: "success" };
  }

  async handleMonnifyTransaction(reference: string) {
    const verificationResult = await this.monnify.fetchTransaction(reference);
    const {
      paidOn,
      amountPaid,
      paymentStatus,
      paymentReference,
      transactionReference,
      metaData: { customerId, type, businessId },
    } = verificationResult.data;
    if (paymentStatus !== "PAID")
      throw new HttpException("Payment failed", HttpStatus.PAYMENT_REQUIRED);
    return this.processTransaction({
      reference: paymentReference,
      providerId: transactionReference,
      customerId: +customerId,
      businessId: +businessId || businessId,
      type: type ?? PaymentType.ORDER_PAYMENT,
      amount: +amountPaid,
      paidAt: new Date(paidOn),
      provider: PaymentProvider.MONNIFY,
    });
  }

  async createTransactionLink(
    provider: string,
    payload: {
      email: string;
      amount: number;
      metadata: Record<string, any>;
    },
  ) {
    if (provider === "PSK") return this.paystack.createPaymentLink(payload);
    else if (provider === "MNF") return this.monnify.createPaymentLink(payload);
    else return { paymentLink: "MONO_LINK", reference: "MONO_REF" };
  }
}
