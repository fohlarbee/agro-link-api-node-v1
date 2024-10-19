import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { OrderStatus, PaymentProvider, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

type DurationType = "DAILY" | "WEEKLY" | "MONTHLY";

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  private getDurationQuery(
    duration: DurationType = "DAILY",
    length: number = 1,
  ) {
    if (isNaN(length) || length < 1)
      throw new BadRequestException({
        message: "Invalid length submitted",
        status: "error",
      });

    switch (duration) {
      case "DAILY":
        return {
          start: `CURRENT_DATE - INTERVAL '${length - 1} DAY'`,
          end: `NOW()`,
        };
      case "WEEKLY":
        return {
          start: `CURRENT_DATE - INTERVAL '${length} WEEK'`,
          end: `NOW()`,
        };
      case "MONTHLY":
        return {
          start: `CURRENT_DATE - INTERVAL '${length} MONTH'`,
          end: `NOW()`,
        };
      default:
        throw new BadRequestException({
          message: `Invalid duration ${duration} provided`,
          status: "error",
        });
    }
  }

  async findAllAnalytics(
    creatorId: number,
    duration: DurationType = "DAILY",
    length: number = 1,
  ) {
    const business = await this.prisma.business.findFirst({
      where: { creatorId },
    });
    if (!business)
      throw new ForbiddenException({
        message: "You do not own a restaurant",
        status: "error",
      });
    const { start, end } = this.getDurationQuery(duration, length);

    const paymentMethodQuery = `
      WITH payments as (
        SELECT * FROM "Order" o 
          JOIN "Payment" p ON o."paymentId" = p.id 
          WHERE o."businessId" = ${business.id}
          AND o."createdAt" BETWEEN ${start} and ${end}
      )
      SELECT  e.enumlabel AS provider, COUNT(payments.provider) as count
        FROM pg_enum e
        LEFT JOIN payments ON CAST(payments.provider AS text) = e.enumlabel
        WHERE e.enumtypid = (
          SELECT oid FROM pg_type WHERE typname = 'PaymentProvider'
        )
        AND e.enumlabel != '${PaymentProvider.CUSTOMER_TIP}'
        GROUP BY e.enumlabel;
    `;

    const paymentMethodCount: any[] = await this.prisma
      .$queryRaw`${Prisma.raw(paymentMethodQuery)}`;

    const orderStatusQuery = `
      WITH orders as (
        SELECT * FROM "Order" 
          WHERE "Order"."businessId" = ${business.id}
          AND "Order"."createdAt" BETWEEN ${start} and ${end}
      )
      SELECT e.enumlabel AS status, COUNT(orders.status) AS count
        FROM pg_enum e
        LEFT JOIN orders ON CAST(orders.status AS text) = e.enumlabel
        WHERE e.enumtypid = (
          SELECT oid FROM pg_type WHERE typname = 'OrderStatus'
        )
        GROUP BY e.enumlabel;
    `;

    const orderStatusCount: any[] = await this.prisma
      .$queryRaw`${Prisma.raw(orderStatusQuery)}`;

    const outlets: any[] = await this.prisma.$queryRaw`
      SELECT o.id, o.address, COUNT(t.*) tables_count 
      FROM "Outlet" o
      JOIN "Table" t
        ON t."outletId" = o.id
      WHERE o."businessId" = ${business.id}
      GROUP BY o.id, o.address;
    `;

    const optionsCount: any[] = await this.prisma.$queryRaw`
        WITH options as (
        SELECT * FROM "Option" 
          WHERE "Option"."businessId" = ${business.id}
      )
      SELECT e.enumlabel AS type, COUNT(options.type) AS count
        FROM pg_enum e
        LEFT JOIN options ON CAST(options.type AS text) = e.enumlabel
        WHERE e.enumtypid = (
          SELECT oid FROM pg_type WHERE typname = 'optionType'
        )
        GROUP BY e.enumlabel;
      `;

    const staffsCount: any[] = await this.prisma.$queryRaw`
      SELECT  r.name AS role, COUNT(s.*) count
        FROM "Role" r
        LEFT JOIN "Staff" s ON s."roleId" = r.id
        WHERE r."businessId" = ${business.id}
        GROUP BY r.name;
      `;

    const menusCount = await this.prisma.menu.count({
      where: { businessId: business.id },
    });
    const paymentsQuery = `
      WITH orders as (
        SELECT * FROM "Order" o 
        LEFT JOIN "Payment" p ON o."paymentId" = p.id
        WHERE o."businessId" = ${business.id}
        AND o."createdAt" BETWEEN ${start} and ${end}
      )
      SELECT e.enumlabel AS status, SUM(orders.amount) AS sum
        FROM pg_enum e
        LEFT JOIN orders ON CAST(orders.status AS text) = e.enumlabel
        WHERE e.enumtypid = (
          SELECT oid FROM pg_type WHERE typname = 'OrderStatus'
        )
        GROUP BY e.enumlabel;
    `;

    const payments: any[] = await this.prisma
      .$queryRaw`${Prisma.raw(paymentsQuery)}`;

    const { received, pending } = payments.reduce(
      (result, orderSum) => {
        switch (orderSum.status) {
          case OrderStatus.active:
            result.pending += orderSum.sum;
            break;
          case OrderStatus.rejected:
          case OrderStatus.cancelled:
          case OrderStatus.failed:
            break;
          default:
            result.received += orderSum.sum;
        }
        return result;
      },
      { received: 0, pending: 0 },
    );

    return {
      message: "Analytics Data fetched successfully",
      status: "success",
      data: {
        duration,
        // date: new Date(),
        businessId: business.id,
        business_name: business.name,
        currency: "NGN",
        orders: {
          by_status: orderStatusCount.reduce((result, ordersCount) => {
            result[ordersCount.status] = ordersCount.count;
            return result;
          }, {}),
          by_payment_method: paymentMethodCount.reduce(
            (result, ordersCount) => {
              result[ordersCount.provider] = ordersCount.count;
              return result;
            },
            {},
          ),
        },
        payments: {
          pending,
          received,
        },
        menus: menusCount,
        staffs: staffsCount.reduce((result, rolesCount) => {
          result[rolesCount.role] = rolesCount.count;
          return result;
        }, {}),
        options: optionsCount.reduce((result, typeCount) => {
          result[typeCount.type] = typeCount.count;
          return result;
        }, {}),
        outlets: outlets.map((outlet) => ({
          ...outlet,
          tables_count: outlet.tables_count,
        })),
      },
    };
  }

  async findStaffAnalytics(
    creatorId: number,
    duration: DurationType = "DAILY",
    length: number = 1,
  ) {
    const business = await this.prisma.business.findFirst({
      where: { creatorId },
    });
    if (!business)
      throw new ForbiddenException({
        message: "You do not own a restaurant",
        status: "error",
      });
    const { start, end } = this.getDurationQuery(duration, length);

    const staffsCount: any[] = await this.prisma.$queryRaw`
      SELECT  r.id as roleId, r.name AS role, COUNT(s.*) count
        FROM "Role" r
        LEFT JOIN "Staff" s ON s."roleId" = r.id
        WHERE r."businessId" = ${business.id}
        GROUP BY r.id, r.name
        ORDER BY count DESC;
      `;

    const staffs = await this.prisma.$queryRaw`
      SELECT u.id, u.name, r.name as role from "Staff" s
        JOIN "User" u ON u.id = s."userId"
        JOIN "Role" r ON r.id = s."roleId"
        WHERE s."businessId" = ${business.id}
    `;

    const waiterOrdersQuery = `
      WITH processed_orders AS (
        SELECT u.id AS userId, s."roleId" as roleId, count(*) AS count FROM "Order" o
          JOIN "User" u on (u.id = o."waiterId" OR u.id = o."kitchenStaffId")
          JOIN "Staff" s ON s."userId" = u.id
          WHERE o."businessId" = 1
          AND o.status not in ('active', 'failed', 'cancelled')
          AND o."createdAt" BETWEEN ${start} and ${end}
          GROUP BY u.id, s."roleId"
      ), roles as (
        SELECT DISTINCT roleId from processed_orders
      )
      SELECT u.id, u.name, r.name as role, COALESCE(o.count, 0) AS ordersCount from "Staff" s
        JOIN "User" u ON s."userId" = u.id
        JOIN "Role" r ON s."roleId" = r.id
        LEFT JOIN processed_orders o ON u.id = o.userId
        WHERE s."businessId" = ${business.id}
        AND s."roleId" in (SELECT roleId FROM roles)
        ORDER BY ordersCount DESC;
    `;

    const staffOrders: any[] = await this.prisma
      .$queryRaw`${Prisma.raw(waiterOrdersQuery)}`;

    const staffShiftsQuery = `
      WITH staff_shifts AS (
        SELECT * FROM "Shift"
          WHERE "businessId" = ${business.id}
          AND (
            "Shift"."startTime" BETWEEN ${start} AND CURRENT_DATE + INTERVAL '1 DAY' OR 
            "Shift"."endTime" BETWEEN ${start} AND CURRENT_DATE + INTERVAL '1 DAY' OR
            ("Shift"."startTime" < NOW() AND "Shift"."endTime" > NOW())
          )
      ), active_shifts as (
        SELECT "userId", count(*) from staff_shifts
          WHERE "startTime" <= NOW()
          AND "endTime" >= NOW()
          GROUP BY "userId"
      ), upcoming_shifts as (
        SELECT "userId", count(*) from staff_shifts
          WHERE "startTime" > NOW()
          GROUP BY "userId"
      ), completed_shifts as (
        SELECT "userId", count(*) from staff_shifts
          WHERE "endTime" < NOW()
          GROUP BY "userId"
      )
      SELECT u.id, u.name, r.name as role, 
        COALESCE(active.count, 0) AS "activeShifts",
        COALESCE(upcoming.count, 0) AS "upcomingShifts",
        COALESCE(completed.count, 0) AS "completedShifts" 
        FROM "Staff" s
        JOIN "User" u ON s."userId" = u.id
        JOIN "Role" r ON s."roleId" = r.id
        LEFT JOIN active_shifts AS active ON s."userId" = active."userId"
        LEFT JOIN upcoming_shifts AS upcoming ON s."userId" = upcoming."userId"
        LEFT JOIN completed_shifts AS completed ON s."userId" = completed."userId"
        WHERE s."businessId" = ${business.id};
    `;

    console.log(staffShiftsQuery);

    const staffShifts: any[] = await this.prisma
      .$queryRaw`${Prisma.raw(staffShiftsQuery)}`;
    return {
      message: "Analytics Data fetched successfully",
      status: "success",
      data: {
        businessId: business.id,
        business_name: business.name,
        roles: staffsCount.reduce((result, rolesCount) => {
          result[rolesCount.role] = rolesCount.count;
          return result;
        }, {}),
        staffs,
        staffOrders,
        staffShifts,
      },
    };
  }
}
