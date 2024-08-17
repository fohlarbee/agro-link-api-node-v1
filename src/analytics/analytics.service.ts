import { ForbiddenException, Injectable } from "@nestjs/common";
import { OrderStatus, PaymentProvider, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllAnalytics(creatorId: number, duration: "DAILY"|"WEEKLY"|"MONTHLY" = "DAILY") {
    const business = await this.prisma.business.findFirst({
      where: { creatorId }
    });
    if (!business) throw new ForbiddenException({
      message: "You do not own a restaurant",
      status: "error",
    });
    let durationQuery : string;
    switch (duration) {
      case "DAILY":
        durationQuery = `CURRENT_DATE AND NOW()`
        break;
      case "WEEKLY":
        durationQuery = "CURRENT_DATE - INTERVAL '1 WEEK' AND NOW()"
        break;
      case "MONTHLY":
        durationQuery = "CURRENT_DATE - INTERVAL '1 MONTH' AND NOW()"
        break;
    }

    const paymentMethodQuery = `
      WITH payments as (
        SELECT * FROM "Order" o 
          JOIN "Payment" p ON o."paymentId" = p.id 
          WHERE o."businessId" = ${business.id}
          AND o."createdAt" BETWEEN ${durationQuery}
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
    console.log(Prisma.raw(paymentMethodQuery));
    const paymentMethodCount: any[] = await this.prisma.$queryRaw`${Prisma.raw(paymentMethodQuery)}`;

    const orderStatusQuery = `
      WITH orders as (
        SELECT * FROM "Order" 
          WHERE "Order"."businessId" = ${business.id}
          AND "Order"."createdAt" BETWEEN ${durationQuery}
      )
      SELECT e.enumlabel AS status, COUNT(orders.status) AS count
        FROM pg_enum e
        LEFT JOIN orders ON CAST(orders.status AS text) = e.enumlabel
        WHERE e.enumtypid = (
          SELECT oid FROM pg_type WHERE typname = 'OrderStatus'
        )
        GROUP BY e.enumlabel;
    `;

    const orderStatusCount: any[] = await this.prisma.$queryRaw`${Prisma.raw(orderStatusQuery)}`;

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
      where: { businessId: business.id }
    });
    const paymentsQuery = `
      WITH orders as (
        SELECT * FROM "Order" o 
        LEFT JOIN "Payment" p ON o."paymentId" = p.id
        WHERE o."businessId" = ${business.id}
        AND o."createdAt" BETWEEN ${durationQuery}
      )
      SELECT e.enumlabel AS status, SUM(orders.amount) AS sum
        FROM pg_enum e
        LEFT JOIN orders ON CAST(orders.status AS text) = e.enumlabel
        WHERE e.enumtypid = (
          SELECT oid FROM pg_type WHERE typname = 'OrderStatus'
        )
        GROUP BY e.enumlabel;
    `;

    const payments: any[] = await this.prisma.$queryRaw`${Prisma.raw(paymentsQuery)}`;

    const { received, pending } = payments.reduce(
      (result, orderSum) => {
        switch(orderSum.status) {
          case OrderStatus.active:
            result.pending += Number(orderSum.sum);
            break;
          case OrderStatus.rejected:
          case OrderStatus.cancelled:
          case OrderStatus.failed:
            break;
          default:
            result.received += Number(orderSum.sum);
        }
        return result;
      }, { received: 0, pending: 0 }
    );

    return {
      message: "Analytics Data fetched successfully",
      status: "success", 
      data: {
        time_frame: duration,
        date: new Date(),
        businessId: business.id,
        business_name: business.name,
        currency: "NGN",
        orders: {
          by_status: orderStatusCount.reduce(
            (result, ordersCount) => {
              result[ordersCount.status] = Number(ordersCount.count);
              return result;
            }, {}
          ),
          by_payment_method: paymentMethodCount.reduce(
            (result, ordersCount) => {
              result[ordersCount.provider] = Number(ordersCount.count);
              return result;
            }, {}
          ),
        },
        payments: {
          pending,
          received,
        },
        menus: menusCount,
        staffs: staffsCount.reduce(
          (result, rolesCount) => {
            result[rolesCount.role] = Number(rolesCount.count);
            return result;
          }, {}
        ),
        options: optionsCount.reduce(
          (result, typeCount) => {
            result[typeCount.type] = Number(typeCount.count);
            return result;
          }, {}
        ),
        outlets: outlets.map(outlet => ({
            ...outlet, tables_count: Number(outlet.tables_count) 
          })
        )
      }
    }
  }
}
