import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { OrderStatus } from "@prisma/client";
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
    // onResult);

    // Check that payment already exists
    const orderId = +verificationResult.data.metadata.orderId;
    const payment = await this.prisma.payment.findUnique({
      where: { reference, orderId: +verificationResult.data.metadata.orderId },
    });
    if (payment) return { message: "Payment successful", status: "success" };

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
              type: "ORDER_PAYMENT",
              user: {
                connect: { id: order.customerId },
              },
            },
          },
        },
      });
      return { message: "Payment successful", status: "success" };
    } else throw new BadRequestException("Invalid payment reference");
  }
}
