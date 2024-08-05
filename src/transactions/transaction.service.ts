import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { OrderStatus, PaymentType } from "@prisma/client";
import { PaystackService } from "src/paystack/paystack.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TransactionService {
  constructor(
    private readonly paystack: PaystackService,
    private readonly prisma: PrismaService,
  ) {}
  async processTransaction(reference: string) {
    const verificationResult = await this.paystack.verifyPayment(reference);

    // Check that payment already exists
    const payment = await this.prisma.payment.findUnique({
      where: {
        reference,
        orderId: +verificationResult.data.metadata.orderId,
        type: "ORDER_PAYMENT",
      },
    });
    if (payment) return { message: "Payment successful", status: "success" };
    const orderId = +verificationResult.data.metadata.orderId;

    // convert amount from minor
    const amount = +verificationResult.data.amount / 100;
    // Parse order id in metadata
    // Retrieve payment time
    const paidAt = verificationResult.data.paid_at;
    const completedAt = verificationResult.data.transaction_date;

    // Check order exists
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new BadRequestException("No such order");

    if (order.status !== "active")
      throw new BadRequestException("Order is not active");

    if (verificationResult.data.status !== "success") {
      // Check that the payment was successful
      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.failed,
          completedAt,
          cancelledAt: null,
          payment: {
            create: {
              amount,
              reference,
              type: "ORDER_PAYMENT",

              // userId: order.customerId,
              user: {
                connect: { id: order.customerId }, // Link to existing user
              },
            },
          },
        },
      });

      throw new HttpException("Payment failed", HttpStatus.PAYMENT_REQUIRED);
    } else if (verificationResult.data.status === "success") {
      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.paid,
          completedAt,
          cancelledAt: null,
          payment: {
            create: {
              amount,
              paidAt,
              reference,
              userId: order.customerId,
              type: "ORDER_PAYMENT",
            },
          },
        },
      });
      return { message: "Payment successful", status: "success" };
    } else throw new BadRequestException("Invalid payment reference");
  }

  async processWalletTransaction(reference: string): Promise<any> {
    console.log("reference", reference);
    const verificationResult = await this.paystack.verifyPayment(reference);
    console.log(verificationResult);

    // Check that payment already exists
    const payment = await this.prisma.payment.findUnique({
      where: {
        reference,
        walletId: +verificationResult.data.metadata.walletId,
        type: PaymentType.DEPOSIT,
        userId: +verificationResult.data.metadata.customerId,
      },
    });
    if (payment) return { message: "Payment successful", status: "success" };

    const amount = +verificationResult.data.amount / 100;
    const paidAt = verificationResult.data.paid_at;

    const walletId = +verificationResult.data.metadata.walletId;
    console.log("walletId", walletId);

    const wallet = await this.prisma.wallet.findUnique({
      where: {
        id: walletId,
        OR: [
          { userId: +verificationResult.data.metadata.customerId },
          { businessId: +verificationResult.data.metadata.customerId },
        ],
      },
    });

    if (!wallet) throw new BadRequestException(`Wallet not found`);

    if (verificationResult.data.status === "success") {
      await this.prisma.wallet.update({
        where: { id: walletId },
        data: {
          balance: wallet.balance + amount,
          payments: {
            create: {
              amount,
              paidAt,
              reference,
              userId: +verificationResult.data.metadata.customerId,
              type: "DEPOSIT",
            },
          },
        },
      });

      return { message: "Deposit successful", status: "success" };
    }

    return { message: "Deposit Failed", status: "failed" };
  }
}
