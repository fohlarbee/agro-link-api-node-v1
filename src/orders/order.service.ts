import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { AddOptionToOrderDto } from "./dto/order-option.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { OrderStatus } from "@prisma/client";
import { PaystackService } from "src/paystack/paystack.service";

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private paystack: PaystackService,
  ) {}

  async orderOption(
    { tableIdentifier, ...optionOrder }: AddOptionToOrderDto,
    customerId: number,
    businessId: number,
    tip?: number,
  ) {
    const option = await this.prisma.option.findUnique({
      where: { id: optionOrder.optionId, AND: { businessId } },
      select: { business: true },
    });

    if (!option)
      throw new NotFoundException(
        `No such option with id ${optionOrder.optionId}`,
      );

    let currentOrder = await this.prisma.order.findFirst({
      where: { customerId, status: OrderStatus.active, businessId },
      select: { id: true },
    });

    if (!currentOrder)
      currentOrder = await this.createNewOrder({
        customerId,
        businessId,
        tableIdentifier,
        tip,
      });

    await this.prisma.orderOption.upsert({
      where: {
        orderId_optionId: {
          orderId: currentOrder.id,
          optionId: optionOrder.optionId,
        },
      },
      create: { ...optionOrder, orderId: currentOrder.id },
      update: { quantity: optionOrder.quantity },
    });

    return {
      message: "Option added to order successfully",
      status: "success",
    };
  }

  private async createNewOrder({
    customerId,
    businessId,
    tableIdentifier,
    tip,
  }: {
    customerId: number;
    businessId: number;
    tableIdentifier: string;
    tip: number;
  }) {
    const table = await this.prisma.table.findFirst({
      where: {
        identifier: tableIdentifier,
        outlet: { businessId: businessId },
      },
      select: {
        id: true,
        assignedShifts: {
          where: {
            shift: {
              startTime: { lte: new Date() },
              endTime: { gte: new Date() },
            },
          },
          select: { shift: true },
        },
      },
    });

    if (!table) throw new BadRequestException("Invalid table selected");
    if (table.assignedShifts.length < 1)
      throw new UnprocessableEntityException(
        "No waiter to take your order at this moment",
      );
    const { id: shiftId, userId: waiterId } = table.assignedShifts[0].shift;
    return this.prisma.order.create({
      data: {
        customer: { connect: { id: customerId } },
        business: { connect: { id: businessId } },
        table: { connect: { id: table.id } },
        shift: { connect: { id: shiftId } },
        tip,
        waiter: {
          connect: {
            userId_businessId: { userId: waiterId, businessId },
          },
        },
      },
      select: { id: true },
    });
  }

  async findCustomerOrders(customerId: number) {
    const orders = await this.prisma.order.findMany({
      where: { customerId, status: OrderStatus.active },
      select: {
        id: true,
        table: { select: { identifier: true } },
        waiter: { select: { user: { select: { name: true } } } },
        options: {
          select: {
            option: {
              select: { image: true, name: true, price: true, id: true },
            },
            quantity: true,
          },
        },
        business: { select: { id: true, name: true } },
      },
    });
    return {
      message: "Orders fetched successfully",
      status: "success",
      data: orders,
    };
  }

  async findOpenBusinessOrder(customerId: number, businessId: number) {
    const currentOrder = await this.prisma.order.findFirst({
      where: { customerId, status: OrderStatus.active, businessId },
      select: {
        options: {
          select: {
            option: {
              select: { image: true, name: true, price: true, id: true },
            },
            quantity: true,
          },
        },
      },
    });
    return currentOrder.options || [];
  }

  async findOrder(customerId: number, orderId: number) {
    console.log(customerId, orderId);
    const order = await this.prisma.order.findFirst({
      where: { customerId, id: orderId },
      select: {
        options: {
          select: {
            option: {
              select: { image: true, name: true, price: true, id: true },
            },
            quantity: true,
          },
        },
      },
    });
    return {
      message: "Order fetched successfully",
      status: "success",
      data: { order },
    };
  }

  async findOrderHistory(customerId: number) {
    return this.prisma.order.findMany({
      where: { customerId, status: { not: OrderStatus.active } },
      select: {
        status: true,
        createdAt: true,
        completedAt: true,
        id: true,
        options: {
          select: {
            option: {
              select: { image: true, name: true, price: true, id: true },
            },
            quantity: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async removeOptionOrder(id: number, customerId: number, orderId: number) {
    const currentOrderOption = await this.prisma.orderOption.findFirst({
      where: {
        order: { customerId, id: orderId, status: OrderStatus.active },
        optionId: id,
      },
      select: { optionId: true, orderId: true },
    });
    if (!currentOrderOption)
      throw new BadRequestException("No such option in order");
    await this.prisma.orderOption.delete({
      where: { orderId_optionId: currentOrderOption },
    });
    return { message: "Option removed from current order", status: "success" };
  }

  async payOrder(email: string, customerId: number, businessId: number) {
    const currentOrder = await this.prisma.order.findFirst({
      where: { customerId, businessId, status: OrderStatus.active },
      select: {
        id: true,
        options: {
          select: {
            quantity: true,
            option: { select: { price: true } },
          },
        },
      },
    });
    if (!currentOrder)
      throw new BadRequestException(
        "You do not currently have any open orders",
      );
    const totalAmount = currentOrder.options.reduce((total, option) => {
      total += option.quantity * option.option.price;
      return total;
    }, 0);
    const paymentLink = await this.paystack.createPaymentLink(
      email,
      totalAmount,
      {
        orderId: currentOrder.id,
        customerId,
      },
    );
    return {
      message: "Payment initiation successful",
      status: "success",
      data: { paymentLink: paymentLink.data.authorization_url },
    };
  }

  async fetchPaidOrders(ownerId: number, businessId: number) {
    return this.prisma.order.findMany({
      where: { business: { id: businessId }, status: OrderStatus.paid },
      select: {
        id: true,
        status: true,
        options: {
          select: {
            option: { select: { image: true, price: true, id: true } },
            quantity: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }
}
