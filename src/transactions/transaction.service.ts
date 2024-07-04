import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PaystackService } from 'src/paystack/paystack.service';
import { PrismaService } from 'src/prisma/prisma.service';

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
      where: { reference },
    });
    if (payment) return { message: 'Payment successful', status: 'success' };

    // Check that the payment was successful
    if (verificationResult.status != 'success')
      throw new HttpException('Payment failed', HttpStatus.PAYMENT_REQUIRED);

    // convert amount from minor
    const amount = +verificationResult.data.amount / 100;
    // Parse order id in metadata
    const orderId = +verificationResult.data.metadata.orderId;
    // Retrieve payment time
    const paidAt = verificationResult.data.paid_at;
    // Check order exists
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new BadRequestException('No such order');

    if (order.status !== 'active')
      throw new BadRequestException('Order is not active');

    await this.prisma.payment.create({
      data: {
        orderId,
        amount,
        paidAt,
        reference,
        userId: order.customerId,
      },
    });

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.paid,
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
    return { message: 'Payment successful', status: 'success' };
  }
}
