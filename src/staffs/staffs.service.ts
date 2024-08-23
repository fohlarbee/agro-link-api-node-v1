/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { CreateStaffDto } from "./dto/create-staff.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { GuardRoles } from "@prisma/client";

@Injectable()
export class StaffsService {
  constructor(private prisma: PrismaService) {}

  async createStaff(businessId: number, { email, name, role }: CreateStaffDto) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) throw new NotFoundException("Invalid business");
    let dbRole = await this.prisma.role.findFirst({
      where: { name: role, businessId },
    });
    if (!dbRole)
      dbRole = await this.prisma.role.create({
        data: {
          businessId,
          name: role,
        },
      });
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user)
      return this.inviteExistingUser({
        businessId,
        userId: user.id,
        roleId: dbRole.id,
        role,
      });

    return this.inviteNewUser({
      businessId,
      email,
      name,
      roleId: dbRole.id,
      role,
    });
  }
  private async inviteExistingUser({
    businessId,
    userId,
    roleId,
    role,
  }: {
    businessId: number;
    userId: number;
    roleId: number;
    role: GuardRoles;
  }) {
    const staff = await this.prisma.staff.findFirst({
      where: { userId, businessId },
    });
    if (staff)
      throw new BadRequestException("Staff already exists in the business");
    await this.prisma.staff.create({
      data: {
        role: { connect: { id: roleId } },
        user: { connect: { id: userId } },
        business: { connect: { id: businessId } },
      },
    });
    await this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    return {
      message: "User invited successfully",
      status: "success",
    };
  }

  private async inviteNewUser({
    businessId,
    email,
    name,
    roleId,
    role,
  }: {
    businessId: number;
    email: string;
    name: string;
    roleId: number;
    role: GuardRoles;
  }) {
    const hashedPassword = bcrypt.hashSync(
      process.env.NEW_ADMIN_PASSWORD,
      bcrypt.genSaltSync(),
    );
    const user = await this.prisma.user.create({
      data: { email, name, password: hashedPassword, role },
    });
    await this.prisma.staff.create({
      data: {
        role: { connect: { id: roleId } },
        user: { connect: { id: user.id } },
        business: { connect: { id: businessId } },
      },
    });
    return {
      message: "User invited successfully",
      status: "success",
    };
  }

  async findAllStaffs(businessId: number) {
    const staffs = await this.prisma.staff.findMany({
      where: { businessId },
      select: {
        user: { select: { name: true, id: true, email: true } },
        role: { select: { name: true, id: true } },
      },
    });
    return {
      message: "Staffs fetched successfully",
      status: "success",
      data: staffs,
    };
  }

  async findStaff(staffId: number, businessId: number) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business) throw new NotFoundException("Invalid business");

    const staff = await this.prisma.staff.findUnique({
      where: { userId_businessId: { userId: staffId, businessId } },
      select: {
        role: true,
        shifts: {
          select: {
            // startTime: true,
            // endTime: true,
            periods: true,
            assignedTables: {
              select: { table: { select: { id: true, identifier: true } } },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        ordersAsWaiter: {
          select: {
            id: true,
            tableId: true,
            status: true,
            tip: true,
            payment: { select: { amount: true } },
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        ordersAsKitchenStaff: {
          select: {
            id: true,
            tableId: true,
            status: true,
            // tip: true,
            payment: { select: { amount: true } },
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        business: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    if (!staff || !["waiter", "kitchen"].includes(staff.role.name))
      throw new NotFoundException(`User is not a staff 
        in the business of of id ${businessId}`);
    return {
      message: "Staff fetched successfully",
      success: "true",
      data: {
        id: staffId,
        name: staff.user.name,
        role: staff.role.name,
        email: staff.user.email,
        business: {
          id: staff.business.id,
          name: staff.business.name,
        },
        shifts: staff.shifts,
        orders:
          staff.role.name === "waiter"
            ? staff.ordersAsWaiter
            : staff.ordersAsKitchenStaff,
      },
    };
  }

  async waiterAnalytics(userId: number, businessId: number, sortBy: string) {
    if (!sortBy) sortBy = "thisYear";
    const staff = await this.findStaff(userId, businessId);

    if (staff.data.role != "waiter")
      throw new BadRequestException("This staff is not a waiter");

    let startDate: Date;
    let endDate: Date;

    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisYear = new Date(today.getFullYear(), 0, 1);

    switch (sortBy) {
      case "today":
        startDate = today;
        startDate = new Date(startDate.setHours(0, 0, 0, 0));
        endDate = today;
        endDate = new Date(endDate.setHours(23, 59, 59, 999));
        break;

      case "yesterday":
        startDate = yesterday;
        startDate = new Date(startDate.setHours(0, 0, 0, 0));
        endDate = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        endDate = new Date(endDate.setHours(23, 59, 59, 999));
        break;

      case "thisWeek":
        startDate = thisWeek;
        startDate = new Date(startDate.setHours(0, 0, 0, 0));
        endDate = today;
        endDate.setHours(23, 59, 59, 999);
        break;

      case "thisMonth":
        startDate = thisMonth;
        startDate.setHours(0, 0, 0, 0);
        endDate = today;
        endDate.setHours(23, 59, 59, 999);
        break;

      case "thisYear":
        startDate = thisYear;
        startDate.setHours(0, 0, 0, 0);

        endDate = today;
        endDate.setHours(23, 59, 59, 999);
        break;

      default:
        startDate = new Date(0); // All time
        startDate.setHours(0, 0, 0, 0);
        endDate = today;
        endDate.setHours(23, 59, 59, 999);

        break;
    }
    // Retrieve the orders data for the specified date range and for the specified waiter
    const orders = await this.prisma.order.findMany({
      where: {
        waiterId: userId,
        businessId,
        createdAt: { gte: startDate, lt: endDate },
      },
      select: {
        id: true,
        tip: true,
        table: true,
        status: true,
        // paidAt: true,
        cancelledAt: true,
        completedAt: true,
        payment: true,
        options: true,
        _count: true,
        shift: true,
        waiter: true,
        cancelledBy: true,
        customer: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        createdAt: true,
      },
    });

    const waiterId = userId;

    const ordersTaken = orders.length;

    const relevantOrders = orders.filter(
      (order) =>
        order.waiter.userId === waiterId &&
        order.payment !== null &&
        order.payment.amount > 0,
    );
    const totalPaymentAmount = relevantOrders.reduce(
      (acc, order) => acc + order.payment.amount,
      0,
    );
    const averageOrderValue = totalPaymentAmount / relevantOrders.length;

    const tipsReceived = orders
      .filter((order) => order.waiter.userId === waiterId)
      .reduce((acc, order) => acc + (order.tip || 0), 0);

    const uniqueTables = new Set(
      orders
        .filter((order) => order.waiter.userId === waiterId)
        .map((order) => order.table.identifier),
    );
    const numTables = uniqueTables.size;

    const totalRevenue = orders
      .filter(
        (order) => order.waiter.userId === waiterId && order.payment !== null,
      )
      .reduce((acc, order) => acc + order.payment.amount, 0);

    const paidOrders = orders.filter(
      (order) =>
        order.waiter.userId === waiterId && order.payment.paidAt !== null,
    ).length;
    const completedOrders = orders.filter(
      (order) => order.waiter.userId === waiterId && order.completedAt !== null,
    ).length;
    const cancelledOrders = orders.filter(
      (order) =>
        order.waiter.userId === waiterId &&
        order.cancelledAt !== null &&
        order.cancelledBy === waiterId,
    ).length;
    const totalSales = orders
      .filter(
        (order) => order.waiter.userId === waiterId && order.payment !== null,
      )
      .reduce((acc, order) => acc + order.payment.amount, 0);

    const previousPeriodSales = orders
      .filter(
        (order) =>
          order.waiter.userId === waiterId &&
          order.createdAt < endDate &&
          order.payment !== null,
      )
      .reduce((acc, order) => acc + order.payment.amount, 0);

    const salesGrowthRate =
      ((totalSales - previousPeriodSales) / previousPeriodSales) * 100;
    return {
      // orders,
      timeFrame: sortBy,
      date: endDate.toISOString(),
      businessId: businessId,
      currency: "NGN",
      waiter_performance: {
        waiterId: userId,
        orders_taken: ordersTaken,
        total_payment_amount: totalPaymentAmount,
        average_order_value: averageOrderValue,
        tips_received: tipsReceived,
        tables_served: numTables,
      },
      waiter_sales_performance: {
        total_sales: totalSales,
        sales_growth_rate: salesGrowthRate,
      },
      orders: {
        count: ordersTaken,
        total_revenue: totalRevenue,
        average_order_value: averageOrderValue,
        by_status: {
          paidAt: paidOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
        },
      },
    };
  }

  async kitchenStaffAnalytics(
    userId: number,
    businessId: number,
    sortBy: string,
  ) {
    if (!sortBy) sortBy = "thisYear";
    const staff = await this.findStaff(userId, businessId);

    if (staff.data.role != "kitchen")
      throw new BadRequestException("This user is not a Kitchen stafff");

    let startDate: Date;
    let endDate: Date;

    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisYear = new Date(today.getFullYear(), 0, 1);

    switch (sortBy) {
      case "today":
        startDate = today;
        startDate = new Date(startDate.setHours(0, 0, 0, 0));
        endDate = today;
        endDate = new Date(endDate.setHours(23, 59, 59, 999));
        break;

      case "yesterday":
        startDate = yesterday;
        startDate = new Date(startDate.setHours(0, 0, 0, 0));
        endDate = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        endDate = new Date(endDate.setHours(23, 59, 59, 999));
        break;

      case "thisWeek":
        startDate = thisWeek;
        startDate = new Date(startDate.setHours(0, 0, 0, 0));
        endDate = today;
        endDate.setHours(23, 59, 59, 999);
        break;

      case "thisMonth":
        startDate = thisMonth;
        startDate.setHours(0, 0, 0, 0);
        endDate = today;
        endDate.setHours(23, 59, 59, 999);
        break;

      case "thisYear":
        startDate = thisYear;
        startDate.setHours(0, 0, 0, 0);

        endDate = today;
        endDate.setHours(23, 59, 59, 999);
        break;

      default:
        startDate = new Date(0); // All time
        startDate.setHours(0, 0, 0, 0);
        endDate = today;
        endDate.setHours(23, 59, 59, 999);

        break;
    }
    const orders = await this.prisma.order.findMany({
      where: {
        kitchenStaffId: userId,
        businessId,
        createdAt: { gte: startDate, lt: endDate },
      },
      select: {
        id: true,
        tip: true,
        table: true,
        status: true,
        cancelledAt: true,
        completedAt: true,
        payment: true,
        options: true,
        _count: true,
        shift: true,
        waiter: true,
        kitchenStaff: true,
        cancelledBy: true,
        customer: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        createdAt: true,
      },
    });

    const kitchenStaffId = userId;

    const ordersTaken = orders.length;

    const relevantOrders = orders.filter(
      (order) =>
        order.kitchenStaff.userId === kitchenStaffId &&
        order.payment !== null &&
        order.payment.amount > 0,
    );
    const totalPaymentAmount = relevantOrders.reduce(
      (acc, order) => acc + order.payment.amount,
      0,
    );
    const averageOrderValue = totalPaymentAmount / relevantOrders.length;

    const uniqueTables = new Set(
      orders
        .filter((order) => order.kitchenStaff.userId === kitchenStaffId)
        .map((order) => order.table.identifier),
    );
    const numTables = uniqueTables.size;

    const totalRevenue = orders
      .filter(
        (order) =>
          order.kitchenStaff.userId === kitchenStaffId &&
          order.payment !== null,
      )
      .reduce((acc, order) => acc + order.payment.amount, 0);

    const paidOrders = orders.filter(
      (order) =>
        order.kitchenStaff.userId === kitchenStaffId &&
        order.payment.paidAt !== null,
    ).length;
    const completedOrders = orders.filter(
      (order) =>
        order.kitchenStaff.userId === kitchenStaffId &&
        order.completedAt !== null,
    ).length;
    const cancelledOrders = orders.filter(
      (order) =>
        order.kitchenStaff.userId === kitchenStaffId &&
        order.cancelledAt !== null &&
        order.cancelledBy === kitchenStaffId,
    ).length;
    const totalSales = orders
      .filter(
        (order) =>
          order.kitchenStaff.userId === kitchenStaffId &&
          order.payment !== null,
      )
      .reduce((acc, order) => acc + order.payment.amount, 0);

    const previousPeriodSales = orders
      .filter(
        (order) =>
          order.kitchenStaff.userId === kitchenStaffId &&
          order.createdAt < endDate &&
          order.payment !== null,
      )
      .reduce((acc, order) => acc + order.payment.amount, 0);

    const salesGrowthRate =
      ((totalSales - previousPeriodSales) / previousPeriodSales) * 100;

    return {
      // orders,
      timeFrame: sortBy,
      date: endDate.toISOString(),
      businessId: businessId,
      currency: "NGN",
      kitchenStaff_performance: {
        kitchenStaffId,
        orders_taken: ordersTaken,
        total_payment_amount: totalPaymentAmount,
        average_order_value: averageOrderValue,
        tables_served: numTables,
      },
      kichenStaff_sales_performance: {
        total_sales: totalSales,
        sales_growth_rate: salesGrowthRate,
      },
      orders: {
        count: ordersTaken,
        total_revenue: totalRevenue,
        average_order_value: averageOrderValue,
        by_status: {
          paidAt: paidOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
        },
      },
    };
  }

  async getWaiter(userId: number, businessId: number): Promise<any> {
    const waiterAsUser = await this.prisma.staff.findUnique({
      where: { userId_businessId: { userId, businessId } },
      select: {
        role: true,
        shifts: {
          select: {
            // startTime: true,
            // endTime: true,
            periods: true,
            assignedTables: {
              select: { table: { select: { id: true, identifier: true } } },
            },
          },
        },
        ordersAsWaiter: {
          select: {
            id: true,
            tableId: true,
            status: true,
            tip: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    if (!waiterAsUser) throw new NotFoundException("Waiter not found");

    return {
      message: "waiter fetched successfully",
      success: "true",
      waiter: {
        id: userId,
        name: waiterAsUser.user.name,
        email: waiterAsUser.user.email,
        business: {
          id: waiterAsUser.business.id,
          name: waiterAsUser.business.name,
        },
        shifts: waiterAsUser.shifts,
        orders: waiterAsUser.ordersAsWaiter,
      },
    };
  }
}
