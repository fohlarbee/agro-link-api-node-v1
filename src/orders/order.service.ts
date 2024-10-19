import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { OrderDto } from "./dto/order-option.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { OrderStatus, PaymentProvider, PaymentType } from "@prisma/client";
import { WalletsService } from "src/wallets/wallets.service";
import { TransactionService } from "src/transactions/transaction.service";
import { WebsocketService } from "src/websocket/websocket.service";
import { NotificationsService } from "src/notifications/notifications.service";

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private transactionService: TransactionService,
    private wallet: WalletsService,
    private event: WebsocketService,
    private readonly notificationService: NotificationsService,
  ) {}

  async getDayOfWeek(date: Date) {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    return days[date.getDay()];
  }

  async formatTime(date: Date) {
    return date.toTimeString().split(" ")[0]; // Format time as HH:mm:ss
  }
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
        tip: createOrderDto.tip,
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
              // startTime: { lte: new Date() },
              // endTime: { gt: new Date() },
              periods: {
                some: {
                  AND: [
                    {
                      day: {
                        equals: new Date()
                          .toLocaleString("en-UK", { weekday: "short" })
                          .toString(),
                      },
                    },

                    {
                      startTime: {
                        lte: new Date().toTimeString().split(" ")[0].toString(),
                      }, //09:00:00
                    },
                    {
                      endTime: {
                        gte: new Date().toTimeString().split(" ")[0].toString(),
                      },
                    },
                  ],
                },
              },
            },
          },
          select: { shift: true },
        },
      },
    });
    console.log(table);
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
        id: true,
        status: true,
        createdAt: true,
        completedAt: true,
        tip: true,
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

  async payOrder(
    email: string,
    customerId: number,
    businessId: number,
    provider: string = "FLW",
  ) {
    const currentOrders = await this.prisma.order.findMany({
      where: { customerId, businessId, status: OrderStatus.active },
      select: {
        id: true,
        tip: true,
        waiterId: true,
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
    if (!["PSK", "MNF", "WALLET", "CASH", "POS"].includes(provider))
      throw new BadRequestException(
        `Invalid payment provider code: "${provider}"`,
      );

    if (provider === "CASH" || provider === "POS") {
      await this.prisma.order.updateMany({
        where: { id: { in: currentOrders.map((order) => order.id) } },
        data: { status: OrderStatus.payment_pending },
      });
      // TODO: WS message when a usaer opts to pay with cash or POS
      currentOrders.map((order) => {
        const payload = {
          businessId,
          customerId,
          channel: provider,
          type: "PAYMENT_PENDING",
          amount:
            order.options.reduce((total, option) => {
              return total + option.quantity * option.option.price;
            }, 0) + order.tip,
        };
        this.event.notifyBusiness(businessId, "orderPayment", payload);
        this.event.notifyWaiter(order.waiterId, "paymentPending", payload);
        this.notificationService.sendPush(order.waiterId, {
          title: "Order",
          body: `Order payment for id ${order.id} is pending`,
          metadata: payload,
        });
      });
      return {
        message: "Please proceed to pay for your order",
        status: "success",
      };
    }

    const totalAmount = currentOrders.reduce((total, order) => {
      const totalPrice = order.options.reduce((acc, option) => {
        return acc + option.quantity * option.option.price;
      }, 0);
      return total + totalPrice + order.tip;
    }, 0);

    if (provider === "WALLET")
      return this.payWithWallet(
        customerId,
        totalAmount,
        businessId,
        currentOrders.map((order) => order.id),
      );

    const payload = {
      email,
      amount: totalAmount,
      metadata: { customerId, businessId, type: PaymentType.ORDER_PAYMENT },
    };

    const { paymentLink, reference } =
      await this.transactionService.createTransactionLink(provider, payload);

    return {
      message: "Payment initiation successful",
      status: "success",
      data: {
        paymentLink,
        reference,
      },
    };
  }

  private async payWithWallet(
    customerId: number,
    total: number,
    businessId: number,
    orderIds: number[],
  ) {
    const {
      data: { payment },
    } = await this.wallet.chargeWallet(customerId, total, businessId);
    await this.prisma.order.updateMany({
      where: { id: { in: orderIds } },
      data: {
        paidAt: new Date(),
        paymentId: payment.id,
        status: OrderStatus.paid,
      },
    });
    const metadata = {
      // type: "order",
      ids: orderIds,
      amount: total,
      paidAt: new Date(),
      businessId,
      customerId,
      type: "ORDER_PAYMENT",
    };
    const kitchenStaffs = await this.prisma.staff.findMany({
      where: { businessId, role: { name: { equals: "kitchen" } } },
    });
    if (!kitchenStaffs) throw new NotFoundException("No staffs found");

    kitchenStaffs.forEach((staff) => {
      this.event.notifyKitchen(staff.userId, "orderPayment", metadata);
      this.notificationService.sendPush(staff.userId, {
        title: "orderPayment",
        body: "OrderPayment successful",
        metadata,
      });
    });
    this.event.notifyBusiness(businessId, "orderPayment", metadata);

    const orders = await Promise.all(
      orderIds.map(async (orderId) => {
        return await this.prisma.order.findUnique({
          where: { id: orderId },
          select: { waiterId: true },
        });
      }),
    );

    if (!orders.length) throw new NotFoundException("No orders found");
    orders.forEach((order) => {
      this.event.notifyWaiter(order.waiterId, "orderPayment", metadata);
      this.notificationService.sendPush(order.waiterId, {
        title: "orderPayment",
        body: "OrderPayment successful",
        metadata,
      });
    });

    return {
      message: "Orders successfully paid",
      status: "success",
    };
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

  async fetchPaidOrders(businessId: number) {
    return this.prisma.order.findMany({
      where: { status: OrderStatus.paid, businessId },
      select: {
        id: true,
        status: true,
        waiter: true,
        options: {
          select: {
            option: { select: { image: true, price: true, id: true } },
            quantity: true,
          },
        },
        customer: { select: { name: true, email: true } },
        business: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
  async acceptOrder(
    orderId: number,
    kitchenStaffId: number,
    businessId: number,
  ): Promise<any> {
    const staff = await this.prisma.staff.findUnique({
      where: {
        userId_businessId: { businessId, userId: kitchenStaffId },
        role: { name: { equals: "kitchen" } },
      },
    });
    if (!staff) throw new UnauthorizedException("staff not found");
    const order = await this.prisma.order.findUnique({
      where: { id: orderId, businessId, status: { equals: OrderStatus.paid } },
      select: { customerId: true, waiterId: true, kitchenStaffId: true },
    });
    if (!order)
      throw new BadRequestException("Order not found or not paid for");

    await this.prisma.order.update({
      where: { id: orderId, businessId },
      data: {
        status: OrderStatus.preparing,
        kitchenStaff: {
          connect: {
            userId_businessId: { userId: kitchenStaffId, businessId },
          },
        },
      },
      select: { customerId: true, waiterId: true },
    });
    const payload = {
      businessId,
      orderId,
      status: OrderStatus.preparing,
      type: "ORDER_ACCEPTED",
    };
    this.event.notifyKitchen(kitchenStaffId, "acceptedOrder", payload);
    this.event.notifyUser(order.customerId, "acceptedOrder", payload);
    this.event.notifyWaiter(order.waiterId, "acceptedOrder", payload);
    return {
      message: "Order is accepted",
      status: "success",
    };
  }

  async markOrderAsReady(
    orderId: number,
    kitchenStaffId: number,
    businessId: number,
  ): Promise<any> {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
        kitchenStaffId,
        businessId,
        status: OrderStatus.preparing,
      },
      select: {
        businessId: true,
        kitchenStaffId: true,
        customerId: true,
        waiterId: true,
        status: true,
      },
    });
    if (!order)
      throw new BadRequestException("Order not found or has not been prepared");

    if (order.kitchenStaffId !== kitchenStaffId)
      throw new UnauthorizedException("Unauthorized to mark order as ready");

    if (order.status === OrderStatus.ready)
      throw new BadRequestException("Order has already been marked ready");

    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.ready },
    });
    const payload = {
      businessId: order.businessId,
      orderId,
      status: OrderStatus.ready,
      type: "order",
    };
    this.event.notifyWaiter(order.waiterId, "orderIsReady", payload);
    this.notificationService.sendPush(order.waiterId, {
      title: "OrderIsReady",
      body: `Order ${orderId} is ready`,
      metadata: payload,
    });
    // this.event.notifyKitchen(kitchenStaffId, "orderIsReady", payload);
    // this.event.notifyUser(order.customerId, "orderIsReady", payload);

    return {
      message: "Order is marked as ready",
      status: "success",
    };
  }
  async markOrderAsDelivered(
    orderId: number,
    waiterId: number,
    businessId: number,
  ): Promise<any> {
    const getOrder = await this.prisma.order.findUnique({
      where: { id: orderId, businessId, status: { equals: OrderStatus.ready } },
    });
    if (!getOrder)
      throw new BadRequestException(
        `Order ${orderId} not found or has already been delivered`,
      );
    if (!getOrder || getOrder.waiterId !== waiterId)
      throw new UnauthorizedException(
        "Unauthorized to mark order as delivered",
      );
    await this.prisma.order.update({
      where: { id: orderId, businessId },
      data: { status: OrderStatus.delivered },
    });

    const payload = {
      orderId,
      status: OrderStatus.delivered,
      type: "ORDER_DELIVERED",
      tip: getOrder.tip,
      customerId: getOrder.customerId,
    };

    if (getOrder.tip && getOrder.tip > 0) {
      const waiterWallet = await this.prisma.wallet.findFirst({
        where: { AND: [{ userId: waiterId }, { businessId: null }] },
      });
      if (!waiterWallet)
        await this.prisma.wallet.create({
          data: {
            userId: waiterId,
            balance: getOrder.tip,
            businessId: null,
          },
        });

      await this.prisma.wallet.update({
        where: { id: waiterWallet.id },
        data: { balance: { increment: getOrder.tip } },
      });

      await this.prisma.payment.create({
        data: {
          reference: `TP_CUS${getOrder.customerId}${Date.now()}`,
          userId: waiterId,
          businessId: businessId,
          type: PaymentType.TIP,
          amount: getOrder.tip,
          paidAt: new Date(),
          provider: PaymentProvider.CUSTOMER_TIP,
          providerId: `TP_CUS${getOrder.customerId}${Date.now()}`,
          walletId: waiterWallet.id,
        },
      });

      this.event.notifyWaiter(getOrder.waiterId, "tips", payload);
      this.notificationService.sendPush(getOrder.waiterId, {
        title: "Tips",
        body: `You've received a tip of ${getOrder.tip}`,
        metadata: payload,
      });
    }
    this.event.notifyUser(getOrder.customerId, "orderDelivered", payload);
    this.notificationService.sendPush(getOrder.customerId, {
      title: "Order delivered",
      body: `Order ${getOrder.id} delivered}`,
      metadata: payload,
    });
    this.event.notifyWaiter(getOrder.waiterId, "orderDelivered", payload);

    return {
      message: "Order is marked as delivered",
      status: "success",
    };
  }
  async markOrderAsComplete(
    orderId: number,
    businessId: number,
    customerId: number,
  ): Promise<any> {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
        businessId,
        customerId,
        status: OrderStatus.delivered,
      },
    });
    if (!order)
      throw new BadRequestException("Order not found or not delivered");

    if (order.customerId !== customerId)
      throw new UnauthorizedException("Unauthorized to mark order as complete");
    if (order.status === OrderStatus.completed)
      throw new BadRequestException("Order already marked completed");

    const payload = {
      orderId,
      status: OrderStatus.completed,
      type: "ORDER_COMPLETED",
      customerId: order.customerId,
    };
    await this.prisma.order.update({
      where: { id: orderId, businessId, customerId },
      data: { status: OrderStatus.completed },
    });
    this.event.notifyUser(order.customerId, "orderCompleted", payload);
    this.event.notifyWaiter(order.waiterId, "orderCompleted", payload);
    this.event.notifyKitchen(order.kitchenStaffId, "orderCompleted", payload);
  }

  async confirmPayment(
    orderId: number,
    businessId: number,
    waiterId: number,
    completed: boolean,
    provider: "CASH" | "POS",
  ): Promise<any> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId, businessId },

      include: {
        options: {
          include: {
            option: {
              select: { price: true },
            },
          },
        },
      },
    });
    if (order.status !== OrderStatus.payment_pending)
      throw new BadRequestException(
        `Order ${orderId} is not in payment pending state`,
      );
    if (!order || order.waiterId !== waiterId)
      throw new UnauthorizedException("Unauthorized to confirm payment");
    if (!["CASH", "POS"].includes((provider as string).toUpperCase()))
      throw new BadRequestException({
        message: "Invalid channel submitted",
        status: "error",
      });
    const totalAmount =
      order.options.reduce((total, option) => {
        return total + option.quantity * option.option.price;
      }, 0) + order.tip;

    if (completed)
      await this.prisma.payment.create({
        data: {
          reference: `QQ_${Date.now()}`,
          userId: order.customerId,
          orders: { connect: { id: orderId } },
          businessId,
          type: PaymentType.ORDER_PAYMENT,
          amount: totalAmount,
          paidAt: new Date(),
          provider,
          providerId: `${provider}|${order.customerId}|${Date.now()}`,
        },
      });
    await this.prisma.order.update({
      where: { id: orderId, businessId },
      data: { status: completed ? OrderStatus.paid : OrderStatus.active },
    });
    if (completed) {
      const metadata = {
        amount: totalAmount,
        orderId,
        businessId,
        type: "ORDER_PAYMENT",
        status: OrderStatus.paid,
        customerId: order.customerId,
      };
      this.event.notifyBusiness(businessId, "orderPayment", {
        businessId,
        customerId: order.customerId,
        type: "ORDER_PAYMENT",
        amount: totalAmount,
      });
      this.notificationService.sendPush(order.customerId, {
        title: "OrderPayment",
        body: `Payment for ${order.id} successful`,
        metadata,
      });
      const kitchenStaffs = await this.prisma.staff.findMany({
        where: { businessId, role: { name: { equals: "kitchen" } } },
      });
      if (!kitchenStaffs) throw new NotFoundException("No staffs found");

      kitchenStaffs.forEach((staff) => {
        this.event.notifyKitchen(staff.userId, "orderPayment", metadata);
      });
      this.notificationService.sendPush(order.customerId, {
        title: "Order Payment",
        body: "Order Payment confirmed",
        metadata,
      });
    }
    this.event.notifyUser(order.customerId, "orderPayment", {
      orderId,
      status: completed ? OrderStatus.paid : OrderStatus.active,
      type: "ORDER_PAYMENT",
      customerId: order.customerId,
      amount: totalAmount,
    });

    return {
      message: completed
        ? "Order payment successfully confirmed"
        : "Order payment successfully cancelled",
      status: "success",
    };
  }

  // Helper functions
}

// Erlang
// Clojure
// Objective C
// Elixir
// Haskell
// Marvellous Modupe
// 18:31
// Lisp
// Marvellous Modupe
// 18:35
// FOUC;
