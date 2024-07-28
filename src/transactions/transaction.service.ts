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
    console.log("verifiation result", verificationResult);

    // Check that payment already exists
    const payment = await this.prisma.payment.findUnique({
      where: { reference, orderId: +verificationResult.data.metadata.orderId },
    });
    console.log("Payment already exists", payment);
    if (payment) return { message: "Payment successful", status: "success" };

    // convert amount from minor
    const amount = +verificationResult.data.amount / 100;
    // Parse order id in metadata
    const orderId = +verificationResult.data.metadata.orderId;
    console.log(orderId);
    // Retrieve payment time
    const paidAt = verificationResult.data.paid_at;
    const completedAt = verificationResult.data.transaction_date;

    // Check order exists
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (verificationResult.status != "success") {
      // Check that the payment was successful
      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.failed,
          paidAt,
          completedAt,
          cancelledAt: null,
          payment: {
            create: {
              amount,
              paidAt,
              reference,
              userId: order.customerId,
            },
          },
        },
      });

      throw new HttpException("Payment failed", HttpStatus.PAYMENT_REQUIRED);
    }

    // console.log('Heres the order', order);
    console.log(orderId, paidAt, amount, reference, order.customerId);

    if (!order) throw new BadRequestException("No such order");

    if (order.status !== "active")
      throw new BadRequestException("Order is not active");
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.paid,
        paidAt,
        completedAt,
        cancelledAt: null,
        payment: {
          create: {
            amount,
            paidAt,
            reference,
            userId: order.customerId,
          },
        },
      },
    });
    console.log(updatedOrder);
    return { message: "Payment successful", status: "success" };
  }
}
