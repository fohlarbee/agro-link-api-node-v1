/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PaystackService } from 'src/paystack/paystack.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionService {

    constructor(private readonly paystack: PaystackService, private readonly prisma: PrismaService) {}
    async processTransaction(reference: string) {
        const verificationResult = await this.paystack.verifyPayment(reference);
        let { 
            status, metadata: { orderId },
            amount, paid_at: paidAt,
        } = verificationResult.data;

        // Check that payment already exists
        const payment = await this.prisma.payment.findUnique({ where: { reference }});
        if (payment) return { message: "Payment successful", status: "success" };

        // convert from minor
        amount = +amount / 100;
        orderId = +orderId

        // Check that the payment was successful
        if (status != "success") throw new HttpException("Payment failed", HttpStatus.PAYMENT_REQUIRED);
        const order = await this.prisma.order.findUnique({ where: { id: orderId }});
        if (!order) throw new BadRequestException("No such order");
        if (order.status !== "active") throw new BadRequestException("Order is not active");

        // await this.prisma.payment.create({
        //     data: { 
        //         orderId, amount, paidAt, 
        //         reference, userId: order.customerId 
        //     }
        // });

        await this.prisma.order.update({
            where: { id: orderId },
            data: { status: OrderStatus.paid, payment: { create: {
                amount, paidAt, 
                reference, userId: order.customerId 
            }} }
        });
        return { message: "Payment successful", status: "success" };
    }
}
