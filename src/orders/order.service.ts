import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { OrderDto } from "./dto/order-option.dto";
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
    createOrderDto: OrderDto,
    customerId: number,
    businessId: number,
  ) {
    const validOptions = await Promise.all(
      createOrderDto.items.filter(async (optionOrder) => {
        const option = await this.prisma.option.findUnique({
          where: { id: optionOrder.optionId, AND: { businessId } },
          select: { id: true },
        });
        return option;
      }),
    );

    let currentOrder = await this.prisma.order.findFirst({
      where: { customerId, status: OrderStatus.active, businessId },
      select: { id: true },
    });

    if (!currentOrder)
      currentOrder = await this.createNewOrder({
        customerId,
        businessId,
        tableIdentifier: createOrderDto.tableIdentifier,
        tip: validOptions.length / createOrderDto.tip,
      });

    await Promise.all(
      validOptions.map(async (orderOption) => {
        await this.prisma.orderOption.upsert({
          where: {
            orderId_optionId: {
              orderId: currentOrder.id,
              optionId: orderOption.optionId,
            },
          },
          create: { ...orderOption, orderId: currentOrder.id },
          update: { quantity: orderOption.quantity },
        });
      }),
    );

    return {
      message: "Order options added successfully",
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
    const { id: shiftId, userId: staffId } = table.assignedShifts[0].shift;
    return this.prisma.order.create({
      data: {
        customer: { connect: { id: customerId } },
        business: { connect: { id: businessId } },
        table: { connect: { id: table.id } },
        shift: { connect: { id: shiftId } },
        tip,
        waiter: {
          connect: {
            userId_businessId: { userId: staffId, businessId },
          },
        },
        ////how do i get the kitchenStaffId assined to take the order??
        kitchenStaff: {
          connect: {
            userId_businessId: { userId: staffId, businessId },
          },
        },
        cancelledBy: 0,
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
        kitchenStaff: { select: { user: { select: { name: true } } } },
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
    const currentOrders = await this.prisma.order.findMany({
      where: { customerId, businessId, status: OrderStatus.active },
      select: {
        id: true,
        tip: true,
        options: {
          select: {
            quantity: true,

            option: { select: { price: true } },
          },
        },
      },
    });
    if (!currentOrders || currentOrders.length === 0)
      throw new BadRequestException(
        "You do not currently have any open orders",
      );
    const totalAmount = currentOrders.reduce((total, order) => {
      const totalPrice = order.options.reduce((acc, option) => {
        return acc + option.quantity * option.option.price;
      }, 0);
      return total + totalPrice + order.tip;
    }, 0);

    const paymentLink = await this.paystack.createPaymentLink(
      email,
      totalAmount,
      {
        orderId: currentOrders[0].id,
        customerId,
      },
    );
    return {
      message: "Payment initiation successful",
      status: "success",
      data: {
        paymentLink: paymentLink.data.authorization_url,
        reference: paymentLink.data.reference,
      },
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

  async changeOrdertoActive(
    customerId: number,
    orderId: number,
    businessId: number,
  ) {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
        customerId,
        businessId,
        AND: { status: { equals: OrderStatus.failed } },
      },
    });

    if (!order)
      throw new NotFoundException("No such order found or Order is not active");

    await this.prisma.order.update({
      where: { id: orderId, customerId, businessId },
      data: { status: OrderStatus.active },
    });

    return {
      message: "Order is now active",
      status: "success",
    };
  }
}
